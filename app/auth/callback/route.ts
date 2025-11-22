import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // ERROR FIX: In Next.js 15, we must 'await' cookies()
    const cookieStore = await cookies()
    
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    })
    
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin + '/dashboard')
}