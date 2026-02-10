'use client';

import { useState } from 'react';
import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import CollaborationModal from './CollaborationModal';
import type { MatchResult } from '@/lib/matching';

interface CollaborationCTAProps {
  ideaId: string;
  ideaTitle: string;
  recipientId: string;
  matchResult: MatchResult | null;
  connectionStatus: string | null;
  hasProfile: boolean;
}

export default function CollaborationCTA({
  ideaId,
  ideaTitle,
  recipientId,
  matchResult,
  connectionStatus,
  hasProfile,
}: CollaborationCTAProps) {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(connectionStatus);

  const getMatchColor = (pct: number) => {
    if (pct >= 70) return 'text-green-400';
    if (pct >= 40) return 'text-amber-400';
    return 'text-white/50';
  };

  if (status === 'accepted') {
    return (
      <div className='flex items-center gap-2 py-3 px-4 rounded-lg bg-green-500/10 border border-green-500/20'>
        <Users size={18} className='text-green-400' />
        <span className='text-sm font-medium text-green-400'>Connected — You&apos;re collaborating on this idea</span>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <div className='flex items-center gap-2 py-3 px-4 rounded-lg bg-amber-500/10 border border-amber-500/20'>
        <Users size={18} className='text-amber-400' />
        <span className='text-sm font-medium text-amber-400'>Collaboration request pending</span>
      </div>
    );
  }

  if (status === 'declined') {
    return (
      <div className='flex items-center gap-2 py-3 px-4 rounded-lg bg-white/5 border border-white/10'>
        <Users size={18} className='text-white/40' />
        <span className='text-sm text-white/40'>Your previous request was declined</span>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-3'>
        {/* Match Percentage */}
        {matchResult && (
          <div className='flex items-center gap-3'>
            <span className='text-sm text-white/50'>Your match:</span>
            <span className={`text-xl font-bold ${getMatchColor(matchResult.percentage)}`}>
              {matchResult.percentage}%
            </span>
          </div>
        )}

        {/* CTA Button or Profile Prompt */}
        {hasProfile ? (
          <button
            onClick={() => setShowModal(true)}
            className='w-full py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
          >
            <UserPlus size={18} />
            Request Collaboration
          </button>
        ) : (
          <div className='p-4 rounded-lg bg-white/5 border border-white/10'>
            <p className='text-sm text-white/60 mb-2'>
              Complete your profile to request collaboration. Your skills and interests help founders find the right
              match.
            </p>
            <Link
              href='/profile'
              className='inline-flex items-center gap-1.5 text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors'
            >
              Complete Profile →
            </Link>
          </div>
        )}
      </div>

      {showModal && (
        <CollaborationModal
          ideaId={ideaId}
          recipientId={recipientId}
          ideaTitle={ideaTitle}
          matchResult={matchResult}
          onClose={() => setShowModal(false)}
          onSuccess={() => setStatus('pending')}
        />
      )}
    </>
  );
}
