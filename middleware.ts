import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Obtener el token de las cookies
  const token = request.cookies.get('token')?.value
  const isAuthenticated = !!token

  // Rutas protegidas que requieren autenticación
  const protectedRoutes = ['/dashboard', '/settings', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Si intenta acceder a una ruta protegida sin estar autenticado
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/profile/:path*',
  ],
}
