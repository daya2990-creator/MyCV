import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  // Default to dashboard
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    
    // @ts-ignore - Intentionally ignoring the Promise type mismatch to ensure functionality
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Use relative redirect to avoid domain mismatch issues
  // The browser will resolve this against the current origin
  return NextResponse.redirect(new URL(next, request.url))
}