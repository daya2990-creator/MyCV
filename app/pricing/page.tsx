'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Check, Loader2, ArrowLeft, Download, FileText } from 'lucide-react'
import Script from 'next/script'

// Single Plan Configuration
const PLAN = {
  id: 'basic_plan',
  name: 'Premium Pass',
  price: 19,
  description: 'Get your professional resume ready in minutes.',
  features: [
    '2 High-Quality PDF Downloads',
    'Access to All 20+ Pro Templates',
    'Remove "Created by" Watermark',
    'Unlimited Edits & Previews'
  ],
  color: 'bg-slate-900 border-slate-800 text-white',
  btnColor: 'bg-white text-slate-900 hover:bg-gray-100'
}

export default function PricingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handlePayment = async () => {
    setLoading(true)
    
    // 1. Check Login
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
       router.push('/login')
       return
    }

    try {
      // 2. Create Order
      const res = await fetch('/api/payment/create', { 
        method: 'POST',
        body: JSON.stringify({ 
            amount: PLAN.price * 100, // Convert to paise (1900)
            planName: PLAN.name 
        })
      })
      const data = await res.json()

      if (!data.orderId) throw new Error('Order creation failed')

      // 3. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: PLAN.price * 100,
        currency: "INR",
        name: "ResumeAI",
        description: PLAN.name,
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            body: JSON.stringify({
              orderCreationId: data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          
          if ((await verifyRes.json()).success) {
            alert("Payment Successful! You have 2 downloads.");
            router.push('/dashboard'); 
          }
        },
        theme: { color: '#0f172a' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      alert("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
         <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={20}/></button>
            <span className="font-bold text-lg text-slate-800">Upgrade Plan</span>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
           <h1 className="text-3xl font-bold text-slate-900 mb-3">Simple Pricing, Professional Results</h1>
           <p className="text-slate-500">Pay once, download your resume, and get hired.</p>
        </div>

        {/* Single Card Layout */}
        <div className={`relative p-8 rounded-2xl shadow-xl flex flex-col md:flex-row gap-8 items-center ${PLAN.color}`}>
           
           <div className="flex-1 text-left">
              <div className="flex items-center gap-2 mb-4 text-slate-300 font-medium uppercase tracking-wider text-xs">
                <FileText size={16}/> Professional Plan
              </div>
              <div className="mb-6">
                 <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">₹{PLAN.price}</span>
                    <span className="text-slate-400 font-medium">/ one-time</span>
                 </div>
              </div>
              <button 
                onClick={handlePayment}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${PLAN.btnColor} disabled:opacity-80`}
              >
                {loading ? <Loader2 className="animate-spin"/> : "Unlock Downloads"}
              </button>
           </div>

           <div className="w-full h-px bg-slate-700 md:w-px md:h-48"></div>

           <div className="flex-1">
              <ul className="space-y-5">
                 {PLAN.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-slate-100 font-medium">
                       <div className="bg-green-500/20 p-1 rounded-full text-green-400"><Check size={16}/></div>
                       {feature}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
        
        <div className="mt-8 flex justify-center gap-6 text-xs text-slate-400">
           <span className="flex items-center gap-1"><Download size={12}/> Instant PDF</span>
           <span className="flex items-center gap-1"><Check size={12}/> Secure Payment</span>
        </div>
      </div>
    </div>
  )
}