import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageLayout } from '@/components/layout/PageLayout'
import { ChefHat, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <PageLayout>
      <div className="text-center py-16 md:py-24">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <ChefHat className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-4 text-neutral-900">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-neutral-700">Recipe Not Found</h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
          The recipe you're looking for doesn't exist or has been removed from our kitchen.
        </p>
        <Link href="/">
          <Button size="lg" className="gap-2 shadow-lg">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </PageLayout>
  )
}

