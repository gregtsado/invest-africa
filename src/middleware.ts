import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
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

// Protect all routes except public ones
export const config = {
  matcher: [
    /*
     * Match all protected routes
     * - /dashboard
     * - /admin
     * - /contribute
     * - /api/admin
     * - /api/contributor
     */
    '/dashboard/:path*',
    '/admin/:path*',
    '/contribute/:path*',
    '/api/admin/:path*',
    '/api/contributor/:path*'
  ]
}