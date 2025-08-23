// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 import { verifyToken } from './lib/auth/tokens'
import { parseCookie } from './lib/auth/cookies'

// Define routes that need protection
const protectedRoutes = ['/dashboard', '/profile', '/api/protected']
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookies = request.cookies.toString()
  const { token } = parseCookie(cookies)

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if route is auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Verify token for protected routes
  if (isProtectedRoute) {
    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    try {
      const isValid = await verifyToken(token)
      if (!isValid) {
        const url = new URL('/login', request.url)
        url.searchParams.set('from', pathname)
        return NextResponse.redirect(url)
      }
    } catch (error) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && token) {
    try {
      const isValid = await verifyToken(token)
      if (isValid) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    } catch (error) {
      // Token is invalid, allow access to auth route
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}