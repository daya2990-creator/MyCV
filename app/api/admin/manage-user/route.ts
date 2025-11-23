import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// REPLACE THIS WITH YOUR EXACT EMAIL
const ADMIN_EMAIL = "daya2990@gmail.com";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => Promise.resolve(cookieStore) });
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Security Check: Is the requester the Admin?
  if (!user || user.email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized Access' }, { status: 403 });
  }

  const { action, targetEmail, creditAmount } = await request.json();

  if (action === 'search') {
    // Find user by email in the PROFILES table (requires linking auth users to profiles via email if possible, 
    // but since profiles uses ID, we need to search auth.users first which is hard via client.
    // Simpler MVP: We search the 'profiles' table. 
    // NOTE: For this to work, we assume you might store email in profiles or use ID.
    // Let's use a trick: We will search profiles where full_name might match or just fetch all for now?
    // Actually, Supabase Admin Client is needed for email lookup, but standard client can't do it easily.
    // BETTER MVP STRATEGY: Just allow updating by User ID (which you can get from URL) OR
    // Let's just allow searching profiles table if you added an email column there?
    
    // Since we didn't add email to 'profiles', we will just fetch the specific profile by ID if known, 
    // OR we accept that for MVP using the Supabase Dashboard is actually better for searching by email.
    
    return NextResponse.json({ message: "For search, please use Supabase Dashboard > Authentication for now." });
  }

  if (action === 'add_credits') {
    // Look up profile by email (We need to add email to public.profiles first for this to work perfectly)
    // FIX: Let's first assume we pass the User ID (UUID) which is reliable.
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ credits: creditAmount }) // Set to new amount
      .eq('id', targetEmail) // Using ID for safety
      .select();
      
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, data });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}