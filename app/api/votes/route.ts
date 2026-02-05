import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("ideaId");

    if (!userId) {
      return NextResponse.json({ vote_type: 0 });
    }

    if (!ideaId) {
      return NextResponse.json({ error: "Idea ID required" }, { status: 400 });
    }

    const { data: vote, error } = await supabase
      .from("votes")
      .select("vote_type")
      .eq("idea_id", ideaId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ vote_type: vote?.vote_type || 0 });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch vote" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ideaId, voteType } = await request.json();

    if (!ideaId) {
      return NextResponse.json({ error: "Idea ID required" }, { status: 400 });
    }

    // If voteType is 0, remove the vote
    if (voteType === 0) {
      await supabase
        .from("votes")
        .delete()
        .eq("idea_id", ideaId)
        .eq("user_id", userId);
    } else {
      // Upsert the vote
      const { error } = await supabase
        .from("votes")
        .upsert(
          {
            idea_id: ideaId,
            user_id: userId,
            vote_type: voteType,
          },
          {
            onConflict: "idea_id,user_id",
          }
        );

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // Fetch updated vote count
    const { data: idea, error: fetchError } = await supabase
      .from("ideas")
      .select("vote_count")
      .eq("id", ideaId)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ vote_count: idea.vote_count });
  } catch {
    return NextResponse.json(
      { error: "Failed to update vote" },
      { status: 500 }
    );
  }
}
