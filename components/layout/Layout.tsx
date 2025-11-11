import type { ReactNode } from 'react'

import { Footer } from './Footer'
import { Header } from './Header'

type LayoutProps = {
  children: ReactNode
  padded?: boolean
}

export function Layout({ children, padded = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className={padded ? 'mx-auto w-full max-w-6xl px-4 py-10' : ''}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

