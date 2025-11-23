'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Plus, FileText, LogOut, Loader2, Crown, Zap } from 'lucide-react'
import Link from 'next/link'
import { AppLogo } from '../../components/AppLogo'

export default function Dashboard() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: userProfile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    setProfile(userProfile)

    const { data: resumeList } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (resumeList) setResumes(resumeList)
    setLoading(false)
  }

  const createResume = async () => {
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('resumes')
      .insert([
        { user_id: user.id, title: 'My Resume', content: {}, template_id: 't1' }
      ])
      .select()
      .single()

    if (data) router.push(`/editor/${data.id}`)
    setCreating(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-600"/></div>

  const isPro = profile?.subscription_status === 'pro' || profile?.subscription_status === 'active';
  const credits = profile?.credits || 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b px-4 py-3 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <AppLogo />
          <div className="flex items-center gap-4">
             {isPro ? (
                <div className="hidden sm:flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
                   <Crown size={14}/> Pro Member
                </div>
             ) : (
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">
                   <Zap size={14} className="text-amber-500 fill-amber-500"/> {credits} Credits
                </div>
             )}
             <button onClick={handleSignOut} className="text-sm text-slate-500 hover:text-slate-800 font-medium">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-500 mt-1">Manage and edit your resumes.</p>
           </div>
           {!isPro && credits < 1 && (
              <Link href="/pricing" className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors">
                 Get More Credits
              </Link>
           )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button onClick={createResume} disabled={creating} className="group flex flex-col items-center justify-center h-64 bg-white border-2 border-dashed border-slate-300 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/30 transition-all duration-200">
            {creating ? <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" /> : <><div className="h-14 w-14 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Plus className="h-7 w-7 text-indigo-600" /></div><span className="text-base font-bold text-slate-700 group-hover:text-indigo-700">Create New Resume</span></>}
          </button>
          {resumes.map((resume) => (
            <div key={resume.id} onClick={() => router.push(`/editor/${resume.id}`)} className="group relative bg-white rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden flex flex-col h-64">
              <div className="flex-1 bg-slate-100 relative overflow-hidden p-4">
                 <div className="w-full h-full bg-white shadow-sm rounded text-[4px] text-slate-300 p-2 overflow-hidden leading-relaxed select-none group-hover:scale-105 transition-transform">
                    <div className="w-1/2 h-2 bg-slate-400 mb-2 rounded-sm"></div><div className="w-full h-1 bg-slate-200 mb-1"></div><div className="w-3/4 h-1 bg-slate-200 mb-3"></div><div className="w-full h-16 bg-slate-50 mb-2"></div>
                 </div>
              </div>
              <div className="p-4 bg-white border-t border-slate-100 z-10"><h3 className="font-bold text-slate-800 truncate">{resume.title || 'Untitled Resume'}</h3><p className="text-xs text-slate-400 mt-1">Edited {new Date(resume.updated_at).toLocaleDateString()}</p></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}