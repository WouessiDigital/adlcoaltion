"use client"

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import StockAdmin from '../../../public/stockadmin.jpg'
import LogoIcon from "../../../public/logo-icon.png"
import { Button } from "@/components/ui/button"
import { signUp } from '@/lib/auth-client'
import { z } from 'zod'
import { IoIosHome } from "react-icons/io";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import { authClient } from "@/lib/auth-client";



const schema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
})
type FormFields = z.infer<typeof schema>

export default function SignUp() {
  const formRef = useRef<HTMLFormElement | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();




  const handleSubmit = async (data: FormFields) => {

    if (confirmPassword !== password) {
      setError("Passwords do not match")
      return
    } 

    if (password.length < 8){
      return setError("Password must be at least 8 characters long");
    }
    setIsSubmitting(true)
    try {
      const result = await authClient.signUp.email({
                email,
                name: "Admin",
                password,
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/admin/login");
                    },
                    onError: (ctx) => {
                        setError(ctx.error.message || "Failed to sign up");
                        setLoading(false);
                    }
                }
      })
      if (result.error) {
        console.log(result.error.message);
        setError(result.error.message || 'Sign-up failed')
        setIsSubmitting(false)
        return
      }
      // success -> go to dashboard
      window.location.assign('/admin/dashboard')
    } catch (err) {
      console.log(err);
      setError('Network error')
      setIsSubmitting(false)
    } finally {
      // just ensure the submitting flag is cleared; don't navigate to login here
      setIsSubmitting(false)
    }
  }

  const onInvalid = () => {
    // leave isSubmitting false; errors are shown via `errors`
  }

  return (
    <div className=''>
      <IoIosHome onClick={() => window.location.assign('/')} width={50} height={20} color={'#FF7300'} className="text-3xl cursor-pointer transition" />
      <Link href="/">
        <p className='font-light text-[#16205B] hover:text-[#FF7300] transition-all'>Back to Homepage</p>
      </Link>

      <div className="min-h-screen flex flex-col items-center justify-center bg-white">


        <div className="flex justify-center">
          <Image src={LogoIcon} alt="Logo Icon" width={60} height={60} className="shrink-0" />
        </div>
        <h2 className="text-3xl font-semibold text-center mb-6">Admin Dashboard</h2>

        <div className="p-2">
          <Card className="w-full max-w-sm shadow-sm p-1">
            <CardHeader>
              <CardTitle className="text-xl">Create Admin Account</CardTitle>
              <CardDescription>Enter your email and password to create a new account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit({ email, password } as FormFields); }} className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Password</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-sm font-medium text-gray-700">Confirm Password</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/admin/login" className="text-blue-500 hover:underline">Sign In</Link>
              </p>
            </CardFooter>
          </Card>
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
