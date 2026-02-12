'use client';

import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { Notification } from '@/types';

export const NOTIFICATIONS_QUERY_KEY = ['notifications'] as const;

async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch('/api/notifications');
  if (!res.ok) {
    throw new Error('Failed to fetch notifications');
  }
  return res.json();
}

export function useNotifications() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const query = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: fetchNotifications,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!user,
  });

  // Realtime subscription for new notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;

          queryClient.setQueryData(
            NOTIFICATIONS_QUERY_KEY,
            (oldData: Notification[] | undefined) => {
              if (!oldData) return [newNotification];
              if (oldData.some((n) => n.id === newNotification.id)) return oldData;
              return [newNotification, ...oldData];
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, user?.id]);

  const unreadCount = useMemo(
    () => (query.data ?? []).filter((n) => !n.read).length,
    [query.data]
  );

  const markAsRead = async (ids: string[]) => {
    if (ids.length === 0) return;

    // Optimistic update
    queryClient.setQueryData(
      NOTIFICATIONS_QUERY_KEY,
      (oldData: Notification[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.map((n) =>
          ids.includes(n.id) ? { ...n, read: true, seen_at: new Date().toISOString() } : n
        );
      }
    );

    const res = await fetch('/api/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) {
      // Rollback on failure
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = (query.data ?? []).filter((n) => !n.read).map((n) => n.id);
    await markAsRead(unreadIds);
  };

  return {
    notifications: query.data ?? [],
    isLoading: query.isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
