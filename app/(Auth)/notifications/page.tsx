'use client';

import { Bell, CheckCheck } from 'lucide-react';
import NotificationItem from '@/components/NotificationItem';
import { useNotifications, NOTIFICATIONS_QUERY_KEY } from '@/hooks/useNotifications';
import { useQueryClient } from '@tanstack/react-query';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const { notifications, isLoading, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    // Optimistic removal from cache
    queryClient.setQueryData(
      NOTIFICATIONS_QUERY_KEY,
      (oldData: Notification[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter((n) => n.id !== id);
      }
    );

    fetch(`/api/notifications?id=${id}`, { method: 'DELETE' }).catch(() => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    });
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='flex items-center justify-between mb-8'>
        <h1
          style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
          className='text-3xl font-bold text-white'
        >
          Notifications
        </h1>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className='flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors'
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className='flex justify-center py-20'>
          <div className='w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin' />
        </div>
      ) : notifications.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-20 text-white/40'>
          <Bell size={48} strokeWidth={1} />
          <p className='mt-4 text-lg'>No notifications yet</p>
          <p className='text-sm'>You&apos;ll be notified when someone responds to your collaboration requests.</p>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead([id])}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
