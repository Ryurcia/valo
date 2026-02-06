'use client';

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Navbar() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center gap-8' style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}>
            <Link href='/' className='text-xl font-bold text-gray-900 dark:text-white'>
              Valo
            </Link>
            <div className='hidden md:flex items-center gap-6'>
              <Link
                href='/ideas'
                className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'
              >
                Browse Ideas
              </Link>
              {isSignedIn && (
                <>
                  <Link
                    href='/dashboard'
                    className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'
                  >
                    Dashboard
                  </Link>
                  <Link
                    href='/ideas/new'
                    className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'
                  >
                    Submit Idea
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {!isLoaded ? (
              <div className='w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse' />
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl='/' />
            ) : (
              <>
                <Link
                  href='/sign-in'
                  className='text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  href='/sign-in'
                  className='px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors'
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
