import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    
    // FIX: Wrap cookieStore in Promise.resolve() to satisfy Next.js 15 + Supabase types
    // This matches the fix we used in your Payment API
    const supabase = createRouteHandlerClient({ 
        cookies: () => Promise.resolve(cookieStore) 
    })
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Auth Code Exchange Error:', error)
      // If auth fails, redirect to login with an error message
      return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
    }
  }

  // Successful login -> Redirect to dashboard
  return NextResponse.redirect(new URL(next, request.url))
}