import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipientId, ideaId, message } = body;

    if (!recipientId) {
      return NextResponse.json({ error: 'Recipient is required' }, { status: 400 });
    }

    if (recipientId === userId) {
      return NextResponse.json({ error: 'Cannot connect with yourself' }, { status: 400 });
    }

    if (!message?.trim()) {
      return NextResponse.json({ error: 'A message is required' }, { status: 400 });
    }

    // Check for existing connection
    const { data: existing } = await supabase
      .from('connections')
      .select('id, status')
      .eq('requester_id', userId)
      .eq('recipient_id', recipientId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Connection request already exists (${existing.status})` },
        { status: 409 }
      );
    }

    const { data: connection, error } = await supabase
      .from('connections')
      .insert({
        requester_id: userId,
        recipient_id: recipientId,
        idea_id: ideaId || null,
        message: message.trim(),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(connection, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const ideaId = searchParams.get('ideaId');

    let query = supabase.from('connections').select('*').order('created_at', { ascending: false });

    if (ideaId) {
      query = query.eq('idea_id', ideaId);
    } else if (type === 'sent') {
      query = query.eq('requester_id', userId);
    } else if (type === 'received') {
      query = query.eq('recipient_id', userId);
    } else {
      // Default: show all connections involving the user
      query = query.or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
    }

    const { data: connections, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(connections || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}
