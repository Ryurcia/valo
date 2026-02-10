'use client';

import { useState } from 'react';
import { X, Users, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import type { MatchResult } from '@/lib/matching';

interface CollaborationModalProps {
  ideaId: string;
  recipientId: string;
  ideaTitle: string;
  matchResult: MatchResult | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CollaborationModal({
  ideaId,
  recipientId,
  ideaTitle,
  matchResult,
  onClose,
  onSuccess,
}: CollaborationModalProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please write a message explaining why you want to collaborate.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId,
          ideaId,
          message: message.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send request');
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 70) return 'text-green-400';
    if (pct >= 40) return 'text-amber-400';
    return 'text-white/50';
  };

  return (
    <div className='fixed inset-0 z-[400] flex items-center justify-center p-4'>
      <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />

      <div className='relative w-full max-w-lg bg-surface-variant rounded-xl border border-white/10 shadow-xl'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-white/10'>
          <div className='flex items-center gap-2'>
            <Users size={20} className='text-primary-500' />
            <h2 className='text-lg font-semibold text-white'>Request Collaboration</h2>
          </div>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className='p-6 space-y-5'>
          <p className='text-sm text-white/60'>
            Send a collaboration request for <span className='text-white font-medium'>&ldquo;{ideaTitle}&rdquo;</span>
          </p>

          {/* Match Breakdown */}
          {matchResult && (
            <div className='p-4 rounded-lg bg-white/5 border border-white/10 space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-white/60'>Your Match</span>
                <span className={`text-lg font-bold ${getMatchColor(matchResult.percentage)}`}>
                  {matchResult.percentage}%
                </span>
              </div>
              <div className='space-y-2 text-xs'>
                {matchResult.matched_skills.length > 0 && (
                  <div className='flex items-start gap-2'>
                    <CheckCircle size={14} className='text-green-400 shrink-0 mt-0.5' />
                    <span className='text-white/60'>
                      Matching skills: {matchResult.matched_skills.join(', ')}
                    </span>
                  </div>
                )}
                {matchResult.matched_roles.length > 0 && (
                  <div className='flex items-start gap-2'>
                    <CheckCircle size={14} className='text-green-400 shrink-0 mt-0.5' />
                    <span className='text-white/60'>
                      Matching roles: {matchResult.matched_roles.join(', ')}
                    </span>
                  </div>
                )}
                {matchResult.availability_match && (
                  <div className='flex items-start gap-2'>
                    <CheckCircle size={14} className='text-green-400 shrink-0 mt-0.5' />
                    <span className='text-white/60'>Availability matches</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor='collab-message' className='block text-sm font-medium text-white/60 mb-1.5'>
              Your Message
            </label>
            <textarea
              id='collab-message'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder='Introduce yourself and explain what you bring to this idea...'
              className='w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:outline-none resize-none text-sm'
            />
          </div>

          {error && (
            <div className='flex items-center gap-2 py-2 px-3 rounded-lg bg-error-500/10 text-error-500 text-sm'>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          {success && (
            <div className='flex items-center gap-2 py-2 px-3 rounded-lg bg-green-500/10 text-green-400 text-sm'>
              <CheckCircle size={16} />
              Request sent successfully!
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex gap-3 p-6 border-t border-white/10'>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className='px-4 py-2.5 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors font-medium disabled:opacity-50'
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || success}
            className='flex-1 py-2.5 px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2'
          >
            {isSubmitting ? (
              <>
                <Loader2 className='w-4 h-4 animate-spin' />
                Sending...
              </>
            ) : success ? (
              <>
                <CheckCircle className='w-4 h-4' />
                Sent!
              </>
            ) : (
              'Send Request'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
