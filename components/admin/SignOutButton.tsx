"use client"

import React from 'react'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export default function SignOutButton({ className }: { className?: string }) {
  const handleSignOut = async () => {
    try {
      await authClient.signOut()
    } catch (err) {
      console.error('Sign out failed', err)
    } finally {
      window.location.assign('/admin/login')
    }
  }

  return (
    <Button onClick={handleSignOut} className={className}>
      Sign Out
    </Button>
  )
}
