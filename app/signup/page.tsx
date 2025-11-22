'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, Lock, User, ArrowRight, Sparkles, Check } from 'lucide-react'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      if (data.session) {
         router.push('/dashboard')
      } else {
         alert('Please check your email to confirm your account!')
         router.push('/login')
      }
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex bg-white">
      
      {/* LEFT SIDE: BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-indigo-600 relative flex-col justify-between p-12 text-white overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
               <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">R</div>
               ResumeAI
            </div>
         </div>

         <div className="relative z-10 mb-20">
            <h1 className="text-5xl font-bold leading-tight mb-6">Start building your career today.</h1>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-indigo-100 bg-indigo-500/30 p-3 rounded-xl backdrop-blur-sm w-fit">
                  <div className="bg-white text-indigo-600 p-1 rounded-full"><Sparkles size={14}/></div>
                  <span className="font-medium">Pro Resume Builder</span>
               </div>
               <div className="flex items-center gap-3 text-indigo-100 bg-indigo-500/30 p-3 rounded-xl backdrop-blur-sm w-fit">
                  <div className="bg-white text-indigo-600 p-1 rounded-full"><Check size={14}/></div>
                  <span className="font-medium">20+ Professional Templates</span>
               </div>
            </div>
         </div>

         <div className="relative z-10 text-sm text-indigo-200">
            © 2024 ResumeAI Inc. All rights reserved.
         </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
            <p className="mt-2 text-gray-600">Get started with your free account today.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
             {error && <div className="bg-red-50 text-red-600 p-3 text-sm rounded-lg text-center">{error}</div>}
             
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><User size={18}/></div>
                   <input 
                     type="text" 
                     required 
                     suppressHydrationWarning
                     className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                     placeholder="John Doe"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                   />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Mail size={18}/></div>
                   <input 
                     type="email" 
                     required 
                     suppressHydrationWarning
                     className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                     placeholder="name@example.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                   />
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Lock size={18}/></div>
                   <input 
                     type="password" 
                     required 
                     suppressHydrationWarning
                     className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                   />
                </div>
                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters.</p>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               suppressHydrationWarning
               className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 transition-all"
             >
               {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Create Account"}
             </button>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
             <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or sign up with</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            suppressHydrationWarning
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
             <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
             Google
          </button>

          <div className="text-center">
             <p className="text-sm text-gray-600">
                Already have an account? {' '}
                <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
                   Sign in
                </Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  )
}