'use client';

import Link from 'next/link';
import { CheckCircle, XCircle, UserPlus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';

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

const iconConfig = {
  connection_accepted: { icon: CheckCircle, bg: 'bg-accent-500/10', color: 'text-accent-500' },
  connection_declined: { icon: XCircle, bg: 'bg-error-500/10', color: 'text-error-500' },
  connection_request: { icon: UserPlus, bg: 'bg-primary-500/10', color: 'text-primary-500' },
} as const;

function getNotificationText(notification: Notification): string {
  switch (notification.type) {
    case 'connection_accepted':
      return 'accepted your collaboration request';
    case 'connection_declined':
      return 'declined your collaboration request';
    case 'connection_request':
      return 'wants to collaborate';
  }
}

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const config = iconConfig[notification.type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border transition-colors',
        notification.read
          ? 'bg-surface border-white/5'
          : 'bg-surface-variant border-white/10'
      )}
    >
      {/* Icon */}
      <div className={cn('flex items-center justify-center w-10 h-10 rounded-full shrink-0', config.bg)}>
        <Icon size={20} className={config.color} />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm text-white'>
          <span className='font-medium'>{notification.actor_name}</span>{' '}
          {getNotificationText(notification)}
          {notification.idea_title && (
            <>
              {' '}on <span className='font-medium'>{notification.idea_title}</span>
            </>
          )}
        </p>

        {notification.message && (
          <p className='mt-1.5 text-sm text-white/50 italic'>
            &ldquo;{notification.message}&rdquo;
          </p>
        )}

        <div className='flex items-center gap-3 mt-1'>
          <span className='text-xs text-white/30'>{timeAgo(notification.created_at)}</span>
          {notification.type === 'connection_request' && (
            <Link
              href='/requests'
              className='text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors'
            >
              View Requests
            </Link>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-1 shrink-0'>
        {!notification.read && (
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className='w-2 h-2 rounded-full bg-primary-500 shrink-0'
            aria-label='Mark as read'
            title='Mark as read'
          />
        )}
        <button
          onClick={() => onDelete(notification.id)}
          className='p-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors'
          aria-label='Dismiss'
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
