import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: 'default' | 'wide' | 'narrow' | 'full'
  className?: string
}

export function PageLayout({ 
  children, 
  maxWidth = 'default',
  className = ''
}: PageLayoutProps) {
  const maxWidthClasses = {
    narrow: 'max-w-3xl',
    default: 'max-w-7xl',
    wide: 'max-w-[1400px]',
    full: 'max-w-full'
  }

  return (
    <div className={`w-full ${maxWidthClasses[maxWidth]} mx-auto px-4 md:px-6 py-8 md:py-12 ${className}`}>
      {children}
    </div>
  )
}

