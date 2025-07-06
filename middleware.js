import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const { pathname} = req.nextUrl
  const token = await getToken({ req })

  // Always allow:
  // 1. NextAuth.js API routes
  // 2. Public files
  if (
    pathname.includes('.') || // Static files
    pathname.startsWith('/_next') ||
    pathname.startsWith('/forgot-password') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/api/reset-password') ||
    pathname.startsWith('/api/verify-token') ||
    pathname.startsWith('/api/extract-text')
  
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


// // middleware.js
// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt'

// export async function middleware(req) {
//     const { pathname} = req.nextUrl
//   const token = await getToken({ req })

//   // Skip middleware for API routes
//   if (req.nextUrl.pathname.startsWith('/api/')) {
//     return NextResponse.next();
//   }
  
//    // Allow access to login and forget-password pages without authentication
//     const publicPaths = ['/login', '/forgot-password','/reset-password'];
//     if (publicPaths.includes(pathname) && token) {
//         // If already authenticated, redirect from login or forget-password to home
//         return NextResponse.redirect(new URL('/home', req.url));
//     }
//     if (!token && !publicPaths.includes(pathname)) {
//         // If not authenticated and not accessing a public path, redirect to login
//         const loginUrl = new URL('/login', req.url)
//         loginUrl.searchParams.set('from', pathname)
//         return NextResponse.redirect(loginUrl)
//     }
  
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ]
// };