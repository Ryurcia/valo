'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import IdeaCard from '@/components/IdeaCard';
import { useFeedQuery } from '@/hooks/useFeedQuery';

export default function HomePage() {
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useFeedQuery();

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const ideas = data?.pages.flatMap((page) => page.ideas) ?? [];

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1
          style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          className='text-3xl font-bold text-gray-900 dark:text-white'
        >
          Feed
        </h1>
        <p className='text-gray-600 dark:text-gray-300 mt-1'>Discover business ideas from the community</p>
      </div>

      {isLoading ? (
        <div className='space-y-4'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse'
            >
              <div className='h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2' />
              <div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3' />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className='p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400'>
          {error instanceof Error ? error.message : 'Something went wrong'}
        </div>
      ) : ideas.length === 0 ? (
        <div className='text-center py-16'>
          <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg className='w-8 h-8 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
              />
            </svg>
          </div>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>No ideas yet</h3>
          <p className='text-gray-600 dark:text-gray-300 mb-6'>Be the first to submit a business idea!</p>
          <Link
            href='/ideas/new'
            className='inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
          >
            Submit Your First Idea
          </Link>
        </div>
      ) : (
        <>
          <div className='flex flex-col gap-6'>
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>

          <div ref={sentinelRef} className='h-10' />

          {isFetchingNextPage && (
            <div className='flex justify-center py-6'>
              <div className='w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin' />
            </div>
          )}

          {!hasNextPage && ideas.length > 0 && (
            <div className='text-center py-8 text-gray-500 dark:text-gray-400 text-sm'>
              You&apos;ve reached the end of the feed
            </div>
          )}
        </>
      )}
    </div>
  );
}
