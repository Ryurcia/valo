'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import WaitlistModal from '@/components/WaitlistModal';

export default function LandingNav() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  return (
    <>
      <nav className='glass-effect fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-[10px] px-4 sm:px-6 py-3 flex items-center justify-between w-[90%] sm:w-[80%] lg:w-[60%] transition-[width] duration-300 ease-out'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/LOGO_VALOR_WHITE.svg' alt='Valo' width={28} height={28} className='w-6 h-6 sm:w-7 sm:h-7' />
          <span className='text-white font-bold text-lg' style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}>
            valo
          </span>
        </Link>

        <button
          type='button'
          onClick={() => setIsWaitlistModalOpen(true)}
          style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          className='bg-primary-500 hover:bg-primary-700 text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-[10px] transition-colors'
        >
          Join the Waitlist
        </button>
      </nav>

      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
    </>
  );
}
