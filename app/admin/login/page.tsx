"use client"

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import StockAdmin from '../../../public/stockadmin.jpg'
import LogoIcon from "../../../public/logo-icon.png"
import { signIn } from '@/lib/auth-client'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoIosHome } from "react-icons/io";
import Link from 'next/link'



const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
})
type FormFields = z.infer<typeof schema>

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    // read query param from window location (client-only)
    try {
      const params = new URLSearchParams(window.location.search)
      const err = params.get('error')
      if (err) setServerError(decodeURIComponent(err))
    } catch (e) {
      // ignore in non-browser environments
    }
  }, [])

  const dismissServerError = () => {
    try {
      const params = new URLSearchParams(window.location.search)
      params.delete('error')
      const qs = params.toString()
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
      history.replaceState({}, '', newUrl)
    } catch (e) {
      // ignore
    }
    setServerError(null)
  }

  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({ resolver: zodResolver(schema) })

  const onValid = (values: FormFields) => {
    setIsSubmitting(true)
    ;(async () => {
      try {
        const result = await signIn.email({
          email: values.email,
          password: values.password,
        })
        if (result.error) {
          setServerError(result.error.message || 'Sign-in failed')
          setIsSubmitting(false)
          return
        }
        window.location.assign('/admin/dashboard')
      } catch (err) {
        setServerError('Network error')
        setIsSubmitting(false)
      }
    })()
  }

  const onInvalid = () => {
    // leave isSubmitting false; errors are shown via `errors`
  }

  return (
    <div>
      <div className='flex flex-row items-end gap-4 p-4 absolute'>
        <IoIosHome onClick={() => window.location.assign('/')} width={50} height={20} color={'#FF7300'} className="text-3xl cursor-pointer transition" />
        <Link href="/">
          <p className='font-light text-[#16205B] hover:text-[#FF7300] transition-all'>Back to Homepage</p>
        </Link>
      </div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">

        {serverError && <PageToastGuard message={serverError} onClose={dismissServerError} />}

        <div className="flex justify-center mb-6">
          <Image src={LogoIcon} alt="Logo Icon" width={60} height={60} className="shrink-0" />
        </div>
        <h2 className="text-3xl font-semibold text-center mb-6">Admin Dashboard</h2>


        <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-stretch gap-8">
          <div className="w-full md:w-1/2">
            <div className="w-full">
              <div className="bg-white p-6 md:p-8 rounded-md shadow-sm mt-8">
                <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                  <label className="text-sm font-medium">Email</label>
                  {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
                  <input {...register('email')} name="email" type="email" required className='w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16205B]' placeholder="your@email.com" />

                  <label className="text-sm font-medium">Password</label>
                  {errors.password && <span className='text-red-500 text-sm'>{errors.password.message}</span>}
                  <input {...register('password')} name="password" type="password" required minLength={6} className='w-full border p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#16205B]' placeholder="••••••••" />

                  <div className="flex justify-center">
                    <button type="button" onClick={() => handleSubmit(onValid, onInvalid)()} className="rounded-full bg-[#16205B] mt-4 px-6 py-2 w-full md:w-auto text-md text-white font-semibold shadow-md transition-all duration-300 hover:bg-[#0f1a4a] active:scale-95" disabled={isSubmitting}>{isSubmitting ? 'Logging In…' : 'Login'}</button>
                  </div>

                </form>
              </div>
            </div>
          </div>

          <div className="hidden md:flex w-full md:w-1/2 items-center justify-center">
            <div className="relative w-full h-64 md:h-105 rounded-md overflow-hidden">
              <Image src={StockAdmin} alt="Stock Admin" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Simple client-side toast that can be used across the page
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white border-3 border-[#e70000] px-4 py-3 rounded-md shadow-lg flex items-start gap-3">
        <div className="flex-1">
          <p className="font-semibold text-[#e70000]">Error</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onClose} aria-label="Close error" className="text-xl w-9 h-9 flex rounded-full bg-white/10 hover:bg-white/20 transition">×</button>
      </div>
    </div>
  )
}

// Render toast when serverError exists
// (placed below to keep the main return simple)
export function PageToastGuard({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null
  return <Toast message={message} onClose={onClose} />
}
