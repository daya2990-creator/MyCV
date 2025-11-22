import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  // 1. Check Auth
  const cookieStore = await cookies();
  
  // FIX: Wrap cookieStore in a Promise to satisfy the type definition
  const supabase = createRouteHandlerClient({ 
    cookies: () => Promise.resolve(cookieStore) 
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get Plan Amount from Request
  const { amount, planName } = await request.json();
  
  // Validate amount (Added 1900 for ₹19 plan)
  const validAmounts = [300, 500, 900, 1000, 1900]; 
  if (!validAmounts.includes(amount)) {
     return NextResponse.json({ error: 'Invalid Plan Amount' }, { status: 400 });
  }

  // 3. Create Order
  try {
    const order = await razorpay.orders.create({
      amount: amount, 
      currency: 'INR',
      receipt: `receipt_${user.id.substring(0, 8)}_${Date.now()}`,
      notes: {
        userId: user.id,
        plan: planName
      }
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Razorpay Error:", error);
    return NextResponse.json({ error: 'Payment creation failed' }, { status: 500 });
  }
}