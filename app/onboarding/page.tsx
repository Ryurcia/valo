'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LandingBackground from '@/components/LandingBackground';

const ROLES = ['Entrepreneur', 'Product Manager', 'Developer', 'Designer', 'Marketer', 'Student', 'Investor', 'Other'];

const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia',
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium',
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea',
  'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia',
  'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras',
  'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
  'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon',
  'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia',
  'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova',
  'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal',
  'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia',
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga',
  'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine',
  'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
  'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
];

export default function OnboardingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [country, setCountry] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && user?.publicMetadata?.onboardingComplete) {
      router.push('/dashboard');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className='min-h-dvh flex flex-col relative overflow-hidden'>
        <LandingBackground />
        <div className='relative z-10 flex items-center justify-center min-h-dvh'>
          <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
        </div>
      </div>
    );
  }

  if (user?.publicMetadata?.onboardingComplete) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, username, companyName, role, country }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:ring-2 focus:ring-primary-500 focus:shadow-lg focus:shadow-primary-500/20 focus:border-transparent outline-none transition-colors';

  const selectClass =
    'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:shadow-lg focus:shadow-primary-500/20 focus:border-transparent outline-none transition-colors appearance-none';

  return (
    <div className='min-h-dvh flex flex-col relative overflow-hidden'>
      <LandingBackground />
      <div className='relative z-10 flex items-center justify-center min-h-dvh px-4 py-12'>
        <div className='w-full max-w-md'>
          <Link
            href='/'
            className='text-center text-2xl flex items-center justify-center gap-2 font-bold text-white mb-8'
            style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          >
            <Image src='/LOGO_VALOR_WHITE.svg' alt='Valo' width={30} height={30} />
            <span className='text-white text-2xl font-bold' style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}>
              valo
            </span>
          </Link>

          <div className='glass-effect p-8'>
            <h1
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
              className='text-2xl font-bold text-white text-center mb-1'
            >
              Complete Your Profile
            </h1>
            <p className='text-white/50 text-sm text-center mb-6'>Tell us a bit about yourself to get started</p>

            {error && (
              <div className='mb-4 p-3 bg-error-500/10 border border-error-500/20 text-error-500 rounded-lg text-sm'>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-white/60 text-xs mb-1.5'>First Name *</label>
                  <input
                    type='text'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='John'
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className='block text-white/60 text-xs mb-1.5'>Last Name *</label>
                  <input
                    type='text'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='Doe'
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className='block text-white/60 text-xs mb-1.5'>Username *</label>
                <input
                  type='text'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder='johndoe'
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className='block text-white/60 text-xs mb-1.5'>Role</label>
                <div className='relative'>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
                    <option value='' className='bg-[#1a1a2e] text-white/50'>
                      Select a role
                    </option>
                    {ROLES.map((r) => (
                      <option key={r} value={r} className='bg-[#1a1a2e] text-white'>
                        {r}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                    <svg className='h-4 w-4 text-white/40' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-white/60 text-xs mb-1.5'>Country</label>
                <div className='relative'>
                  <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
                    <option value='' className='bg-[#1a1a2e] text-white/50'>
                      Select a country
                    </option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className='bg-[#1a1a2e] text-white'>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
                    <svg className='h-4 w-4 text-white/40' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-white/60 text-xs mb-1.5'>Company Name</label>
                <input
                  type='text'
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder='Acme Inc.'
                  className={inputClass}
                />
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 font-medium mt-2'
              >
                {loading ? 'Setting up your account...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
