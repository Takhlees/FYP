import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const { pathname} = req.nextUrl
  const token = await getToken({ req })

  // Always allow:
  // 1. NextAuth.js API routes
  // 2. Public files
  if (
    pathname.startsWith('/api/auth') ||
    pathname.includes('.') || // Static files
    pathname.startsWith('/_next') ||
    pathname.startsWith('/forget-password')

  ) {
    return NextResponse.next()
  }

  // If trying to access login while authenticated
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/home', req.url))
  }

  // If unauthenticated and accessing protected route
  if (!token && pathname !== '/login') {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)']
}