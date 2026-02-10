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
    const { status } = body;

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

    const { data: connection, error } = await supabase
      .from('connections')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(connection);
  } catch {
    return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
  }
}
