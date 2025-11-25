import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    // FIX: Pass cookieStore directly
    // @ts-ignore
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { amount, planName } = await request.json();
    
    // Validate amounts: 3900 = ₹39, 9900 = ₹99
    const validAmounts = [3900, 9900]; 
    
    if (!validAmounts.includes(amount)) {
      return NextResponse.json({ error: 'Invalid Plan Amount' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount, 
      currency: 'INR',
      receipt: `receipt_${user.id.substring(0, 8)}_${Date.now()}`,
      notes: { userId: user.id, plan: planName }
    });

    return NextResponse.json({ orderId: order.id });

  } catch (error: any) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ 
      error: 'Payment creation failed', 
      details: error.message 
    }, { status: 500 });
  }
}