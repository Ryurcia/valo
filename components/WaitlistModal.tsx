'use client';

import { useEffect, useState } from 'react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage("You're on the list! We'll notify you when we launch.");
        setEmail('');
        setTimeout(() => onClose(), 2000);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to join waitlist');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/70 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden
      />
      {/* Modal */}
      <div
        className='relative w-full max-w-md rounded-[10px] border border-white/10 bg-[#1a0f0a] p-6 shadow-xl'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 text-white/60 hover:text-white transition-colors'
          aria-label='Close'
        >
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        <h3
          className='text-xl font-bold text-white mb-2 pr-8'
          style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
        >
          Join the Waitlist
        </h3>
        <p className='text-white/60 text-sm mb-6'>
          Get early access and be the first to know when we launch.
        </p>

        {status === 'success' ? (
          <div className='p-4 rounded-[10px] bg-[#22C55E]/10 border border-[#22C55E]/30'>
            <p className='text-white text-sm'>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='your@email.com'
              required
              className='w-full px-4 py-3 rounded-[10px] bg-white/5 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors'
            />
            <button
              type='submit'
              disabled={status === 'loading'}
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='w-full bg-primary-500 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium py-3 rounded-[10px] transition-colors'
            >
              {status === 'loading' ? 'Sending...' : 'Get notified'}
            </button>
          </form>
        )}
        {status === 'error' && <p className='mt-3 text-red-400 text-sm'>{message}</p>}
      </div>
    </div>
  );
}
