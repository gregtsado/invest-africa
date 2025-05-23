import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

// Middleware function without auth wrapper for public routes
export function middleware(request: NextRequestWithAuth) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/investments',
    '/impact',
    '/auth/signin',
    '/auth/signup',
    '/api/auth/register',
  ]
  // Check if the current path is a public route or a dynamic segment of a public route
  if (publicRoutes.some(route => pathname === route || (route.endsWith('/') && pathname.startsWith(route)))) {
    return NextResponse.next()
  }

  // For /investments/[id] routes, allow access without authentication
  if (pathname.startsWith('/investments/') && pathname.split('/').length === 3) {
    return NextResponse.next()
  }

  // For all other routes, use withAuth middleware
  // The withAuth-wrapped middleware expects (request, event) but Next.js only passes request.
  // We pass an empty object as the second argument to satisfy the type signature.
  return withAuthMiddleware(request, {} as any) // Added {} as any for the second argument
}

const withAuthMiddleware = withAuth(
  function auth(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl
    const { token } = request.nextauth

    // Admin-only routes
    const adminRoutes = ['/admin', '/api/admin']
    if (adminRoutes.some(route => pathname.startsWith(route))) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    // Contributor-only routes
    const contributorRoutes = ['/contribute', '/api/contributor']
    if (contributorRoutes.some(route => pathname.startsWith(route))) {
      if (!['ADMIN', 'CONTRIBUTOR'].includes(token?.role as string)) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - public files with extensions
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*$).*)',
  ],
}