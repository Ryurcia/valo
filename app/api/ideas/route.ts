import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { generateMarketInsights } from '@/lib/ai';
import { IDEA_TAGS, IDEA_CATEGORIES, IDEA_STAGES } from '@/types';
import { calculateIdeaMatch } from '@/lib/matching';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? Math.min(parseInt(limitParam, 10), 50) : 30;

    let query = supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1);

    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data: ideas, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hasMore = ideas && ideas.length > limit;
    const paginatedIdeas = hasMore ? ideas.slice(0, limit) : ideas || [];

    // Fetch author data from users table + profile images from Clerk
    const userIds = [...new Set(paginatedIdeas.map((i) => i.user_id))];
    const [{ data: authors }, client] = await Promise.all([
      supabase.from('users').select('clerk_id, first_name, last_name, username').in('clerk_id', userIds),
      clerkClient(),
    ]);

    const clerkUsers =
      userIds.length > 0 ? await client.users.getUserList({ userId: userIds, limit: userIds.length }) : { data: [] };
    const imageMap = new Map(clerkUsers.data.map((u) => [u.id, u.imageUrl]));

    const authorMap = new Map(
      (authors || []).map((u) => [
        u.clerk_id,
        {
          first_name: u.first_name,
          last_name: u.last_name,
          username: u.username,
          image_url: imageMap.get(u.clerk_id) || null,
        },
      ])
    );
    const nextCursor = hasMore ? paginatedIdeas[paginatedIdeas.length - 1].created_at : null;

    // Fetch upvote/downvote breakdowns for all returned ideas
    const ideaIds = paginatedIdeas.map((i) => i.id);
    const { data: votes } = await supabase.from('votes').select('idea_id, vote_type, user_id').in('idea_id', ideaIds);

    const voteCounts = new Map<string, { upvotes: number; downvotes: number; user_vote: -1 | 0 | 1 }>();
    for (const vote of votes || []) {
      const entry = voteCounts.get(vote.idea_id) || { upvotes: 0, downvotes: 0, user_vote: 0 as -1 | 0 | 1 };
      if (vote.vote_type === 1) entry.upvotes++;
      else if (vote.vote_type === -1) entry.downvotes++;
      if (userId && vote.user_id === userId) entry.user_vote = vote.vote_type;
      voteCounts.set(vote.idea_id, entry);
    }

    // Fetch viewer's profile and connection statuses for co-founder matching
    let viewerProfile: { skills: string[]; looking_for: string[]; availability: string | null; experience_level: string | null } | null = null;
    const connectionStatusMap = new Map<string, string>();

    if (userId) {
      const cofounderIdeaIds = paginatedIdeas
        .filter((i) => i.looking_for_cofounder && i.user_id !== userId)
        .map((i) => i.id);

      const [profileResult, connectionsResult] = await Promise.all([
        supabase.from('users').select('skills, looking_for, availability, experience_level').eq('clerk_id', userId).single(),
        cofounderIdeaIds.length > 0
          ? supabase
              .from('connections')
              .select('idea_id, status')
              .eq('requester_id', userId)
              .in('idea_id', cofounderIdeaIds)
          : Promise.resolve({ data: [] }),
      ]);

      if (profileResult.data) {
        viewerProfile = {
          skills: profileResult.data.skills || [],
          looking_for: profileResult.data.looking_for || [],
          availability: profileResult.data.availability || null,
          experience_level: profileResult.data.experience_level || null,
        };
      }

      for (const conn of connectionsResult.data || []) {
        if (conn.idea_id) connectionStatusMap.set(conn.idea_id, conn.status);
      }
    }

    const ideasWithVotes = paginatedIdeas.map((idea) => {
      let match_percentage: number | null = null;
      let connection_status: string | null = null;

      if (idea.looking_for_cofounder && userId && idea.user_id !== userId) {
        if (viewerProfile) {
          const match = calculateIdeaMatch(viewerProfile, {
            cofounder_skills_needed: idea.cofounder_skills_needed || [],
            cofounder_roles_needed: idea.cofounder_roles_needed || [],
            cofounder_experience_level: idea.cofounder_experience_level || null,
            cofounder_time_commitment: idea.cofounder_time_commitment || null,
          });
          match_percentage = match?.percentage ?? null;
        }
        connection_status = connectionStatusMap.get(idea.id) || null;
      }

      return {
        ...idea,
        author: authorMap.get(idea.user_id) ?? null,
        upvotes: voteCounts.get(idea.id)?.upvotes || 0,
        downvotes: voteCounts.get(idea.id)?.downvotes || 0,
        user_vote: voteCounts.get(idea.id)?.user_vote || 0,
        match_percentage,
        connection_status,
      };
    });

    return NextResponse.json({
      ideas: ideasWithVotes,
      nextCursor,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch ideas' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      problem,
      solution,
      audience,
      tags,
      category,
      stage,
      looking_for_cofounder,
      cofounder_skills_needed,
      cofounder_roles_needed,
      cofounder_experience_level,
      cofounder_time_commitment,
      getMarketInsights,
    } = body;

    if (!title || !problem || !solution || !audience) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: 'At least one tag is required' }, { status: 400 });
    }
    const invalidTags = tags.filter((t: string) => !(IDEA_TAGS as readonly string[]).includes(t));
    if (invalidTags.length > 0) {
      return NextResponse.json({ error: `Invalid tags: ${invalidTags.join(', ')}` }, { status: 400 });
    }

    if (!category || !(IDEA_CATEGORIES as readonly string[]).includes(category)) {
      return NextResponse.json({ error: 'Valid category is required' }, { status: 400 });
    }

    if (!stage || !(IDEA_STAGES as readonly string[]).includes(stage)) {
      return NextResponse.json({ error: 'Valid stage is required' }, { status: 400 });
    }

    // Generate market insights before inserting if requested
    let market_analysis = null;
    let competitors = null;
    let difficulty = null;

    if (getMarketInsights) {
      try {
        const insights = await generateMarketInsights(title, problem, solution, audience);
        market_analysis = insights.market_analysis;
        competitors = insights.competitors;
        difficulty = insights.difficulty;
      } catch (aiError) {
        console.error('AI insights generation failed:', aiError);
      }
    }

    const { data: idea, error } = await supabase
      .from('ideas')
      .insert({
        user_id: userId,
        title,
        problem,
        solution,
        audience,
        tags,
        category,
        stage,
        looking_for_cofounder: Boolean(looking_for_cofounder),
        cofounder_skills_needed: looking_for_cofounder ? cofounder_skills_needed || [] : [],
        cofounder_roles_needed: looking_for_cofounder ? cofounder_roles_needed || [] : [],
        cofounder_experience_level: looking_for_cofounder ? cofounder_experience_level || null : null,
        cofounder_time_commitment: looking_for_cofounder ? cofounder_time_commitment || null : null,
        market_analysis,
        competitors,
        difficulty,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(idea, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create idea' }, { status: 500 });
  }
}
