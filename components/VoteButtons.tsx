'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

interface VoteButtonsProps {
  ideaId: string;
  initialVoteCount: number;
}

export default function VoteButtons({ ideaId, initialVoteCount }: VoteButtonsProps) {
  const { user, isSignedIn } = useUser();
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetchVoteData();
    }
  }, [isSignedIn, ideaId]);

  async function fetchVoteData() {
    try {
      const response = await fetch(`/api/votes?ideaId=${ideaId}`);
      if (response.ok) {
        const data = await response.json();
        setUserVote(data.vote_type || 0);
        setUpvotes(data.upvotes || 0);
        setDownvotes(data.downvotes || 0);
      }
    } catch (error) {
      console.error('Failed to fetch vote data:', error);
    }
  }

  async function handleVote(voteType: -1 | 1) {
    if (!isSignedIn) {
      return;
    }

    setIsLoading(true);
    const newVoteType = userVote === voteType ? 0 : voteType;
    const prevUserVote = userVote;
    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;

    // Optimistic update
    let nextUpvotes = upvotes;
    let nextDownvotes = downvotes;
    if (prevUserVote === 1) nextUpvotes--;
    if (prevUserVote === -1) nextDownvotes--;
    if (newVoteType === 1) nextUpvotes++;
    if (newVoteType === -1) nextDownvotes++;

    setUserVote(newVoteType as -1 | 0 | 1);
    setUpvotes(nextUpvotes);
    setDownvotes(nextDownvotes);

    try {
      const response = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideaId, voteType: newVoteType }),
      });

      if (response.ok) {
        const data = await response.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
      } else {
        // Revert on failure
        setUserVote(prevUserVote);
        setUpvotes(prevUpvotes);
        setDownvotes(prevDownvotes);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
      // Revert on failure
      setUserVote(prevUserVote);
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <button
        onClick={() => handleVote(1)}
        disabled={isLoading || !isSignedIn}
        title={isSignedIn ? 'Useful' : 'Sign in to vote'}
        className={`flex items-center gap-2 px-3 h-8 rounded-lg transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed ${
          userVote === 1 ? 'bg-accent-500/20 text-accent-500' : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
      >
        <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM4 22H2V11h2v11z' />
        </svg>
        <span className='text-sm font-medium'>{upvotes}</span>
        <span className='hidden sm:inline text-sm font-medium'>Useful</span>
      </button>

      <button
        onClick={() => handleVote(-1)}
        disabled={isLoading || !isSignedIn}
        title={isSignedIn ? 'Not Useful' : 'Sign in to vote'}
        className={`flex items-center gap-2 px-3 h-8 rounded-lg transition-colors duration-100 disabled:opacity-50 disabled:cursor-not-allowed ${
          userVote === -1 ? 'bg-error-500/20 text-error-500' : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
      >
        <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
          <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM20 2h2v11h-2V2z' />
        </svg>
        <span className='text-sm font-medium'>{downvotes}</span>
        <span className='hidden sm:inline text-sm font-medium'>Not Useful</span>
      </button>
    </div>
  );
}
