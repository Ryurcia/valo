import Link from "next/link";
import { Idea } from "@/types";

interface IdeaCardProps {
  idea: Idea;
}

export default function IdeaCard({ idea }: IdeaCardProps) {
  const formattedDate = new Date(idea.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const voteCount = idea.vote_count || 0;

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {idea.title}
          </h3>
          <div className="ml-3 flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <svg
              className={`w-4 h-4 ${
                voteCount > 0
                  ? "text-green-500"
                  : voteCount < 0
                    ? "text-red-500"
                    : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span
              className={`text-sm font-medium ${
                voteCount > 0
                  ? "text-green-600 dark:text-green-400"
                  : voteCount < 0
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {voteCount}
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">
          {idea.problem}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formattedDate}</span>
          {idea.market_size && (
            <span className="text-green-600 dark:text-green-400 font-medium">
              Market Analyzed
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
