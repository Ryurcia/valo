import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { firstName, lastName, username, companyName, role, country } = body;

    if (!firstName || !lastName || !username) {
      return NextResponse.json({ error: 'First name, last name, and username are required' }, { status: 400 });
    }

    const client = await clerkClient();

    // Update Clerk user profile
    try {
      await client.users.updateUser(userId, {
        firstName,
        lastName,
        username,
        publicMetadata: { onboardingComplete: true },
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code?: string; message?: string }[] };
      const firstError = clerkError?.errors?.[0];

      if (firstError?.code === 'form_identifier_exists') {
        return NextResponse.json({ error: 'Username is already taken. Please choose another.' }, { status: 409 });
      }

      return NextResponse.json(
        { error: firstError?.message || 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Insert user into Supabase
    const supabase = createServerSupabaseClient();
    const { error: dbError } = await supabase.from('users').insert({
      clerk_id: userId,
      first_name: firstName,
      last_name: lastName,
      username,
      company_name: companyName || null,
      role: role || null,
      country: country || null,
    });

    if (dbError) {
      // If Supabase insert fails but Clerk was updated, still allow proceeding
      // since publicMetadata is already set
      console.error('Supabase insert error:', dbError);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to complete onboarding' }, { status: 500 });
  }
}
