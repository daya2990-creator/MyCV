import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    
    // CRITICAL FIX: 
    // Next.js 15 cookies are async. We await them above.
    // The Supabase helper type definition is slightly outdated for Next 15, causing a TS error.
    // We use @ts-ignore to force passing the 'cookieStore' object directly, which works at runtime.
    
    // @ts-ignore
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Auth Exchange Error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}