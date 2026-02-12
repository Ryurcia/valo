'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, Loader2, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EnrichedConnection } from '@/types';

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface RequestCardProps {
  connection: EnrichedConnection;
  onRespond: (id: string, status: 'accepted' | 'declined', rejectionReason?: string) => Promise<void>;
}

export default function RequestCard({ connection, onRespond }: RequestCardProps) {
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState<'accepting' | 'declining' | null>(null);
  const [resolved, setResolved] = useState<'accepted' | 'declined' | null>(null);

  const handleAccept = async () => {
    setLoading('accepting');
    try {
      await onRespond(connection.id, 'accepted');
      setResolved('accepted');
    } finally {
      setLoading(null);
    }
  };

  const handleDecline = async () => {
    setLoading('declining');
    try {
      await onRespond(connection.id, 'declined', rejectionReason.trim() || undefined);
      setResolved('declined');
    } finally {
      setLoading(null);
    }
  };

  if (resolved) {
    return (
      <div
        className={cn(
          'p-4 rounded-lg border',
          resolved === 'accepted'
            ? 'bg-accent-500/5 border-accent-500/20'
            : 'bg-white/5 border-white/10'
        )}
      >
        <p className='text-sm text-white/60'>
          {resolved === 'accepted' ? 'Accepted' : 'Declined'} request from{' '}
          <span className='font-medium text-white'>{connection.requester_name}</span>
          {connection.idea_title && (
            <>
              {' '}for <span className='font-medium text-white'>{connection.idea_title}</span>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className='p-5 rounded-lg border border-white/10 bg-surface-variant'>
      {/* Header */}
      <div className='flex items-start justify-between gap-3 mb-3'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-white'>
            {connection.requester_name}
            {connection.requester_username && (
              <span className='text-white/40 font-normal'> @{connection.requester_username}</span>
            )}
          </p>
          {connection.idea_title && (
            <p className='text-xs text-white/50 mt-0.5'>
              Wants to collaborate on{' '}
              <Link
                href={`/ideas/${connection.idea_id}`}
                className='text-primary-400 hover:text-primary-300 transition-colors'
              >
                {connection.idea_title}
              </Link>
            </p>
          )}
        </div>
        <span className='text-xs text-white/30 shrink-0'>{timeAgo(connection.created_at)}</span>
      </div>

      {/* Message */}
      {connection.message && (
        <div className='flex items-start gap-2 p-3 rounded-md bg-surface mb-4'>
          <MessageSquare size={14} className='text-white/30 mt-0.5 shrink-0' />
          <p className='text-sm text-white/70'>{connection.message}</p>
        </div>
      )}

      {/* Actions */}
      {!showDeclineForm ? (
        <div className='flex items-center gap-2'>
          <button
            onClick={handleAccept}
            disabled={loading !== null}
            className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-accent-500 hover:bg-accent-600 text-background transition-colors disabled:opacity-50'
          >
            {loading === 'accepting' ? (
              <Loader2 size={14} className='animate-spin' />
            ) : (
              <Check size={14} />
            )}
            Accept
          </button>
          <button
            onClick={() => setShowDeclineForm(true)}
            disabled={loading !== null}
            className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50'
          >
            <X size={14} />
            Decline
          </button>
        </div>
      ) : (
        <div className='space-y-3'>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder='Reason for declining (optional)...'
            rows={2}
            className='w-full px-3 py-2 text-sm rounded-lg bg-surface border border-white/10 text-white placeholder-white/30 resize-none focus:outline-none focus:border-primary-500/50'
          />
          <div className='flex items-center gap-2'>
            <button
              onClick={handleDecline}
              disabled={loading !== null}
              className='flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-error-500 hover:bg-error-500/80 text-white transition-colors disabled:opacity-50'
            >
              {loading === 'declining' ? (
                <Loader2 size={14} className='animate-spin' />
              ) : (
                <X size={14} />
              )}
              Confirm Decline
            </button>
            <button
              onClick={() => {
                setShowDeclineForm(false);
                setRejectionReason('');
              }}
              disabled={loading !== null}
              className='px-4 py-2 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-50'
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
