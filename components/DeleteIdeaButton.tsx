'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Trash2 } from 'lucide-react';

interface DeleteIdeaButtonProps {
  ideaId: string;
}

export default function DeleteIdeaButton({ ideaId }: DeleteIdeaButtonProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const closeAll = useCallback(() => {
    setShowMenu(false);
    setShowConfirm(false);
  }, []);

  // Close on escape key
  useEffect(() => {
    if (!showMenu && !showConfirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showMenu, showConfirm, closeAll]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showMenu || showConfirm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showMenu, showConfirm]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/ideas/${ideaId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }
      router.push('/home');
    } catch {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {/* Three-dot trigger */}
      <button
        onClick={() => setShowMenu(true)}
        className='p-2 -m-2 rounded-full text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors'
        aria-label='More options'
      >
        <MoreHorizontal size={20} />
      </button>

      {/* Bottom sheet menu */}
      {showMenu && (
        <div className='fixed inset-0 z-[400] flex items-end justify-center' onClick={closeAll}>
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/60 animate-fade-in' />

          {/* Sheet */}
          <div
            className='relative w-full max-w-lg mx-4 mb-4 animate-slide-up'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='rounded-xl overflow-hidden'>
              <button
                onClick={() => {
                  setShowMenu(false);
                  setShowConfirm(true);
                }}
                className='w-full flex items-center justify-center gap-2.5 px-4 py-3.5 bg-surface-variant text-error-500 text-sm font-semibold hover:bg-white/10 transition-colors'
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>

            <button
              onClick={closeAll}
              className='w-full mt-2 px-4 py-3.5 rounded-xl bg-surface-variant text-white text-sm font-semibold hover:bg-white/10 transition-colors'
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {showConfirm && (
        <div className='fixed inset-0 z-[400] flex items-center justify-center' onClick={closeAll}>
          {/* Backdrop */}
          <div className='absolute inset-0 bg-black/60 animate-fade-in' />

          {/* Modal */}
          <div
            className='relative w-full max-w-xs mx-4 rounded-xl bg-surface-variant overflow-hidden animate-scale-in'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='px-6 pt-6 pb-4 text-center'>
              <h3 className='text-base font-semibold text-white mb-1'>Delete post?</h3>
              <p className='text-sm text-white/50'>This can&apos;t be undone and it will be removed permanently.</p>
            </div>

            <div className='border-t border-white/10'>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className='w-full px-4 py-3.5 text-sm font-bold text-error-500 hover:bg-white/5 transition-colors disabled:opacity-50'
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>

            <div className='border-t border-white/10'>
              <button
                onClick={closeAll}
                disabled={isDeleting}
                className='w-full px-4 py-3.5 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
