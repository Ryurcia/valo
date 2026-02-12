'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Home, TrendingUp, Globe, Bell, Handshake, Settings, HelpCircle, Plus, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

const mainMenuItems = [
  { label: 'Home', icon: Home, href: '/home' },
  { label: 'Trending', icon: TrendingUp, href: '/tending' },
  { label: 'Explore', icon: Globe, href: '/explore' },
  { label: 'Requests', icon: Handshake, href: '/requests' },
  { label: 'Notifications', icon: Bell, href: '/notifications' },
];

const bottomMenuItems = [
  { label: 'Settings', icon: Settings, href: '/settings' },
  { label: 'Help & Support', icon: HelpCircle, href: '/support' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();
  const { unreadCount } = useNotifications();

  const fullName = user?.fullName || user?.firstName || 'User';
  const username = user?.username || user?.primaryEmailAddress?.emailAddress || '';

  return (
    <div className='relative hidden md:flex'>
      <aside
        className={cn(
          'flex flex-col h-dvh sticky top-0 bg-surface border-r border-white/10 transition-all duration-300 ease-in-out',
          collapsed ? 'w-[72px]' : 'w-[260px]'
        )}
      >
        {/* Logo */}
        <div
          className={cn(
            'flex items-center pt-5 pb-10 transition-all duration-300',
            collapsed ? 'justify-center px-4' : 'px-4'
          )}
        >
          <Link href='/home' className={cn('flex items-center gap-2.5 overflow-hidden', collapsed && 'justify-center')}>
            <Image src='/LOGO_VALOR.svg' alt='Valo' width={32} height={32} className='shrink-0' />
            <span
              className={cn(
                'text-xl font-bold text-white whitespace-nowrap transition-all duration-300',
                collapsed ? 'hidden' : 'block'
              )}
              style={{ fontFamily: 'var(--font-zalando-sans-expanded)' }}
            >
              valo
            </span>
          </Link>
        </div>

        {/* Validate Idea Button */}
        <div className='px-3 mb-6'>
          <Link
            href='/ideas/new'
            className={cn(
              'flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-colors',
              collapsed ? 'w-12 h-12 mx-auto p-0' : 'w-full py-2 px-4'
            )}
          >
            <Plus size={20} className='shrink-0' />
            <span
              className={cn(
                'whitespace-nowrap transition-all duration-300 overflow-hidden',
                collapsed ? 'hidden' : 'block'
              )}
            >
              Validate Idea
            </span>
          </Link>
        </div>

        {/* Main Menu */}
        <div className='flex-1 flex flex-col'>
          <div className='px-3'>
            <p
              className={cn(
                'text-xs text-white/40 uppercase tracking-wider mb-2 transition-all duration-300 overflow-hidden whitespace-nowrap',
                collapsed ? 'opacity-0 h-0 mb-0 px-0' : 'opacity-100 h-auto px-3'
              )}
            >
              Main menu
            </p>
            <nav className='flex flex-col gap-3'>
              {mainMenuItems.map((item) => {
                const isActive = pathname === item.href;
                const showBadge = item.label === 'Notifications' && unreadCount > 0;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg transition-colors relative',
                      collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5',
                      isActive
                        ? 'bg-surface-variant text-white font-medium'
                        : 'text-white/60 hover:text-white hover:bg-surface-variant'
                    )}
                  >
                    <div className='relative shrink-0'>
                      <item.icon size={20} />
                      {showBadge && collapsed && (
                        <span className='absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-surface' />
                      )}
                    </div>
                    <span
                      className={cn(
                        'whitespace-nowrap transition-all duration-300 overflow-hidden flex-1',
                        collapsed ? 'hidden' : 'block'
                      )}
                    >
                      {item.label}
                    </span>
                    {showBadge && !collapsed && (
                      <span className='flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-medium text-white bg-primary-500 rounded-full'>
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Divider */}
          <div className='mx-4 my-4 border-t border-white/10' />

          {/* Settings & Support */}
          <div className='px-3'>
            <nav className='flex flex-col gap-3'>
              {bottomMenuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors',
                    collapsed ? 'justify-center px-0 py-3' : 'px-3 py-2.5'
                  )}
                >
                  <item.icon size={20} className='shrink-0' />
                  <span
                    className={cn(
                      'whitespace-nowrap transition-all duration-300 overflow-hidden',
                      collapsed ? 'hidden' : 'block'
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Spacer */}
          <div className='flex-1' />

          {/* User Section */}
          <div className='px-3 pb-5'>
            <Link href='/profile'>
              <div
                className={cn(
                  'flex items-center gap-3 rounded-xl p-2.5 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors cursor-pointer',
                  collapsed && 'justify-center p-2 bg-transparent hover:bg-white/5'
                )}
              >
                <div className='w-9 h-9 rounded-full bg-white/20 shrink-0 overflow-hidden'>
                  {user?.imageUrl && (
                    <Image
                      src={user.imageUrl}
                      alt={fullName}
                      width={36}
                      height={36}
                      className='w-full h-full object-cover'
                    />
                  )}
                </div>
                <div
                  className={cn(
                    'flex flex-col min-w-0 transition-all duration-300 overflow-hidden',
                    collapsed ? 'hidden' : 'block'
                  )}
                >
                  <span className='flex flex-col  text-sm font-medium text-white truncate'>{fullName}</span>
                  {username && (
                    <span className='text-xs text-white/40 truncate'>@{username.replace('@', '').split('@')[0]}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </aside>

      {/* Collapse toggle - outside sidebar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className='absolute top-5 right-0 translate-x-full h-9 w-9 flex items-center justify-center rounded-r-lg bg-[#131920] border border-l-0 border-white/10 text-white/50 hover:text-white transition-colors z-10'
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
      </button>
    </div>
  );
}
