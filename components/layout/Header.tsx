'use client'

import Link from 'next/link'
import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { ChefHat, Home, BookOpen, PlusCircle, User } from 'lucide-react'

export function Header() {
  const { isSignedIn, user } = useUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl md:text-2xl text-neutral-900 hover:text-primary transition-colors">
          <ChefHat className="h-7 w-7 text-primary" />
          <span className="hidden sm:inline">Another Home Cook</span>
          <span className="sm:hidden">AHC</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link href="/recipes">
            <Button variant="ghost" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Recipes
            </Button>
          </Link>
          {isSignedIn && (
            <Link href="/admin">
              <Button variant="ghost" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Recipe
              </Button>
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline text-sm text-neutral-600">
                Hello, {user?.firstName || 'Chef'}!
              </span>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9"
                  }
                }}
              />
            </div>
          ) : (
            <SignInButton mode="modal">
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-neutral-100 bg-white">
        <nav className="container mx-auto flex items-center justify-around px-4 py-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1">
              <Home className="h-5 w-5" />
              <span className="text-xs">Home</span>
            </Button>
          </Link>
          <Link href="/recipes">
            <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1">
              <BookOpen className="h-5 w-5" />
              <span className="text-xs">Recipes</span>
            </Button>
          </Link>
          {isSignedIn && (
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="flex-col h-auto py-2 gap-1">
                <PlusCircle className="h-5 w-5" />
                <span className="text-xs">Add</span>
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

