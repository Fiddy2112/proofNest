import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.delete(name)
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.delete(name)
        },
      },
    }
  )

  // Session Audit - Use getUser() instead of getSession() for extra security
  const { data: { user } } = await supabase.auth.getUser()

  // If you haven't logged in and tried to go to the dashboard -> Kick to login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Validate folder access - user can only view their own folders
  if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const folderId = request.nextUrl.searchParams.get('folderId')
    if (folderId) {
      const { data: folder } = await supabase
        .from('folders')
        .select('id')
        .eq('id', folderId)
        .eq('user_id', user.id)
        .single()
      
      if (!folder) {
        // Folder doesn't exist or doesn't belong to user - redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  // If you are logged in and try to go to auth pages -> Kick to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/dashboard', '/login', '/signup']
}