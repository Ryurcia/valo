import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: idea, error } = await supabase
      .from("ideas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    return NextResponse.json(idea);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }
}
