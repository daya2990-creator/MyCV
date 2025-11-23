'use client'

import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Clock } from 'lucide-react'
import { AppLogo } from '../../components/AppLogo'

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <AppLogo />
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">How can we help?</h1>
          <p className="text-lg text-slate-500">We are here to help you build the perfect resume.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="grid gap-8">
            
            {/* Email Support */}
            <div className="flex items-start gap-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Email Support</h3>
                <p className="text-slate-500 mb-3 text-sm">For billing issues, account help, or technical questions.</p>
                <a href="mailto:support@mycv.guru" className="text-indigo-600 font-bold hover:underline text-lg">
                  support@mycv.guru
                </a>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100"></div>

            {/* Response Time */}
            <div className="flex items-start gap-4">
              <div className="bg-green-50 p-3 rounded-xl text-green-600">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Response Time</h3>
                <p className="text-slate-500 text-sm">
                  We typically respond within <strong>24 hours</strong> on business days.
                </p>
              </div>
            </div>
            
          </div>
        </div>

        <div className="mt-12 text-center text-slate-400 text-sm">
          <p>Operating Address: Thane, Maharashtra, India</p>
        </div>
      </main>
    </div>
  )
}