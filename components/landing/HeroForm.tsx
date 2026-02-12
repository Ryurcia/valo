'use client';

import { useState, FormEvent } from 'react';

export default function HeroForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

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
      setMessage("You're on the list! We'll be in touch soon.");
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Try again.');
    }
  }

  return (
    <div className='max-w-[650px] mx-auto px-4'>
      {status === 'success' ? (
        <p className='text-accent-500 font-medium text-base sm:text-lg'>{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className='flex items-center gap-2 flex-col md:flex-row'>
          <input
            type='email'
            required
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full md:flex-1 bg-white/5 rounded-[10px] border border-white/15 text-white placeholder:text-white/40 text-sm sm:text-base px-6 py-2 outline-none focus:ring-1 focus:ring-primary-500 focus:shadow-lg focus:shadow-primary-500/20'
          />
          <button
            type='submit'
            disabled={status === 'loading'}
            style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
            className='w-full md:w-auto bg-primary-500 hover:bg-primary-700 disabled:opacity-60 text-white text-sm sm:text-base font-medium px-6 py-2 rounded-[10px] transition-colors'
          >
            {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
          </button>
        </form>
      )}
      {status === 'error' && <p className='text-red-400 text-sm mt-2'>{message}</p>}
    </div>
  );
}
