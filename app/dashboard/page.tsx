'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Plus, FileText, LogOut, Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Fetch resumes from DB
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })

    if (data) setResumes(data)
    setLoading(false)
  }

  const createResume = async () => {
    setCreating(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return

    // Create a blank resume in DB
    const { data, error } = await supabase
      .from('resumes')
      .insert([
        { 
          user_id: user.id, 
          title: 'My New Resume',
          content: {}, // Empty content initially
          template_id: 'modern-1'
        }
      ])
      .select()
      .single()

    if (data) {
      // Redirect to the editor
      router.push(`/editor/${data.id}`)
    }
    setCreating(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">My Resumes</h1>
          <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </header>

      {/* Resume List */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Create New Button */}
          <button 
            onClick={createResume}
            disabled={creating}
            className="group relative flex flex-col items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            {creating ? (
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            ) : (
              <>
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-200">
                  <Plus className="h-6 w-6 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-900">Create New Resume</span>
              </>
            )}
          </button>

          {/* Existing Resumes */}
          {resumes.map((resume) => (
            <div 
              key={resume.id} 
              onClick={() => router.push(`/editor/${resume.id}`)}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-all flex flex-col justify-between h-64"
            >
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(resume.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 truncate">{resume.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Modern Template</p>
              </div>
            </div>
          ))}

        </div>
      </main>
    </div>
  )
}