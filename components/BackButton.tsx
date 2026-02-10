'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors duration-100'
    >
      <ArrowLeftIcon className='w-4 h-4' />
      Back
    </button>
  );
}
