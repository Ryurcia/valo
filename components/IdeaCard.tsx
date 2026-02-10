'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Users, Sparkles } from 'lucide-react';
import { Idea } from '@/types';

interface IdeaCardProps {
  idea: Idea;
  commentCount?: number;
}

export default function IdeaCard({ idea, commentCount = 0 }: IdeaCardProps) {
  const { user } = useUser();
  const timeAgo = (() => {
    const seconds = Math.floor((Date.now() - new Date(idea.created_at).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  })();

  const [upvotes, setUpvotes] = useState(idea.upvotes || 0);
  const [downvotes, setDownvotes] = useState(idea.downvotes || 0);
  const [userVote, setUserVote] = useState<-1 | 0 | 1>(idea.user_vote || 0);
  const [isVoting, setIsVoting] = useState(false);

  const isAuthor = user?.id === idea.user_id;
  const showCofounder = idea.looking_for_cofounder;
  const showCollabButton = showCofounder && !isAuthor && !idea.connection_status;
  const matchPercentage = idea.match_percentage;

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

  const circumference = 2 * Math.PI * 20;

  return (
    <Link href={`/ideas/${idea.id}`}>
      <div className='relative p-6 bg-surface-variant rounded-lg hover:bg-surface-variant/80 transition-colors duration-200 cursor-pointer h-full flex flex-col'>
        {/* Match Percentage Ring */}
        {showCofounder && matchPercentage != null && (
          <div className='absolute top-5 right-5 z-10'>
            <div
              className={`relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${
                matchPercentage >= 70
                  ? 'drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]'
                  : matchPercentage >= 40
                    ? 'drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                    : ''
              }`}
            >
              <svg className='w-full h-full -rotate-90' viewBox='0 0 48 48'>
                <circle
                  cx='24'
                  cy='24'
                  r='20'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='3'
                  className='text-white/10'
                />
                <circle
                  cx='24'
                  cy='24'
                  r='20'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='3'
                  strokeLinecap='round'
                  strokeDasharray={`${(matchPercentage / 100) * circumference} ${circumference}`}
                  className={
                    matchPercentage >= 70
                      ? 'text-green-400'
                      : matchPercentage >= 40
                        ? 'text-amber-400'
                        : 'text-white/30'
                  }
                />
              </svg>
              <span
                className={`absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-bold ${
                  matchPercentage >= 70
                    ? 'text-green-400'
                    : matchPercentage >= 40
                      ? 'text-amber-400'
                      : 'text-white/40'
                }`}
              >
                {matchPercentage}%
              </span>
            </div>
          </div>
        )}
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
                <span className='text-sm font-medium text-white/60'>{displayName?.[0]?.toUpperCase() || '?'}</span>
              )}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-white truncate'>{displayName || 'Anonymous'}</p>
              {author?.username && <p className='text-xs text-white/50 truncate'>@{author.username}</p>}
            </div>
          </div>
          <div className={`flex items-center gap-2 shrink-0 ${showCofounder && matchPercentage != null ? 'mr-14' : ''}`}>
            {isAuthor && (idea.market_analysis || idea.competitors || idea.difficulty) && (
              <span className='flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400'>
                <Sparkles size={12} />
                <span className='text-[10px] font-medium sm:hidden'>AI</span>
                <span className='text-[10px] font-medium hidden sm:inline'>AI Analysis Generated</span>
              </span>
            )}
            <span className='text-xs text-white/40'>{timeAgo}</span>
          </div>
        </div>

        {/* Badges */}
        <div className='flex flex-wrap items-center gap-1.5 mb-3'>
          {idea.category && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-white/10 text-white/70'>{idea.category}</span>
          )}
          {showCofounder && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-400 flex items-center gap-1'>
              <Users size={12} />
              Looking for Co-founder
            </span>
          )}
          {showCofounder && idea.connection_status === 'pending' && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-amber-500/15 text-amber-400'>
              Request Pending
            </span>
          )}
          {showCofounder && idea.connection_status === 'accepted' && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-400'>Connected</span>
          )}
        </div>

        {/* Title */}
        <h3 className='text-xl font-semibold text-white mb-4 line-clamp-2'>{idea.title}</h3>

        {/* Problem Section */}
        <div className='mb-3 p-3 bg-surface rounded-lg'>
          <p className='text-xs font-medium text-accent-500 mb-1'>Problem</p>
          <p className='text-sm text-white/70 line-clamp-3'>{idea.problem}</p>
        </div>

        {/* Solution Section */}
        <div className='p-3 bg-surface rounded-lg mb-5 flex-1'>
          <p className='text-xs font-medium text-accent-500 mb-1'>Solution</p>
          <p className='text-sm text-white/70 line-clamp-3'>{idea.solution}</p>
        </div>

        {/* Footer: Voting, Collaboration & Comments */}
        <div className='flex flex-wrap items-center gap-2 pt-4 border-t border-white/10'>
          <button
            onClick={(e) => handleVote(e, 1)}
            disabled={isVoting}
            className={`flex items-center gap-2 px-3 h-8 rounded-lg transition-colors duration-100 ${
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
            onClick={(e) => handleVote(e, -1)}
            disabled={isVoting}
            className={`flex items-center gap-2 px-3 h-8 rounded-lg transition-colors duration-100 ${
              userVote === -1 ? 'bg-error-500/20 text-error-500' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <svg className='w-4 h-4 shrink-0' fill='currentColor' viewBox='0 0 24 24'>
              <path d='M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM20 2h2v11h-2V2z' />
            </svg>
            <span className='text-sm font-medium'>{downvotes}</span>
            <span className='hidden sm:inline text-sm font-medium'>Not Useful</span>
          </button>

          {showCollabButton && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/ideas/${idea.id}`;
              }}
              className='flex items-center gap-1.5 px-3 h-8 rounded-lg bg-primary-500/15 text-primary-400 hover:bg-primary-500/25 transition-colors duration-100 text-sm font-medium'
            >
              <Users size={14} />
              <span className='hidden sm:inline'>Collaborate</span>
            </button>
          )}

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
              {commentCount}
              <span className='hidden sm:inline'> Comments</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
