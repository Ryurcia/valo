import Image from 'next/image';
import Link from 'next/link';
import CountUp from '@/components/CountUp';
import AnimateInView from '@/components/AnimateInView';
import ProductShowcase from '@/components/ProductShowcase';
import LandingNav from '@/components/landing/LandingNav';
import HeroForm from '@/components/landing/HeroForm';
import LandingCTA from '@/components/landing/LandingCTA';
import { ChartColumnBigIcon, ChartNoAxesCombinedIcon, UserRoundCheckIcon, UsersRound } from 'lucide-react';

export default function HomePage() {
  return (
    <div className='min-h-dvh flex flex-col relative overflow-hidden'>
      {/* Background gradient */}
      <div
        className='absolute inset-0 z-0'
        style={{ background: 'linear-gradient(to top, #0a0a0a, #151b21)' }}
      />

      {/* Iridescent orbs (reduced from 8 → 4) */}
      <div
        className='absolute z-0 w-[120vmax] h-[120vmax] rounded-full blur-[120px] animate-iridescent-1 pointer-events-none will-change-transform'
        style={{
          left: '-55%',
          top: '-30%',
          background:
            'radial-gradient(circle, rgba(249, 107, 19, 0.14) 0%, rgba(249, 107, 19, 0.05) 40%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[100vmax] h-[100vmax] rounded-full blur-[100px] animate-iridescent-2 pointer-events-none will-change-transform'
        style={{
          right: '-55%',
          bottom: '-25%',
          background:
            'radial-gradient(circle, rgba(19, 249, 184, 0.12) 0%, rgba(19, 249, 184, 0.04) 45%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[100vmax] h-[100vmax] rounded-full opacity-[0.2] blur-[100px] animate-wave-1 pointer-events-none will-change-transform'
        style={{
          left: '-20%',
          top: '-30%',
          background: 'radial-gradient(circle, #3d2218 0%, transparent 70%)',
        }}
      />
      <div
        className='absolute z-0 w-[70vmax] h-[70vmax] rounded-full opacity-[0.15] blur-[70px] animate-wave-4 pointer-events-none will-change-transform'
        style={{
          right: '-10%',
          bottom: '-15%',
          background: 'radial-gradient(circle, #3d2218 0%, transparent 70%)',
        }}
      />

      {/* Navbar (client component) */}
      <LandingNav />

      {/* Main */}
      <main className='relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-32'>
        {/* Hero Section */}
        <div className='h-dvh flex flex-col 2xl:mt-30'>
          <AnimateInView className='w-full max-w-[1000px] mx-auto text-center' y={24} amount={0.3}>
            {/* Logo Icon */}
            <div className='mb-6'>
              <Image src='/LOGO_VALOR.svg' alt='Valo' width={40} height={40} className='mx-auto' />
            </div>

            {/* Main Heading */}
            <h1
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-2'
            >
              Validate Smarter. Build Faster.
            </h1>

            {/* Subtitle */}
            <p className='text-white/60 text-sm sm:text-base md:text-lg mb-8 sm:mb-10 px-4 max-w-2xl mx-auto'>
              Stop going to your friends for validation, Post your idea and get real feedback from real people &
              AI-powered market insights with Valo
            </p>

            {/* Waitlist CTA (client component) */}
            <HeroForm />

            {/* Tagline */}
            <p className='mt-6 sm:mt-8 text-white text-sm font-bold'>
              Validate smarter 🧠 Build confident 💪 Launch right 🚀
            </p>
          </AnimateInView>

          {/* Features Section */}
          <AnimateInView className='w-full max-w-4xl mx-auto mt-16 sm:mt-24 px-4'>
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
              <AnimateInView delay={0}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500 flex items-center justify-center mb-3 sm:mb-4'>
                    <ChartNoAxesCombinedIcon size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Market Analysis</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>AI-powered TAM insights.</p>
                </div>
              </AnimateInView>

              <AnimateInView delay={0.05}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500 flex items-center justify-center mb-3 sm:mb-4'>
                    <UserRoundCheckIcon size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Competitor Intel</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>Know who you&apos;re up against.</p>
                </div>
              </AnimateInView>

              <AnimateInView delay={0.1}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500 flex items-center justify-center mb-3 sm:mb-4'>
                    <UsersRound size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Community</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>Real feedback from real people.</p>
                </div>
              </AnimateInView>

              <AnimateInView delay={0.15}>
                <div className='p-4 sm:p-5 rounded-[10px] bg-white/3 border border-white/8 h-full'>
                  <div className='w-8 h-8 rounded-[10px] bg-accent-500 flex items-center justify-center mb-3 sm:mb-4'>
                    <ChartColumnBigIcon size={16} className='text-accent-950' />
                  </div>
                  <h3 className='text-white text-sm sm:text-base font-medium mb-1'>Difficulty Score</h3>
                  <p className='text-white/40 text-xs sm:text-sm'>Know what it takes</p>
                </div>
              </AnimateInView>
            </div>
          </AnimateInView>
        </div>

        {/* Product Showcase Sections */}
        <div className='w-full max-w-6xl mx-auto mt-16 sm:mt-24 px-4 sm:px-6'>
          <ProductShowcase />
        </div>

        {/* Why Choose Valo Section */}
        <AnimateInView
          id='about'
          className='max-w-4xl mx-auto pt-30 sm:pt-24 px-4 min-h-dvh flex flex-col items-start justify-center gap-10'
        >
          <div className='w-full flex flex-col items-start justify-center space-y-4'>
            <h2
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-8'
            >
              Why Choose Valo?
            </h2>
            <p className='text-lg'>
              <b className='text-[#F96B13]'> Valo gives you real answers before you commit.</b> Share your idea. Get the
              two things you actually need: AI-powered insights that challenge what you think you know, and real people
              who won&apos;t sugarcoat whether they&apos;d pay for it
            </p>
            <p className='text-lg'>
              No more guessing. No more building in the dark. Just clarity on whether your idea has legs—before you take
              the leap.
            </p>
            <p className='font-bold text-lg mt-5'>Validate smart. Build confident. Launch right.</p>
          </div>
          <div className='w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-10'>
            <div className='flex flex-col items-center justify-center space-x-4 gap-3'>
              <CountUp from={0} to={80} duration={2} className='text-6xl font-bold text-error-500' suffix='%' />
              <p className='text-white text-lg text-center font-medium w-[250px]'>
                of new products fail because there&apos;s no demand
              </p>
            </div>
            <div className='flex flex-col items-center justify-center space-x-4 gap-3'>
              <CountUp from={0} to={20} duration={2} className='text-success-500 text-6xl font-bold' suffix='%' />
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
            <h2
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center'
            >
              Fast track to building
            </h2>
            <p className='text-white/40 text-base sm:text-lg text-center font-medium px-2'>
              Validate your idea in three steps.
            </p>
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 sm:gap-8 md:gap-10'>
            {/* Step 1 */}
            <AnimateInView delay={0} y={16}>
              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-10'>
                <h2 className='text-accent-500 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none shrink-0'>
                  1
                </h2>
                <div className='flex-1 min-w-0'>
                  <h3
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='text-white text-xl sm:text-2xl font-black mb-2'
                  >
                    Post
                  </h3>
                  <p className='text-white font-medium text-sm sm:text-base max-w-[280px]'>
                    Put in the problem you&apos;re trying to solve
                  </p>
                </div>
              </div>
            </AnimateInView>
            {/* Step 2 */}
            <AnimateInView delay={0.08} y={16}>
              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-10'>
                <h2 className='text-accent-500 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none shrink-0'>
                  2
                </h2>
                <div className='flex-1 min-w-0'>
                  <h3
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='text-white text-xl sm:text-2xl font-black mb-2'
                  >
                    Validate
                  </h3>
                  <p className='text-white font-medium text-sm sm:text-base max-w-[280px]'>
                    Get AI market insights and hear opinions from the public
                  </p>
                </div>
              </div>
            </AnimateInView>
            {/* Step 3 */}
            <AnimateInView delay={0.16} y={16}>
              <div className='flex flex-col sm:flex-row items-start gap-4 sm:gap-6 md:gap-10'>
                <h2 className='text-accent-500 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none shrink-0'>
                  3
                </h2>
                <div className='flex-1 min-w-0'>
                  <h3
                    style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
                    className='text-white text-xl sm:text-2xl font-black mb-2'
                  >
                    Build
                  </h3>
                  <p className='text-white font-medium text-sm sm:text-base max-w-[280px]'>
                    Start building your product with the right direction.
                  </p>
                </div>
              </div>
            </AnimateInView>
          </div>
        </AnimateInView>

        {/* Pre-footer CTA Section */}
        <section className='relative min-h-dvh flex flex-col items-center justify-center'>
          <AnimateInView className='relative z-10 w-full max-w-4xl mx-auto px-4 min-h-dvh flex flex-col items-center justify-center'>
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
              <LandingCTA />
            </div>
          </AnimateInView>
        </section>

        <footer className='w-screen grid grid-cols-1 md:grid-cols-3 justify-items-center items-center h-[300px] bg-black px-3'>
          <div className='flex items-center justify-center gap-5'>
            <Image src='/LOGO_VALOR_WHITE.svg' alt='Valo' width={100} height={100} />
            <h2 style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }} className='text-white text-5xl font-bold'>
              valo
            </h2>
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
    </div>
  );
}
