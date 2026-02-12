'use client';

import { useState } from 'react';
import WaitlistModal from '@/components/WaitlistModal';

export default function LandingCTA() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        onClick={() => setIsWaitlistModalOpen(true)}
        style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
        className='inline-block bg-primary-500 hover:bg-primary-700 text-white text-sm sm:text-base font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] transition-colors'
      >
        Join the Waitlist
      </button>

      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
    </>
  );
}
