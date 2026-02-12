import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, rejectionReason } = body;

    if (!status || !['accepted', 'declined'].includes(status)) {
      return NextResponse.json({ error: 'Status must be "accepted" or "declined"' }, { status: 400 });
    }

    // Verify the user is the recipient of this connection
    const { data: existing, error: fetchError } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    if (existing.recipient_id !== userId) {
      return NextResponse.json({ error: 'Only the recipient can update this connection' }, { status: 403 });
    }

    if (existing.status !== 'pending') {
      return NextResponse.json({ error: `Connection is already ${existing.status}` }, { status: 400 });
    }

    // Build update payload
    const updatePayload: { status: string; rejection_reason?: string } = { status };
    if (status === 'declined' && rejectionReason) {
      updatePayload.rejection_reason = rejectionReason.trim();
    }

    const { data: connection, error } = await supabase
      .from('connections')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for the requester
    try {
      // Fetch actor name (the recipient/idea owner who is accepting/declining)
      const { data: actor } = await supabase
        .from('users')
        .select('first_name, last_name')
        .eq('clerk_id', userId)
        .single();

      // Fetch idea title if there's an associated idea
      let ideaTitle: string | null = null;
      if (existing.idea_id) {
        const { data: idea } = await supabase
          .from('ideas')
          .select('title')
          .eq('id', existing.idea_id)
          .single();
        ideaTitle = idea?.title ?? null;
      }

      const actorName = actor
        ? `${actor.first_name} ${actor.last_name}`.trim()
        : 'Someone';

      await supabase.from('notifications').insert({
        user_id: existing.requester_id,
        type: status === 'accepted' ? 'connection_accepted' : 'connection_declined',
        connection_id: id,
        idea_id: existing.idea_id,
        actor_name: actorName,
        idea_title: ideaTitle,
        message: status === 'declined' ? (rejectionReason?.trim() || null) : null,
      });
    } catch {
      // Notification creation is non-critical — don't fail the connection update
    }

    return NextResponse.json(connection);
  } catch {
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}
