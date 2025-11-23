'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Shield, Search, Plus, Save, Loader2 } from 'lucide-react'

// REPLACE WITH YOUR EMAIL
const ADMIN_EMAIL = "daya2990@gmail.com";

export default function AdminPage() {
  const [userId, setUserId] = useState('')
  const [credits, setCredits] = useState('')
  const [loading, setLoading] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email === ADMIN_EMAIL) {
        setAuthorized(true)
      } else {
        router.push('/')
      }
    }
    checkAdmin()
  }, [])

  const handleUpdateCredits = async () => {
    setLoading(true)
    try {
        // Using Supabase directly here since we are admin
        const { error } = await supabase
            .from('profiles')
            .update({ credits: parseInt(credits) })
            .eq('id', userId)

        if (error) throw error
        alert("Credits Updated Successfully")
    } catch (e: any) {
        alert("Error: " + e.message)
    } finally {
        setLoading(false)
    }
  }

  if (!authorized) return null

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border">
        <div className="flex items-center gap-3 mb-8 pb-8 border-b">
            <div className="bg-red-100 p-3 rounded-full text-red-600"><Shield size={24}/></div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
                <p className="text-slate-500">Quick fixes for user accounts</p>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 mb-6">
                <strong>Tip:</strong> To find a User ID, go to Supabase Dashboard {'>'} Authentication {'>'} Copy the UUID next to the email.
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Target User ID (UUID)</label>
                <input 
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="w-full p-3 border rounded-lg font-mono text-sm"
                    placeholder="e.g. 8934-3434-3434..."
                />
            </div>

            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Set Credit Balance</label>
                    <input 
                        type="number"
                        value={credits}
                        onChange={(e) => setCredits(e.target.value)}
                        className="w-full p-3 border rounded-lg"
                        placeholder="e.g. 5"
                    />
                </div>
                <button 
                    onClick={handleUpdateCredits}
                    disabled={loading || !userId}
                    className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin"/> : <Save size={18}/>}
                    Update User
                </button>
            </div>
        </div>
      </div>
    </div>
  )
}