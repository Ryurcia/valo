'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Idea } from '@/types';

interface IdeaCardProps {
  idea: Idea;
  commentCount?: number;
}

export default function IdeaCard({ idea, commentCount = 0 }: IdeaCardProps) {
  const formattedDate = new Date(idea.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const [upvotes, setUpvotes] = useState(idea.upvotes || 0);
  const [downvotes, setDownvotes] = useState(idea.downvotes || 0);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(idea.user_vote || 0);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = useCallback(
    async (e: React.MouseEvent, voteType: -1 | 1) => {
      e.preventDefault();
      e.stopPropagation();
      if (isVoting) return;

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

      setUserVote(newVoteType);
      setUpvotes(nextUpvotes);
      setDownvotes(nextDownvotes);
      setIsVoting(true);

      try {
        const res = await fetch('/api/votes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ideaId: idea.id, voteType: newVoteType }),
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setUpvotes(data.upvotes);
        setDownvotes(data.downvotes);
      } catch {
        // Revert on failure
        setUserVote(prevUserVote);
        setUpvotes(prevUpvotes);
        setDownvotes(prevDownvotes);
      } finally {
        setIsVoting(false);
      }
    },
    [isVoting, userVote, upvotes, downvotes, idea.id]
  );

  const author = idea.author;
  const displayName = author
    ? `${author.first_name || ''} ${author.last_name || ''}`.trim() || author.username || null
    : null;

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className='p-6 bg-surface-variant rounded-lg hover:bg-surface-variant/80 transition-colors duration-200 cursor-pointer h-full flex flex-col'>
        {/* Header: Author & Date */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden'>
              {author?.image_url ? (
                <Image
                  src={author.image_url}
                  alt={displayName || 'User'}
                  width={40}
                  height={40}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-sm font-medium text-white/60'>
                  {displayName?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-white truncate'>{displayName || 'Anonymous'}</p>
              {author?.username && (
                <p className='text-xs text-white/50 truncate'>@{author.username}</p>
              )}
            </div>
          </div>
          <span className='text-xs text-white/40 shrink-0'>Posted on {formattedDate}</span>
        </div>

        {/* Category Badge */}
        {idea.category && (
          <span className='inline-block w-fit px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/70 mb-3'>
            {idea.category}
          </span>
        )}

        {/* Title */}
        <h3 className='text-xl font-semibold text-white mb-4 line-clamp-2'>{idea.title}</h3>

        {/* Problem Section */}
        <div className='mb-3'>
          <p className='text-xs font-medium text-accent-500 mb-1'>Problem</p>
          <p className='text-sm text-white/70 line-clamp-3'>{idea.problem}</p>
        </div>

        {/* Solution Section */}
        <div className='mb-5 flex-1'>
          <p className='text-xs font-medium text-accent-500 mb-1'>Solution</p>
          <p className='text-sm text-white/70 line-clamp-3'>{idea.solution}</p>
        </div>

        {/* Footer: Voting & Comments */}
        <div className='flex flex-wrap items-center gap-2 pt-4 border-t border-white/10'>
          <button
            onClick={(e) => handleVote(e, 1)}
            disabled={isVoting}
            className={`flex items-center gap-2 px-3 h-8 rounded-lg transition-colors duration-100 ${
              userVote === 1
                ? 'bg-accent-500/20 text-accent-500'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM4 22H2V11h2v11z' />
            </svg>
            <span className='text-sm font-medium'>{upvotes}</span>
            <span className='hidden sm:inline text-sm font-medium'>Useful</span>
          </button>

          <button
            onClick={(e) => handleVote(e, -1)}
            disabled={isVoting}
            className={`flex items-center gap-2 px-3 h-8 rounded-lg transition-colors duration-100 ${
              userVote === -1
                ? 'bg-error-500/20 text-error-500'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM20 2h2v11h-2V2z' />
            </svg>
            <span className='text-sm font-medium'>{downvotes}</span>
            <span className='hidden sm:inline text-sm font-medium'>Not Useful</span>
          </button>

          <div className='flex items-center gap-2 ml-auto text-white/50'>
            <svg className='w-4 h-4 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
              />
            </svg>
            <span className='text-sm'>
              {commentCount}<span className='hidden sm:inline'> Comments</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
