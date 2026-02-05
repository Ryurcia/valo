"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface VoteButtonsProps {
  ideaId: string;
  initialVoteCount: number;
}

export default function VoteButtons({ ideaId, initialVoteCount }: VoteButtonsProps) {
  const { user, isSignedIn } = useUser();
  const [voteCount, setVoteCount] = useState(initialVoteCount);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchUserVote();
    }
  }, [isSignedIn, ideaId]);

  async function fetchUserVote() {
    try {
      const response = await fetch(`/api/votes?ideaId=${ideaId}`);
      if (response.ok) {
        const data = await response.json();
        setUserVote(data.vote_type || 0);
      }
    } catch (error) {
      console.error("Failed to fetch user vote:", error);
    }
  }

  async function handleVote(voteType: -1 | 1) {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);

    try {
      const newVoteType = userVote === voteType ? 0 : voteType;

      const response = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId, voteType: newVoteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setVoteCount(data.vote_count);
        setUserVote(newVoteType as -1 | 0 | 1);
      }
    } catch (error) {
      console.error("Failed to vote:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote(1)}
        disabled={isLoading || !isSignedIn}
        className={`p-2 rounded-lg transition-colors ${
          userVote === 1
            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isSignedIn ? "Upvote" : "Sign in to vote"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <span className={`font-semibold min-w-[3ch] text-center ${
        voteCount > 0
          ? "text-green-600 dark:text-green-400"
          : voteCount < 0
            ? "text-red-600 dark:text-red-400"
            : "text-gray-600 dark:text-gray-400"
      }`}>
        {voteCount}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isLoading || !isSignedIn}
        className={`p-2 rounded-lg transition-colors ${
          userVote === -1
            ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isSignedIn ? "Downvote" : "Sign in to vote"}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
