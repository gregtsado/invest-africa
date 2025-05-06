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
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // For all other routes, use withAuth middleware
  return withAuthMiddleware(request)
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