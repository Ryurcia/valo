import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { generateMarketInsights } from "@/lib/ai";

export async function GET() {
  try {
    const { data: ideas, error } = await supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(ideas);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
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

    const body = await request.json();
    const { title, problem, solution, audience } = body;

    if (!title || !problem || !solution || !audience) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Generate market insights using AI
    let insights;
    try {
      insights = await generateMarketInsights(title, problem, solution, audience);
    } catch (aiError) {
      console.error("AI insights generation failed:", aiError);
      insights = {
        market_size: null,
        market_growth: null,
        competitors: null,
        difficulty: null,
      };
    }

    // Insert idea into database
    const { data: idea, error } = await supabase
      .from("ideas")
      .insert({
        user_id: userId,
        title,
        problem,
        solution,
        audience,
        market_size: insights.market_size,
        market_growth: insights.market_growth,
        competitors: insights.competitors,
        difficulty: insights.difficulty,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(idea, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}
