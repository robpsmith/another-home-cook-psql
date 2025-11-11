'use client'

import Link from 'next/link'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function Nav() {
  const { isSignedIn } = useUser()

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Recipe Blog
        </Link>
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              <Link href="/admin">
                <Button variant="ghost">Admin</Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  )
}

