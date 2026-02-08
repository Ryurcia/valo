import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import MarketInsights from '@/components/MarketInsights';
import VoteButtons from '@/components/VoteButtons';
import CommentSection from '@/components/CommentSection';
import { ArrowLeftIcon } from 'lucide-react';

interface IdeaPageProps {
  params: Promise<{ id: string }>;
}

export default async function IdeaPage({ params }: IdeaPageProps) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: idea, error } = await supabase.from('ideas').select('*').eq('id', id).single();

  if (error || !idea) {
    notFound();
  }

  // Fetch author data
  const { data: authorData } = await supabase
    .from('users')
    .select('clerk_id, first_name, last_name, username')
    .eq('clerk_id', idea.user_id)
    .single();

  let authorImageUrl: string | null = null;
  if (authorData) {
    try {
      const client = await clerkClient();
      const clerkUser = await client.users.getUser(idea.user_id);
      authorImageUrl = clerkUser.imageUrl;
    } catch {
      // Ignore if we can't fetch Clerk user
    }
  }

  const author = authorData
    ? {
        first_name: authorData.first_name,
        last_name: authorData.last_name,
        username: authorData.username,
        image_url: authorImageUrl,
      }
    : null;

  const displayName = author
    ? `${author.first_name || ''} ${author.last_name || ''}`.trim() || author.username || 'Anonymous'
    : 'Anonymous';

  const formattedDate = new Date(idea.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isAuthor = userId === idea.user_id;

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <Link
        href='/home'
        className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors duration-100'
      >
        <ArrowLeftIcon className='w-4 h-4' />
        Back home
      </Link>

      <div className='bg-surface-variant rounded-lg p-6 sm:p-8 mb-6'>
        {/* Header: Author & Date */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3 min-w-0'>
            <div className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden'>
              {author?.image_url ? (
                <Image
                  src={author.image_url}
                  alt={displayName}
                  width={40}
                  height={40}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-sm font-medium text-white/60'>
                  {displayName[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div className='min-w-0'>
              <p className='text-sm font-medium text-white truncate'>{displayName}</p>
              {author?.username && <p className='text-xs text-white/50 truncate'>@{author.username}</p>}
            </div>
          </div>
          <span className='text-xs text-white/40 shrink-0'>Posted on {formattedDate}</span>
        </div>

        {/* Badges */}
        <div className='flex flex-wrap items-center gap-2 mb-4'>
          {idea.category && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-primary-500/15 text-primary-400'>
              {idea.category}
            </span>
          )}
          {idea.stage && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-accent-500/15 text-accent-400'>
              {idea.stage}
            </span>
          )}
          {idea.looking_for_cofounder && (
            <span className='px-2 py-0.5 rounded text-xs font-medium bg-green-500/15 text-green-400'>
              Looking for Co-founder
            </span>
          )}
        </div>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className='flex flex-wrap gap-1.5 mb-6'>
            {idea.tags.map((tag: string) => (
              <span key={tag} className='px-2 py-0.5 rounded text-xs bg-white/5 text-white/50'>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className='text-2xl sm:text-3xl font-bold text-white mb-6'>{idea.title}</h1>

        {/* Content Sections */}
        <div className='space-y-6'>
          <div>
            <p className='text-xs font-medium text-accent-500 mb-2'>Problem</p>
            <p className='text-sm text-white/70 leading-relaxed'>{idea.problem}</p>
          </div>

          <div>
            <p className='text-xs font-medium text-accent-500 mb-2'>Solution</p>
            <p className='text-sm text-white/70 leading-relaxed'>{idea.solution}</p>
          </div>

          <div>
            <p className='text-xs font-medium text-accent-500 mb-2'>Target Audience</p>
            <p className='text-sm text-white/70 leading-relaxed'>{idea.audience}</p>
          </div>
        </div>

        {/* Voting */}
        <div className='mt-8 pt-6 border-t border-white/10'>
          <VoteButtons ideaId={idea.id} initialVoteCount={idea.vote_count || 0} />
        </div>
      </div>

      {/* Market Insights - Only for author and only if data exists */}
      {isAuthor && (idea.market_analysis || idea.competitors || idea.difficulty) && (
        <div className='mb-6'>
          <MarketInsights
            marketAnalysis={idea.market_analysis}
            competitors={idea.competitors}
            difficulty={idea.difficulty}
          />
        </div>
      )}

      <CommentSection ideaId={idea.id} />
    </div>
  );
}
