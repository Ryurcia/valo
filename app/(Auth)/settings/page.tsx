'use client';

import { useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';

export default function SettingsPage() {
  const { signOut } = useClerk();

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-semibold tracking-heading text-white mb-2'>Settings</h1>
      <p className='text-base text-white/50 font-normal mb-8'>Manage your account</p>

      <div className='bg-surface-variant rounded-lg p-6'>
        <button
          type='button'
          onClick={() => signOut()}
          className='flex items-center gap-2 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors font-medium'
        >
          <LogOut size={18} className='shrink-0' />
          Sign out
        </button>
      </div>
    </div>
  );
}
