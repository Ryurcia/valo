import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import MarketInsights from "@/components/MarketInsights";
import VoteButtons from "@/components/VoteButtons";
import CommentSection from "@/components/CommentSection";

interface IdeaPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaPage({ params }: IdeaPageProps) {
  const { id } = await params;

  const { data: idea, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !idea) {
    notFound();
  }

  const formattedDate = new Date(idea.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/ideas"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Ideas
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {idea.title}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Submitted on {formattedDate}
            </p>
          </div>
          <VoteButtons ideaId={idea.id} initialVoteCount={idea.vote_count || 0} />
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              The Problem
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {idea.problem}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Solution
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {idea.solution}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Target Audience
            </h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {idea.audience}
            </p>
          </div>
        </div>
      </div>

      <MarketInsights
        marketSize={idea.market_size}
        marketGrowth={idea.market_growth}
        competitors={idea.competitors}
        difficulty={idea.difficulty}
      />

      <CommentSection ideaId={idea.id} />
    </div>
  );
}
