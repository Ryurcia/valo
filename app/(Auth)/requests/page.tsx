'use client';

import { useState, useEffect, useCallback } from 'react';
import { Inbox } from 'lucide-react';
import RequestCard from '@/components/RequestCard';
import type { EnrichedConnection } from '@/types';

type Filter = 'pending' | 'all';

export default function RequestsPage() {
  const [connections, setConnections] = useState<EnrichedConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('pending');

  const fetchConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/connections?type=received');
      if (res.ok) {
        const data = await res.json();
        setConnections(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  const handleRespond = async (id: string, status: 'accepted' | 'declined', rejectionReason?: string) => {
    const res = await fetch(`/api/connections/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason }),
    });

    if (res.ok) {
      setConnections((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    }
  };

  const filtered = filter === 'pending'
    ? connections.filter((c) => c.status === 'pending')
    : connections;

  const pendingCount = connections.filter((c) => c.status === 'pending').length;

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <h1
          style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          className='text-3xl font-bold text-white'
        >
          Requests
          {pendingCount > 0 && (
            <span className='ml-3 text-lg font-normal text-white/40'>
              {pendingCount} pending
            </span>
          )}
        </h1>

        <div className='flex items-center gap-1 bg-surface rounded-lg p-1'>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'pending'
                ? 'bg-surface-variant text-white font-medium'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-surface-variant text-white font-medium'
                : 'text-white/50 hover:text-white'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className='flex justify-center py-20'>
          <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
        </div>
      ) : filtered.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-white/40'>
          <Inbox size={48} strokeWidth={1} />
          <p className='mt-4 text-lg'>
            {filter === 'pending' ? 'No pending requests' : 'No requests yet'}
          </p>
          <p className='text-sm'>
            {filter === 'pending'
              ? 'You\'re all caught up!'
              : 'When someone wants to collaborate on your ideas, their requests will appear here.'}
          </p>
        </div>
      ) : (
        <div className='flex flex-col gap-3'>
          {filtered.map((connection) => (
            <RequestCard
              key={connection.id}
              connection={connection}
              onRespond={handleRespond}
            />
          ))}
        </div>
      )}
    </div>
  );
}
