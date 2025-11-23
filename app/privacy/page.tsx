'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AppLogo } from '../../components/AppLogo'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <AppLogo />
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you create an account, build a resume, or communicate with us. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Account Data:</strong> Name, email address, and profile picture (from Google Auth).</li>
              <li><strong>Resume Data:</strong> Employment history, education, skills, and other details you enter into the builder.</li>
              <li><strong>Payment Data:</strong> Transaction IDs and payment status (we do NOT store credit card numbers; payments are processed securely by Razorpay).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Provide, maintain, and improve our resume building services.</li>
              <li>Process transactions and send related information, including confirmations and invoices.</li>
              <li>Send you technical notices, updates, security alerts, and support messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Data Storage and Security</h2>
            <p>
              Your resume data is stored securely in our database (Supabase). We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Third-Party Services</h2>
            <p>
              We use trusted third-party services for specific functions:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Authentication:</strong> Supabase / Google OAuth.</li>
              <li><strong>Payments:</strong> Razorpay.</li>
              <li><strong>Hosting:</strong> Vercel.</li>
            </ul>
            <p className="mt-2">These providers have their own privacy policies addressing how they use such information.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="font-medium">support@mycv.guru</p>
          </section>
        </div>
      </main>
    </div>
  )
}