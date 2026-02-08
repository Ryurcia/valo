import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    const { data: idea, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    const { data: votes } = await supabase
      .from("votes")
      .select("vote_type, user_id")
      .eq("idea_id", id);

    const upvotes = (votes || []).filter((v) => v.vote_type === 1).length;
    const downvotes = (votes || []).filter((v) => v.vote_type === -1).length;
    const userVoteRow = userId ? (votes || []).find((v) => v.user_id === userId) : null;
    const user_vote = userVoteRow ? userVoteRow.vote_type : 0;

    // Fetch author info + profile image from Clerk
    const [{ data: authorRow }, client] = await Promise.all([
      supabase
        .from("users")
        .select("clerk_id, first_name, last_name, username")
        .eq("clerk_id", idea.user_id)
        .single(),
      clerkClient(),
    ]);

    let author = null;
    if (authorRow) {
      let image_url: string | null = null;
      try {
        const clerkUser = await client.users.getUser(authorRow.clerk_id);
        image_url = clerkUser.imageUrl || null;
      } catch {
        // Clerk fetch failed, continue without image
      }
      author = {
        first_name: authorRow.first_name,
        last_name: authorRow.last_name,
        username: authorRow.username,
        image_url,
      };
    }

    return NextResponse.json({ ...idea, author, upvotes, downvotes, user_vote });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }
}
