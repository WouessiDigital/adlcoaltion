import React from 'react'
import { getDb } from '@/lib/data/db'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Logo from '../../../public/LOGO.png'
import Link from 'next/link'
import SignOutButton from '@/components/admin/SignOutButton'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

type Member = {
    id: number
    name: string
    email: string
    message: string
    datecreated?: string
}
export const dynamic = 'force-dynamic'

export default async function Page() {
    // Server-side: read all members from the SQLite database
    const db = getDb()
    const stmt = db.prepare('SELECT id, name, email, message, datecreated FROM members ORDER BY id DESC')
    const members: Member[] = stmt.all()

    // Server-side session check
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) redirect('/admin/login')

    return (
        <main className="p-6 ">

            <div className='flex flex-row items-center justify-between mb-6'>
                <Image src={Logo} alt='Logo' width={150} height={20} priority />
                <SignOutButton className="rounded-full
                bg-[#FF7300]
                
                py-3 sm:py-4
                text-base sm:text-md md:text-lg
                text-white
                font-semibold
                shadow-md
                transition-all duration-300
                hover:bg-[#facc15] hover:shadow-lg hover:scale-105
                active:scale-95" />
            </div>
            <h1 className="text-3xl font-semibold mb-10 flex justify-center ">Admin Dashboard</h1>

            <div className='shadow-xl rounded-lg p-6 bg-white border-2 border-gray-200'>

                {members.length === 0 ? (
                    <p>No submissions yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto border-collapse">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Name</th>
                                    <th className="px-4 py-2 text-left">Email</th>
                                    <th className="px-4 py-2 text-left">Message</th>
                                    <th className="px-4 py-2 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((m) => (
                                    <tr key={m.id} className="border-t">
                                        <td className="px-4 py-2 align-top">{m.id}</td>

                                        <td className="px-4 py-2 align-top">{m.name}</td>
                                        <td className="px-4 py-2 align-top">{m.email}</td>
                                        <td className="px-4 py-2 align-top max-w-xl wrap-break-word">{m.message}</td>
                                        <td className="px-4 py-2 align-top">{m.datecreated ?? ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}
            </div>
        </main>
    )
}
