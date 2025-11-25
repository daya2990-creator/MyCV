'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { AppLogo } from '../../components/AppLogo'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()

  // Check for errors in URL (e.g. from auth callback redirect)
  useEffect(() => {
    const errorMsg = searchParams.get('error_description') || searchParams.get('error')
    if (errorMsg) {
      // Clean up error message (replace + with spaces)
      setError(decodeURIComponent(errorMsg).replace(/\+/g, ' '))
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="max-w-md w-full space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-gray-600">Enter your details to access your dashboard.</p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 text-sm rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-50 lg:bg-white text-gray-500">Or continue with email</span></div>
          </div>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18}/></div>
                  <input 
                    type="email" 
                    required 
                    suppressHydrationWarning
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
            </div>
            <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">Forgot?</Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18}/></div>
                  <input 
                    type="password" 
                    required 
                    suppressHydrationWarning
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            suppressHydrationWarning
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <span className="flex items-center gap-2">Sign In <ArrowRight size={16}/></span>}
          </button>
      </form>

      <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? {' '}
            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-500">
                Create one for free
            </Link>
          </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 text-white overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover opacity-20"></div>
         <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-slate-900/90"></div>
         
         <div className="relative z-10">
            <AppLogo textClassName="text-white" />
         </div>

         <div className="relative z-10 space-y-6">
            <h1 className="text-4xl font-bold leading-tight">"I got the job!"</h1>
            <p className="text-lg text-slate-300">Join thousands of professionals who have accelerated their careers with MyCV.guru.</p>
            
            <div className="space-y-3">
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-indigo-400" size={20}/> <span>ATS-Friendly Templates</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-indigo-400" size={20}/> <span>Instant PDF Download</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="text-indigo-400" size={20}/> <span>Real-time Preview</span>
               </div>
            </div>
         </div>
      </div>

      {/* RIGHT SIDE: FORM (Wrapped in Suspense) */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
         <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>}>
            <LoginForm />
         </Suspense>
      </div>
    </div>
  )
}