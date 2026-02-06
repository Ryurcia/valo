'use client';

import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user && !user.publicMetadata?.onboardingComplete) {
      router.push('/onboarding');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className='bg-background min-h-dvh flex items-center justify-center'>
        <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
      </div>
    );
  }

  if (user && !user.publicMetadata?.onboardingComplete) {
    return null;
  }

  return <div className='bg-background'>{children}</div>;
}
