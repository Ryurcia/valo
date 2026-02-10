'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import {
  Settings,
  Lightbulb,
  Loader2,
  AlertCircle,
  Users,
  Briefcase,
  Clock,
  MapPin,
  Linkedin,
  Sparkles,
} from 'lucide-react';
import { Idea } from '@/types';

interface ProfileData {
  first_name: string;
  last_name: string;
  username: string;
  role: string | null;
  company_name: string | null;
  country: string | null;
  skills: string[];
  looking_for: string[];
  bio: string | null;
  linkedin_url: string | null;
  availability: string | null;
  seeking_cofounder: boolean;
  interests: string[];
}

function getProfileCompleteness(profile: ProfileData): { percentage: number; missing: string[] } {
  const missing: string[] = [];

  if (!profile.bio) missing.push('Bio');
  if (!profile.skills || profile.skills.length === 0) missing.push('Skills');
  if (!profile.availability) missing.push('Availability');
  if (!profile.interests || profile.interests.length === 0) missing.push('Interests');
  if (!profile.looking_for || profile.looking_for.length === 0) missing.push('Looking for');

  const total = 5;
  const filled = total - missing.length;
  return { percentage: Math.round((filled / total) * 100), missing };
}

export default function ProfilePage() {
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ideasLoading, setIdeasLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch {
        // Profile fetch failed silently
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchIdeas() {
      try {
        const res = await fetch('/api/ideas/user');
        if (res.ok) {
          const data = await res.json();
          setIdeas(data || []);
        }
      } catch {
        // Ideas fetch failed silently
      } finally {
        setIdeasLoading(false);
      }
    }
    fetchIdeas();
  }, []);

  if (isLoading) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='w-6 h-6 animate-spin text-white/40' />
        </div>
      </div>
    );
  }

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username
    : user?.fullName || user?.firstName || 'User';

  const username = profile?.username || user?.username || '';
  const completeness = profile
    ? getProfileCompleteness(profile)
    : { percentage: 0, missing: ['Bio', 'Skills', 'Availability', 'Interests', 'Looking for'] };
  const isIncomplete = completeness.percentage < 100;

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      {/* Profile Completeness Banner */}
      {isIncomplete && (
        <div className='mb-6 p-4 rounded-lg bg-primary-500/10 border border-primary-500/20'>
          <div className='flex items-start gap-3'>
            <AlertCircle size={18} className='text-primary-400 shrink-0 mt-0.5' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white'>Complete your profile</p>
              <p className='text-xs text-white/50 mt-0.5'>
                Your profile is {completeness.percentage}% complete. Add your{' '}
                {completeness.missing
                  .slice(0, 3)
                  .map((m) => m.toLowerCase())
                  .join(', ')}
                {completeness.missing.length > 3 && ` and ${completeness.missing.length - 3} more`} to improve
                co-founder matching.
              </p>
              {/* Progress bar */}
              <div className='mt-3 h-1.5 rounded-full bg-white/10 overflow-hidden'>
                <div
                  className='h-full rounded-full bg-primary-500 transition-all duration-500'
                  style={{ width: `${completeness.percentage}%` }}
                />
              </div>
            </div>
            <Link
              href='/profile/settings'
              className='px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shrink-0'
            >
              Complete
            </Link>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className='bg-surface-variant rounded-lg p-5 sm:p-6 mb-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            {/* Avatar */}
            <div className='w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 overflow-hidden'>
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={displayName}
                  width={48}
                  height={48}
                  className='w-full h-full object-cover'
                />
              ) : (
                <span className='text-lg font-bold text-white/60'>{displayName[0]?.toUpperCase() || '?'}</span>
              )}
            </div>

            {/* Name & Username */}
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-base font-bold text-white'>{displayName}</h1>
                {profile?.seeking_cofounder && (
                  <span className='px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-500/15 text-green-400 flex items-center gap-0.5'>
                    <Users size={10} />
                    Seeking
                  </span>
                )}
              </div>
              <div className='flex items-center gap-2'>
                {username && <span className='text-xs text-white/50'>@{username}</span>}
                {profile?.role && (
                  <>
                    <span className='text-white/20'>·</span>
                    <span className='text-xs text-white/40'>{profile.role}</span>
                  </>
                )}
                {profile?.country && (
                  <>
                    <span className='text-white/20'>·</span>
                    <span className='flex items-center gap-0.5 text-xs text-white/40'>
                      <MapPin size={10} />
                      {profile.country}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <Link
            href='/profile/settings'
            className='p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors'
          >
            <Settings size={16} />
          </Link>
        </div>

        {/* Bio */}
        {profile?.bio ? (
          <p className='text-sm text-white/60 leading-relaxed mb-4'>{profile.bio}</p>
        ) : (
          <p className='text-sm text-white/25 italic mb-4'>No bio yet</p>
        )}

        {/* Inline badges */}
        <div className='flex flex-wrap items-center gap-1.5 mb-4'>
          {profile?.availability && (
            <span className='flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-white/5 text-white/40'>
              <Clock size={10} />
              {profile.availability.charAt(0).toUpperCase() + profile.availability.slice(1)}
            </span>
          )}
          {profile?.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors'
            >
              <Linkedin size={10} />
              LinkedIn
            </a>
          )}
        </div>

        {/* Skills */}
        {profile?.skills && profile.skills.length > 0 && (
          <div className='mb-3'>
            <p className='text-[11px] font-medium text-white/30 mb-1.5'>Skills</p>
            <div className='flex flex-wrap gap-1'>
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-500/15 text-primary-400'
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <div>
            <p className='text-[11px] font-medium text-white/30 mb-1.5'>Interests</p>
            <div className='flex flex-wrap gap-1'>
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className='px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent-500/15 text-accent-400'
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ideas Section */}
      <div>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-lg font-semibold text-white'>Your Ideas</h2>
          <Link
            href='/ideas/new'
            className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors'
          >
            <Lightbulb size={14} />
            New Idea
          </Link>
        </div>

        {ideasLoading ? (
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className='p-5 bg-surface-variant rounded-lg animate-pulse'>
                <div className='h-5 bg-white/10 rounded w-2/3 mb-3' />
                <div className='h-3 bg-white/10 rounded w-full mb-2' />
                <div className='h-3 bg-white/10 rounded w-1/2' />
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className='text-center py-12 bg-surface-variant rounded-lg'>
            <Lightbulb size={32} className='mx-auto text-white/20 mb-3' />
            <p className='text-sm text-white/40 mb-4'>You haven&apos;t submitted any ideas yet.</p>
            <Link
              href='/ideas/new'
              className='inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium transition-colors'
            >
              Submit Your First Idea
            </Link>
          </div>
        ) : (
          <div className='flex flex-col gap-3'>
            {ideas.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`}>
                <div className='p-5 bg-surface-variant rounded-lg hover:bg-surface-variant/80 transition-colors cursor-pointer'>
                  <div className='flex items-start justify-between gap-3 mb-2'>
                    <h3 className='text-sm font-semibold text-white line-clamp-1'>{idea.title}</h3>
                    <div className='flex items-center gap-1.5 shrink-0'>
                      {idea.looking_for_cofounder && (
                        <span className='px-2 py-0.5 rounded text-[10px] font-medium bg-green-500/15 text-green-400 flex items-center gap-1'>
                          <Users size={10} />
                          Co-founder
                        </span>
                      )}
                      {idea.category && (
                        <span className='px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-white/50'>
                          {idea.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className='text-xs text-white/50 line-clamp-2 mb-3'>{idea.problem}</p>
                  <div className='flex items-center gap-3 text-[10px] text-white/30'>
                    <span>{idea.stage}</span>
                    <span>
                      {new Date(idea.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>{idea.vote_count || 0} votes</span>
                    {(idea.market_analysis || idea.competitors || idea.difficulty) && (
                      <span className='flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-medium'>
                        <Sparkles size={10} />
                        AI Analysis Generated
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
