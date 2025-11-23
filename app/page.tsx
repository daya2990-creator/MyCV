import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Zap, Download, Mail, HelpCircle } from 'lucide-react'
import { AppLogo } from '../components/AppLogo' 

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. NAVBAR */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <AppLogo />
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium text-sm">
                Log in
              </Link>
              <Link href="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-slate-800 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <div className="relative pt-20 pb-24 lg:pt-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold uppercase tracking-wider mb-8">
              <Zap size={14} /> V 2.0 Now Live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              The Resume Builder that <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Gets You Hired.</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Create a professional, ATS-friendly resume in minutes. <br/>
              First download is <strong>100% Free</strong>. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105">
                Build My Resume <ArrowRight size={20} />
              </Link>
              <Link href="#features" className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-bold hover:bg-slate-50 transition-all">
                View Templates
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm font-medium text-slate-400">
               <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 20+ Pro Templates</span>
               <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> ATS Optimized</span>
               <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> PDF Export</span>
            </div>
        </div>
      </div>

      {/* 3. FEATURES GRID */}
      <div id="features" className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-bold mb-4">Why Choose MyCV.guru?</h2>
             <p className="text-slate-500">Everything you need to land your dream job.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
               { icon: FileText, title: "Professional Templates", desc: "Choose from 20+ recruiter-approved layouts designed to pass ATS systems." },
               { icon: Zap, title: "Instant Customization", desc: "Change fonts, colors, and layouts with a single click. No design skills needed." },
               { icon: Download, title: "Easy Export", desc: "Download high-quality PDFs instantly. Your first resume is on us." }
            ].map((f, i) => (
               <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                     <f.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{f.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. PRICING SECTION */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Fair & Simple Pricing</h2>
            <p className="text-slate-500">Start for free. Pay only when you're happy.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="border border-slate-200 rounded-3xl p-8 hover:border-indigo-200 transition-colors">
              <h3 className="text-lg font-bold text-slate-900">Free Tier</h3>
              <div className="my-4"><span className="text-4xl font-black">₹0</span></div>
              <p className="text-sm text-slate-500 mb-6">Basic access to build your resume.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500"/> Unlimited Resumes</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500"/> Basic Templates</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-slate-400"/> Watermark on Preview</li>
              </ul>
              <Link href="/signup" className="block text-center w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200">Sign Up Free</Link>
            </div>

            {/* Pay As You Go - Popular */}
            <div className="border-2 border-indigo-600 rounded-3xl p-8 relative bg-slate-900 text-white shadow-2xl transform scale-105">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Recommended
              </div>
              <h3 className="text-lg font-bold text-indigo-300">Standard</h3>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-5xl font-black">₹39</span>
                <span className="text-slate-400 text-sm">/ download</span>
              </div>
              <p className="text-sm text-slate-400 mb-6">Pay only for what you need.</p>
              <ul className="space-y-3 mb-8 text-sm font-medium">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-400"/> 1 Clean PDF Download</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-400"/> No Watermark</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-400"/> ATS-Friendly Format</li>
              </ul>
              <Link href="/signup" className="block text-center w-full py-3 rounded-xl bg-white text-slate-900 font-bold hover:bg-indigo-50">Get Started</Link>
            </div>

            {/* Monthly */}
            <div className="border border-slate-200 rounded-3xl p-8 hover:border-indigo-200 transition-colors">
              <h3 className="text-lg font-bold text-slate-900">Premium Pro</h3>
              <div className="my-4 flex items-baseline gap-1">
                <span className="text-4xl font-black">₹99</span>
                <span className="text-slate-500">/ month</span>
              </div>
              <p className="text-sm text-slate-500 mb-6">For serious job seekers.</p>
              <ul className="space-y-3 mb-8 text-sm text-slate-600 font-medium">
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500"/> Unlimited Downloads</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500"/> Access All Templates</li>
                <li className="flex gap-3"><CheckCircle2 size={18} className="text-green-500"/> Cover Letter Export</li>
              </ul>
              <Link href="/signup" className="block text-center w-full py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100">Subscribe</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 5. FOOTER */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <AppLogo size={24} textClassName="text-slate-700"/>
            </div>
            <p className="text-slate-500 text-sm mb-8">© 2024 MyCV.guru. Helping you land your dream job.</p>
            <div className="flex justify-center gap-6 text-sm text-slate-500 font-medium">
               <Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
               <Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
               <Link href="/support" className="hover:text-indigo-600 transition-colors">Support</Link>
            </div>
         </div>
      </footer>
    </div>
  )
}