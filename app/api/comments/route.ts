import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get("ideaId");

    if (!ideaId) {
      return NextResponse.json({ error: "Idea ID required" }, { status: 400 });
    }

    const { data: comments, error } = await supabase
      .from("comments")
      .select("*")
      .eq("idea_id", ideaId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(comments);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
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

    const { ideaId, content, userName, userImage } = await request.json();

    if (!ideaId || !content) {
      return NextResponse.json(
        { error: "Idea ID and content are required" },
        { status: 400 }
      );
    }

    const { data: comment, error } = await supabase
      .from("comments")
      .insert({
        idea_id: ideaId,
        user_id: userId,
        user_name: userName,
        user_image: userImage,
        content,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(comment);
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
