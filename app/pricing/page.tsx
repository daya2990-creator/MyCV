'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Check, Loader2, ArrowLeft, Zap, Crown, Mail, HelpCircle, FileText, Ban } from 'lucide-react'
import Script from 'next/script'

const PLANS = [
  {
    id: 'free',
    name: 'Free Tier',
    price: 0,
    period: 'forever',
    label: 'Basic',
    features: [
      'Create unlimited resumes',
      'Access Basic Templates',
      'Watermark on Preview',
      'No PDF Export'
    ],
    color: 'bg-slate-50 border-slate-200 text-slate-800',
    btnColor: 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50',
    icon: FileText,
    popular: false
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 39,
    period: 'one-time',
    label: 'Pay Per Download',
    features: [
      '1 High-Quality PDF Download',
      'No Watermark',
      'Access Standard Templates',
      'ATS-Friendly Format',
      'Credits Never Expire'
    ],
    color: 'bg-blue-50 border-blue-200 text-blue-900',
    btnColor: 'bg-blue-600 text-white hover:bg-blue-700',
    icon: Zap,
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: 'per month',
    label: 'Best Value',
    features: [
      'Unlimited Clean Downloads',
      'Access All 20+ Templates',
      'No Watermarks',
      'Cover Letter Export',
      'High-Quality PDF & DOCX',
      'Priority Support'
    ],
    color: 'bg-indigo-900 border-indigo-800 text-white',
    btnColor: 'bg-indigo-500 text-white hover:bg-indigo-600',
    icon: Crown,
    popular: true
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSelectPlan = async (plan: typeof PLANS[0]) => {
    if (plan.price === 0) {
       router.push('/dashboard');
       return;
    }

    setLoading(plan.id)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
       router.push('/login')
       return
    }

    try {
      const res = await fetch('/api/payment/create', { 
        method: 'POST',
        body: JSON.stringify({ 
            amount: plan.price * 100, // paise
            planName: plan.id 
        })
      })
      const data = await res.json()

      if (!data.orderId) throw new Error('Order failed')

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: plan.price * 100,
        currency: "INR",
        name: "MyCV.guru",
        description: plan.name,
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            body: JSON.stringify({
              orderCreationId: data.orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              planType: plan.id 
            }),
          });
          
          if ((await verifyRes.json()).success) {
            alert(plan.id === 'premium' ? "Welcome to Premium!" : "Download Credit Added!");
            router.push('/dashboard'); 
          }
        },
        theme: { color: plan.id === 'premium' ? '#4f46e5' : '#2563eb' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      
    } catch (error) {
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans pb-20">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="bg-white border-b p-4 sticky top-0 z-10">
         <div className="max-w-6xl mx-auto flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full text-slate-600"><ArrowLeft size={20}/></button>
            <span className="font-bold text-lg text-slate-800">Upgrade Plan</span>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
           <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Upgrade your career</h1>
           <p className="text-slate-500 text-lg">Select the plan that fits your job search needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {PLANS.map((plan) => (
              <div key={plan.id} className={`relative p-8 rounded-3xl border-2 flex flex-col transition-all hover:-translate-y-1 ${plan.color} ${plan.popular ? 'shadow-2xl ring-4 ring-indigo-50 border-indigo-500' : 'shadow-lg'}`}>
                 {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                       Recommended
                    </div>
                 )}
                 
                 <div className="mb-8 text-center">
                    <div className={`inline-flex items-center justify-center p-3 rounded-full shadow-sm mb-4 ${plan.id === 'premium' ? 'bg-indigo-800 text-indigo-200' : 'bg-white text-slate-700'}`}>
                        <plan.icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center gap-1 mb-2">
                       <span className="text-5xl font-black">₹{plan.price}</span>
                    </div>
                    <span className={`text-sm font-medium ${plan.id === 'premium' ? 'text-indigo-200' : 'text-slate-500'}`}>{plan.period}</span>
                 </div>

                 <ul className="space-y-4 mb-8 flex-1 px-2">
                    {plan.features.map((feature, i) => (
                       <li key={i} className={`flex items-start gap-3 text-sm font-medium ${plan.id === 'premium' ? 'text-indigo-100' : 'text-slate-600'}`}>
                          <Check size={18} className={`shrink-0 mt-0.5 ${plan.id === 'premium' ? 'text-indigo-400' : 'text-green-600'}`}/>
                          {feature}
                       </li>
                    ))}
                 </ul>

                 <button 
                    onClick={() => handleSelectPlan(plan)}
                    disabled={!!loading}
                    className={`w-full py-4 rounded-xl font-bold text-base shadow-md transition-all flex items-center justify-center gap-2 ${plan.btnColor} disabled:opacity-70`}
                 >
                    {loading === plan.id ? <Loader2 className="animate-spin"/> : (plan.price === 0 ? "Current Plan" : "Select Plan")}
                 </button>
              </div>
           ))}
        </div>
        
        <div className="mt-20 border-t pt-10 text-center">
            <h4 className="text-slate-900 font-bold mb-2 flex items-center justify-center gap-2">
                <HelpCircle size={18}/> Need help?
            </h4>
            <p className="text-slate-500 text-sm mb-4">
                Our support team is available to assist you.
            </p>
            <a href="mailto:support@mycv.guru" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                <Mail size={16}/> support@mycv.guru
            </a>
        </div>
      </div>
    </div>
  )
}