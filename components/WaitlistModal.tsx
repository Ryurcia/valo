'use client';

import { useEffect, useState, FormEvent } from 'react';
import Image from 'next/image';

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

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setStatus('idle');
      setMessage('');
    }
  }, [isOpen]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
        return;
      }
      setStatus('success');
      setMessage("You're on the list!");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
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
        className='relative w-full max-w-md rounded-[10px] border border-white/10 bg-[#1a0f0a] shadow-xl p-6 sm:p-8'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute right-3 top-3 rounded-full bg-white/10 p-1.5 text-white/60 hover:text-white hover:bg-white/20 transition-colors'
          aria-label='Close'
        >
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        <div className='flex flex-col items-center text-center'>
          <Image src='/LOGO_VALOR.svg' alt='Valo' width={40} height={40} className='mb-4' />
          <h2
            style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
            className='text-white text-xl sm:text-2xl font-bold mb-2'
          >
            Join the Waitlist
          </h2>
          <p className='text-white/50 text-sm mb-6'>
            Be the first to know when we launch. Get early access to Valo.
          </p>

          {status === 'success' ? (
            <div className='w-full py-4'>
              <p className='text-accent-500 font-medium text-base'>{message}</p>
              <button
                type='button'
                onClick={onClose}
                style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                className='mt-4 text-white/50 hover:text-white text-sm transition-colors'
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='w-full space-y-3'>
              <input
                type='email'
                required
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='w-full rounded-[10px] border border-white/15 bg-white/5 text-white placeholder:text-white/40 text-sm sm:text-base px-4 py-3 outline-none focus:border-primary-500/50 transition-colors'
              />
              <button
                type='submit'
                disabled={status === 'loading'}
                style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                className='w-full bg-primary-500 hover:bg-primary-700 disabled:opacity-60 text-white text-sm sm:text-base font-medium py-3 rounded-[10px] transition-colors'
              >
                {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
              </button>
              {status === 'error' && (
                <p className='text-red-400 text-sm'>{message}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
