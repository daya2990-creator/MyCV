import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    // FIX: Wrap cookieStore in Promise.resolve() for Next.js 15 compatibility
    const supabase = createRouteHandlerClient({ 
        cookies: () => Promise.resolve(cookieStore) 
    });

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Get current credits
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();
    
    if (fetchError || !profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (profile.credits < 1) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
    }

    // 2. Deduct 1 Credit
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', user.id);
    
    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, remaining: profile.credits - 1 });

  } catch (error: any) {
    console.error("Deduct Credit Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}