import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Nav } from '@/components/nav'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Recipe Not Found</h2>
        <p className="text-gray-600 mb-8">
          The recipe you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </main>
    </div>
  )
}

