import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const type = requestUrl.searchParams.get('type') // Check for 'recovery'
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    
    // @ts-ignore
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      if (type === 'recovery') {
         // Special flow for password recovery links
         // Verify the OTP manually to log them in
         await supabase.auth.verifyOtp({
            token_hash: code,
            type: 'recovery',
         })
      } else {
         // Standard flow for magic links / google
         await supabase.auth.exchangeCodeForSession(code)
      }
    } catch (error) {
      console.error('Auth Exchange Error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Link Expired or Invalid`)
    }
  }

  // Redirect to 'next' (e.g. /update-password)
  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}