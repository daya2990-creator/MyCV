'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AppLogo } from '../../components/AppLogo'

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Introduction</h2>
            <p>
              Welcome to MyCV.guru. By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on MyCV.guru's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
            </p>
            <p className="mt-2">
              You may create and download resumes/CVs for your personal use to apply for jobs. You may not use our templates to build a competing service or resell them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Payments and Refunds</h2>
            <p>
              <strong>Pricing:</strong> We offer paid services including single downloads and monthly subscriptions. Prices are listed in INR (Indian Rupees) and are subject to change without notice.
            </p>
            <p className="mt-2">
              <strong>Refunds:</strong> Due to the digital nature of our product (instant access to downloadable files), we generally do not offer refunds once a file has been downloaded or a credit used. However, if you faced a technical error where you were charged but did not receive the service, please contact us at <a href="mailto:support@mycv.guru" className="text-indigo-600 underline">support@mycv.guru</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. User Content</h2>
            <p>
              You retain full ownership of the data you enter into your resume. We do not claim ownership of your personal information or career history. By using the service, you grant us a license to store and display this data solely for the purpose of providing the resume building service to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Disclaimer</h2>
            <p>
              The materials on MyCV.guru's website are provided on an 'as is' basis. MyCV.guru makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="font-medium">support@mycv.guru</p>
          </section>
        </div>
      </main>
    </div>
  )
}