'use client';

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CountUp from '@/components/CountUp';
import AnimateInView from '@/components/AnimateInView';
import WaitlistModal from '@/components/WaitlistModal';
import { ChartColumnBigIcon, ChartNoAxesCombinedIcon, UserRoundCheckIcon, UsersRound } from 'lucide-react';

export default function HomePage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [heroEmail, setHeroEmail] = useState('');
  const [heroStatus, setHeroStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [heroMessage, setHeroMessage] = useState('');

  async function handleHeroSubmit(e: FormEvent) {
    e.preventDefault();
    setHeroStatus('loading');
    setHeroMessage('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: heroEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setHeroStatus('error');
        setHeroMessage(data.error || 'Something went wrong');
        return;
      }
      setHeroStatus('success');
      setHeroMessage("You're on the list!");
      setHeroEmail('');
    } catch {
      setHeroStatus('error');
      setHeroMessage('Something went wrong. Try again.');
    }
  }

  return (
    <div className='min-h-dvh flex flex-col relative overflow-hidden'>
      {/* Animated gradient background */}
      <div
        className='absolute inset-0 z-0 bg-gradient-pulse'
        style={{
          background: 'radial-gradient(ellipse at top center, #2d1810 0%, #1a0f0a 40%, #0d0705 100%)',
        }}
      />
      {/* Wave orbs */}
      <div
        className='absolute z-0 w-[100vmax] h-[100vmax] rounded-full opacity-[0.25] blur-[100px] animate-wave-1 pointer-events-none'
        style={{
          left: '-20%',
          top: '-30%',
          background: 'radial-gradient(circle, #3d2218 0%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[80vmax] h-[80vmax] rounded-full opacity-[0.2] blur-[80px] animate-wave-2 pointer-events-none'
        style={{
          right: '-25%',
          top: '10%',
          background: 'radial-gradient(circle, #2d1810 0%, transparent 65%)',
        }}
      />
      <div
        className='absolute z-0 w-[90vmax] h-[90vmax] rounded-full opacity-[0.15] blur-[90px] animate-wave-3 pointer-events-none'
        style={{
          left: '-15%',
          bottom: '-20%',
          background: 'radial-gradient(circle, #1a0f0a 0%, transparent 60%)',
        }}
      />
      <div
        className='absolute z-0 w-[70vmax] h-[70vmax] rounded-full opacity-[0.2] blur-[70px] animate-wave-4 pointer-events-none'
        style={{
          right: '-10%',
          bottom: '-15%',
          background: 'radial-gradient(circle, #3d2218 0%, transparent 70%)',
        }}
      />

      {/* Fixed Glass Navbar */}
      <nav className='glass-effect fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl rounded-[10px] px-4 sm:px-6 py-3 flex items-center justify-between'>
        {/* Logo and brand */}
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/LOGO_VALOR_WHITE.svg' alt='Valo' width={28} height={28} className='w-6 h-6 sm:w-7 sm:h-7' />
          <span className='text-white font-bold text-lg' style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}>
            valo
          </span>
        </Link>

        {/* CTA Button */}
        <button
          type='button'
          onClick={() => setIsWaitlistModalOpen(true)}
          style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          className='bg-primary-500 hover:bg-primary-700 text-white text-sm font-medium px-4 sm:px-5 py-2 rounded-[10px] transition-colors'
        >
          Join the Waitlist
        </button>
      </nav>
      {/* Main  */}
      <main className=' relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-32 '>
        {/* Hero Section */}
        <div className='min-h-dvh flex flex-col'>
          <AnimateInView className='w-full max-w[1000p] mx-auto text-center' y={24} amount={0.3}>
            {/* Logo Icon */}
            <div className='mb-6'>
              <Image
                src='/LOGO_VALOR.svg'
                alt='Valo'
                width={64}
                height={64}
                className='mx-auto w-14 h-14 sm:w-16 sm:h-16'
              />
            </div>

            {/* Main Heading */}
            <h1
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2'
            >
              Build Smarter. Validate Faster
            </h1>

            {/* Subtitle */}
            <p className='text-white/60 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 px-4 max-w-xl mx-auto'>
              Post your idea, get instant AI-powered market insights, and real feedback from real people — all in one
              place.
            </p>

            {/* Waitlist CTA */}
            <div className='max-w-[500px] mx-auto px-4'>
              {heroStatus === 'success' ? (
                <p className='text-accent-500 font-medium text-base sm:text-lg'>{heroMessage}</p>
              ) : (
                <form onSubmit={handleHeroSubmit} className='flex items-center gap-0 rounded-[10px] border border-white/15 bg-white/5 p-1.5'>
                  <input
                    type='email'
                    required
                    placeholder='Enter your email'
                    value={heroEmail}
                    onChange={(e) => setHeroEmail(e.target.value)}
                    className='flex-1 min-w-0 bg-transparent text-white placeholder:text-white/40 text-sm sm:text-base px-3 sm:px-4 py-2.5 outline-none'
                  />
                  <button
                    type='submit'
                    disabled={heroStatus === 'loading'}
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='shrink-0 bg-primary-500 hover:bg-primary-700 disabled:opacity-60 text-white text-sm sm:text-base font-medium px-5 sm:px-6 py-2.5 rounded-[8px] transition-colors'
                  >
                    {heroStatus === 'loading' ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>
              )}
              {heroStatus === 'error' && (
                <p className='text-red-400 text-sm mt-2'>{heroMessage}</p>
              )}
            </div>

            {/* Tagline */}
            <p className='mt-6 sm:mt-8 text-white/40 text-sm'>Built for entrepreneurs who want real validation</p>
          </AnimateInView>

          {/* Features Section */}
          <AnimateInView className='w-full max-w-4xl mx-auto mt-16 sm:mt-24 px-4'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
              <AnimateInView delay={0}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500  flex items-center justify-center mb-3 sm:mb-4'>
                    <ChartNoAxesCombinedIcon size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Market Analysis</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>AI-powered TAM insights.</p>
                </div>
              </AnimateInView>

              <AnimateInView delay={0.05}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500  flex items-center justify-center mb-3 sm:mb-4'>
                    <UserRoundCheckIcon size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Competitor Intel</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>Know who you're up against.</p>
                </div>
              </AnimateInView>

              <AnimateInView delay={0.1}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500  flex items-center justify-center mb-3 sm:mb-4'>
                    <UsersRound size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Community</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>Real feedback from real people.</p>
                </div>
              </AnimateInView>

              <AnimateInView delay={0.15}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8 h-full'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500  flex items-center justify-center mb-3 sm:mb-4'>
                    <ChartColumnBigIcon size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Difficulty Score</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>Know what it takes</p>
                </div>
              </AnimateInView>
            </div>
          </AnimateInView>
        </div>
        {/* Why Choose Valo Section */}
        <AnimateInView
          id='about'
          className='max-w-4xl mx-auto pt-30 sm:pt-24 px-4 min-h-dvh flex flex-col items-start justify-center gap-10'
        >
          <div className='w-full flex flex-col items-start justify-center space-y-4'>
            <h1
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-8'
            >
              Why Choose Valo?
            </h1>
            <p className='text-lg'>
              <b className='text-[#F96B13]'> Valo gives you real answers before you commit.</b> Post your idea and get
              two things most founders skip: AI-powered market analysis that cuts through your assumptions, and honest
              feedback from real people who'll tell you if they'd actually use it.
            </p>
            <p className='text-lg'>
              No more guessing. No more building in the dark. Just clarity on whether your idea has legs—before you take
              the leap.
            </p>
            <p className='font-bold text-lg mt-5'>Validate smart. Build confident. Launch right.</p>
          </div>
          <div className='w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-10 '>
            <div className='flex flex-col items-center justify-center space-x-4'>
              <CountUp from={0} to={80} duration={2} className='text-white text-6xl font-bold' suffix='%' />
              <p className='text-white text-lg text-center font-medium w-[250px]'>
                of new products fail because there's no demand
              </p>
            </div>
            <div className='flex flex-col items-center justify-center space-x-4'>
              <div className='flex items-center justify-center space-x-2'>
                <Image src='/LOGO_VALOR.svg' alt='Check' width={30} height={30} className='w-6 h-6' />
                <CountUp from={0} to={20} duration={2} className='text-white text-6xl font-bold ' suffix='%' />
              </div>
              <p className='text-white text-lg text-center font-medium w-[250px]'>
                of new products succeed because they did the research
              </p>
            </div>
          </div>
        </AnimateInView>
        {/* How it works */}
        <AnimateInView
          id='how-it-works'
          className='max-w-5xl mx-auto pt-20 sm:pt-24 px-4 sm:px-6 min-h-dvh flex flex-col items-start justify-center gap-6 sm:gap-10'
        >
          <div className='w-full flex flex-col items-center justify-center space-y-3 sm:space-y-4'>
            <Image
              src='/HowItWorks.png'
              alt='How it works'
              width={120}
              height={100}
              className='w-20 h-auto sm:w-[120px]'
            />
            <h1
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center'
            >
              Fast track to building
            </h1>
            <p className='text-white/40 text-base sm:text-lg text-center font-medium px-2'>
              Validate your idea in three steps.
            </p>
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 sm:gap-8 md:gap-10'>
            {/* Step 1 */}
            <AnimateInView delay={0} y={16}>
              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-10'>
                <h1 className='text-accent-500 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none shrink-0'>
                  1
                </h1>
                <div className='flex-1 min-w-0'>
                  <h2
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='text-white text-xl sm:text-2xl font-black mb-2'
                  >
                    Post
                  </h2>
                  <p className='text-white font-medium text-sm sm:text-base max-w-[280px]'>
                    Put in the problem you’re trying to solve through a business idea
                  </p>
                </div>
              </div>
            </AnimateInView>
            {/* Step 2 */}
            <AnimateInView delay={0.08} y={16}>
              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-10'>
                <h1 className='text-accent-500 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none shrink-0'>
                  2
                </h1>
                <div className='flex-1 min-w-0'>
                  <h2
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='text-white text-xl sm:text-2xl font-black mb-2'
                  >
                    Validate
                  </h2>
                  <p className='text-white font-medium text-sm sm:text-base max-w-[280px]'>
                    Get AI market insights and hear opinions from the public
                  </p>
                </div>
              </div>
            </AnimateInView>
            {/* Step 3 */}
            <AnimateInView delay={0.16} y={16}>
              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-10'>
                <h1 className='text-accent-500 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none shrink-0'>
                  3
                </h1>
                <div className='flex-1 min-w-0'>
                  <h2
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='text-white text-xl sm:text-2xl font-black mb-2'
                  >
                    Build
                  </h2>
                  <p className='text-white font-medium text-sm sm:text-base max-w-[280px]'>
                    Start building your product with the right direction.
                  </p>
                </div>
              </div>
            </AnimateInView>
          </div>
        </AnimateInView>

        {/* Pre-footer CTA Section */}
        <AnimateInView className='w-full max-w-4xl mx-auto px-4 min-h-dvh flex flex-col items-center justify-center'>
          <div className='text-center flex flex-col items-center justify-center space-y-6'>
            <Image src='/LOGO_VALOR.svg' alt='Valo' width={50} height={50} />
            <h2
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-white text-3xl sm:text-4xl md:text-5xl font-bold'
            >
              Ready to validate your idea?
            </h2>
            <p className='text-white/60 text-base sm:text-lg max-w-xl mx-auto'>
              Join thousands of entrepreneurs who are building smarter. Get early access and be the first to know when
              we launch.
            </p>
            <button
              type='button'
              onClick={() => setIsWaitlistModalOpen(true)}
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='inline-block bg-primary-500 hover:bg-primary-700 text-white text-sm sm:text-base font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-[10px] transition-colors'
            >
              Join the Waitlist
            </button>
          </div>
        </AnimateInView>
        <footer className='w-screen grid grid-cols-1 md:grid-cols-3 justify-items-center items-center h-[300px] bg-black px-3'>
          <div className='flex items-center justify-center gap-5'>
            <Image src='/LOGO_VALOR_WHITE.svg' alt='Valo' width={100} height={100} />
            <h1 style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }} className='text-white text-5xl font-bold'>
              valor
            </h1>
          </div>
          <div className='flex flex-col items-start justify-center gap-5'>
            <Link href='/contact-us' className='text-white text-sm sm:text-base font-medium'>
              Contact Us
            </Link>
            <Link href='/privacy-policy' className='text-white text-sm sm:text-base font-medium'>
              Privacy Policy
            </Link>
            <Link href='/terms-of-service' className='text-white text-sm sm:text-base font-medium'>
              Terms of Service
            </Link>
          </div>
        </footer>
      </main>

      <WaitlistModal isOpen={isWaitlistModalOpen} onClose={() => setIsWaitlistModalOpen(false)} />
    </div>
  );
}
