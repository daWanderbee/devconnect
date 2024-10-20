import { NextResponse, NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    const token = await getToken({ req: request })
    const url = request.nextUrl;

    if(token && 
        (
            url.pathname.startswith('/sign-in')||
            url.pathname.startswith('/sign-up')||
            url.pathname.startswith('/verify')||
            url.pathname.startswith('/')
    )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/',
    '/dashboard/:path*',
    '/verify/:path*',
    ],
}