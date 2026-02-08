'use client';

import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LandingBackground from '@/components/LandingBackground';

export default function SignInPage() {
  const { signIn, isLoaded: signInLoaded, setActive: setSignInActive } = useSignIn();
  const { signUp, isLoaded: signUpLoaded, setActive: setSignUpActive } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!signInLoaded || !signUpLoaded) {
    return (
      <div className='min-h-dvh flex flex-col relative overflow-hidden'>
        <LandingBackground />
        <div className='relative z-10 flex items-center justify-center min-h-dvh'>
          <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  const handleSendCode = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'sign-in') {
        const result = await signIn.create({ identifier: email });

        const emailFactor = result.supportedFirstFactors?.find((factor) => factor.strategy === 'email_code');

        if (emailFactor && 'emailAddressId' in emailFactor) {
          await signIn.prepareFirstFactor({
            strategy: 'email_code',
            emailAddressId: emailFactor.emailAddressId,
          });
          setIsVerifying(true);
        } else {
          setError('Email code sign-in is not available for this account.');
        }
      } else {
        await signUp.create({ emailAddress: email });
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setIsVerifying(true);
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { code?: string; longMessage?: string; message?: string }[] };
      const firstError = clerkError?.errors?.[0];

      if (mode === 'sign-in' && firstError?.code === 'form_identifier_not_found') {
        setMode('sign-up');
        setError('No account found with that email. Sign up instead?');
      } else if (mode === 'sign-up' && firstError?.code === 'form_identifier_exists') {
        setMode('sign-in');
        setError('An account already exists with that email. Sign in instead?');
      } else {
        setError(firstError?.longMessage || firstError?.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'sign-in') {
        const result = await signIn.attemptFirstFactor({
          strategy: 'email_code',
          code,
        });

        if (result.status === 'complete') {
          await setSignInActive({ session: result.createdSessionId });
          router.push('/home');
        }
      } else {
        const result = await signUp.attemptEmailAddressVerification({ code });

        if (result.status === 'complete') {
          await setSignUpActive({ session: result.createdSessionId });
          router.push('/onboarding');
        }
      }
    } catch (err: unknown) {
      const clerkError = err as { errors?: { longMessage?: string; message?: string }[] };
      const firstError = clerkError?.errors?.[0];
      setError(firstError?.longMessage || firstError?.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'sign-in' | 'sign-up') => {
    setMode(newMode);
    setIsVerifying(false);
    setError('');
    setCode('');
  };

  return (
    <div className='min-h-dvh flex flex-col relative overflow-hidden'>
      <LandingBackground />
      <div className='relative z-10 flex items-center justify-center min-h-dvh px-4'>
        <div className='w-full max-w-md'>
          <Link
            href='/'
            className='text-center text-2xl flex items-center justify-center gap-2 font-bold text-white mb-8'
            style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          >
            <Image src='/LOGO_VALOR_WHITE.svg' alt='Valo' width={30} height={30} />
            <h1 className='text-white text-2xl font-bold' style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}>
              valo
            </h1>
          </Link>

          <div className='glass-effect p-8'>
            {/* Tabs */}
            <div className='flex mb-6 rounded-lg overflow-hidden border border-white/10'>
              <button
                type='button'
                onClick={() => switchMode('sign-in')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === 'sign-in' ? 'bg-primary-500 text-white' : 'text-white/60 hover:text-white/80'
                }`}
              >
                Sign In
              </button>
              <button
                type='button'
                onClick={() => switchMode('sign-up')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  mode === 'sign-up' ? 'bg-primary-500 text-white' : 'text-white/60 hover:text-white/80'
                }`}
              >
                Sign Up
              </button>
            </div>

            <h1
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-2xl font-bold text-white text-center mb-1'
            >
              {mode === 'sign-in' ? 'Welcome back' : 'Get Started'}
            </h1>
            <p className='text-white/50 text-sm text-center mb-6'>
              {isVerifying
                ? `Enter the code sent to ${email}`
                : mode === 'sign-in'
                ? 'Enter your email to sign in'
                : 'Enter your email and start validating your ideas'}
            </p>

            {error && (
              <div className='mb-4 p-3 bg-error-500/10 border border-error-500/20 text-error-500 rounded-lg text-sm'>
                {error}
              </div>
            )}

            {!isVerifying ? (
              <form onSubmit={handleSendCode} className='space-y-4'>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Email address'
                  required
                  className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 focus:shadow-lg focus:shadow-primary-500/20 focus:border-transparent outline-none transition-colors'
                />
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium'
                >
                  {loading ? 'Sending code...' : 'Continue with Email'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className='space-y-4'>
                <input
                  type='text'
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder='Verification code'
                  required
                  autoComplete='one-time-code'
                  className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-center text-lg tracking-widest transition-colors'
                />
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium'
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button
                  type='button'
                  onClick={() => {
                    setIsVerifying(false);
                    setCode('');
                    setError('');
                  }}
                  className='w-full py-2 text-white/40 hover:text-white/60 text-sm transition-colors'
                >
                  Use a different email
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

