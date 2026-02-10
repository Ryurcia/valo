import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('clerk_id, first_name, last_name, username, role, company_name, country, skills, looking_for, bio, linkedin_url, availability, experience_level, seeking_cofounder, interests')
      .eq('clerk_id', userId)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { skills, looking_for, bio, linkedin_url, availability, experience_level, seeking_cofounder, interests } = body;

    const updateData: Record<string, unknown> = {};

    if (skills !== undefined) updateData.skills = skills;
    if (looking_for !== undefined) updateData.looking_for = looking_for;
    if (bio !== undefined) updateData.bio = bio;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (availability !== undefined) updateData.availability = availability;
    if (experience_level !== undefined) updateData.experience_level = experience_level;
    if (seeking_cofounder !== undefined) updateData.seeking_cofounder = seeking_cofounder;
    if (interests !== undefined) updateData.interests = interests;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('clerk_id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
