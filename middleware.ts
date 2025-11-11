import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
  '/api/admin(.*)', // Protect admin API routes
  '/api/upload(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Protect admin routes and admin API routes
  // Note: /api/recipes GET is public, but POST/PUT/DELETE are protected
  // by authentication checks in the route handlers themselves
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}

