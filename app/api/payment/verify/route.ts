import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { orderCreationId, razorpayPaymentId, razorpaySignature, planType } = await request.json();

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
  shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpaySignature) {
    return NextResponse.json({ error: 'Transaction not legit!' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => Promise.resolve(cookieStore) });
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    if (planType === 'premium') {
        // PREMIUM SUBSCRIPTION (₹99)
        const nextMonth = new Date();
        nextMonth.setDate(nextMonth.getDate() + 30);
        
        await supabase.from('profiles').update({ 
            subscription_status: 'pro',
            subscription_end_date: nextMonth.toISOString()
        }).eq('id', user.id);

    } else if (planType === 'standard') {
        // STANDARD CREDIT (₹39)
        const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single();
        const currentCredits = profile?.credits || 0;
        
        await supabase.from('profiles').update({ 
            credits: currentCredits + 1 
        }).eq('id', user.id);
    }
  }

  return NextResponse.json({ success: true });
}