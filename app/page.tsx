import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Sparkles, Download } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ResumeAI</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </Link>
              <Link href="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 mb-8 border border-indigo-100">
              <Sparkles size={16} />
              <span className="text-sm font-medium">Powered by GPT-4 AI</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Build a professional resume in <span className="text-indigo-600">minutes</span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              Create ATS-friendly resumes with our AI-powered builder. 
              No sign-up required to try. Daily passes available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                Build My Resume <ArrowRight size={20} />
              </Link>
              <Link href="#pricing" className="flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 transition-all">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Writing Assistant</h3>
              <p className="text-gray-500">Stuck on words? Let our AI rewrite your summary and bullet points to sound more professional.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <CheckCircle2 className="text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">ATS Friendly</h3>
              <p className="text-gray-500">Our templates are designed to pass through Applicant Tracking Systems (ATS) used by 99% of companies.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <Download className="text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant PDF Download</h3>
              <p className="text-gray-500">Download high-quality PDFs instantly. No watermarks for premium users.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-500">Pay only for what you need.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Tier */}
            <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-300 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900">Free</h3>
              <div className="my-4"><span className="text-4xl font-bold">₹0</span></div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> 1 Resume</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> Basic Template</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> Watermarked PDF</li>
              </ul>
              <Link href="/login" className="block text-center w-full py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50">Get Started</Link>
            </div>

            {/* Daily Pass - Highlighted */}
            <div className="border-2 border-indigo-600 rounded-2xl p-8 relative bg-indigo-50/10 transform scale-105 shadow-xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-lg font-semibold text-indigo-600">Daily Pass</h3>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹9</span>
                <span className="text-gray-500">/day</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> Unlimited Resumes</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> All Premium Templates</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> AI Writing Assistant</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> No Watermarks</li>
              </ul>
              <Link href="/login" className="block text-center w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700">Buy 24h Pass</Link>
            </div>

            {/* Monthly */}
            <div className="border border-gray-200 rounded-2xl p-8 hover:border-indigo-300 transition-colors">
              <h3 className="text-lg font-semibold text-gray-900">Pro Monthly</h3>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹199</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-600">
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> Everything in Daily</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> Priority Support</li>
                <li className="flex gap-2"><CheckCircle2 size={18} className="text-green-500"/> Cover Letter Generator</li>
              </ul>
              <Link href="/login" className="block text-center w-full py-3 rounded-lg border border-gray-200 font-medium hover:bg-gray-50">Subscribe</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}