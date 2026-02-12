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

    // Create notification for the recipient (idea owner)
    try {
      const { data: requester } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('clerk_id', userId)
        .single();

      let ideaTitle: string | null = null;
      if (ideaId) {
        const { data: idea } = await supabase
          .from('ideas')
          .select('title')
          .eq('id', ideaId)
          .single();
        ideaTitle = idea?.title ?? null;
      }

      const actorName = requester
        ? `${requester.first_name} ${requester.last_name}`.trim()
        : 'Someone';

      await supabase.from('notifications').insert({
        user_id: recipientId,
        type: 'connection_request',
        connection_id: connection.id,
        idea_id: ideaId || null,
        actor_name: actorName,
        idea_title: ideaTitle,
        message: message.trim(),
      });
    } catch {
      // Notification creation is non-critical
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
      query = query.or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);
    }

    const { data: connections, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with requester profile and idea title for received connections
    if (type === 'received' && connections && connections.length > 0) {
      const requesterIds = [...new Set(connections.map((c) => c.requester_id))];
      const ideaIds = [...new Set(connections.map((c) => c.idea_id).filter(Boolean))];

      const [usersResult, ideasResult] = await Promise.all([
        supabase.from('users').select('clerk_id, first_name, last_name, username').in('clerk_id', requesterIds),
        ideaIds.length > 0
          ? supabase.from('ideas').select('id, title').in('id', ideaIds)
          : Promise.resolve({ data: [] }),
      ]);

      const usersMap = new Map(
        (usersResult.data ?? []).map((u) => [u.clerk_id, u])
      );
      const ideasMap = new Map(
        (ideasResult.data ?? []).map((i) => [i.id, i])
      );

      const enriched = connections.map((c) => {
        const requester = usersMap.get(c.requester_id);
        const idea = c.idea_id ? ideasMap.get(c.idea_id) : null;
        return {
          ...c,
          requester_name: requester
            ? `${requester.first_name} ${requester.last_name}`.trim()
            : 'Unknown',
          requester_username: requester?.username ?? null,
          idea_title: idea?.title ?? null,
        };
      });

      return NextResponse.json(enriched);
    }

    return NextResponse.json(connections || []);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}
