'use client';

import { useState, useEffect } from 'react';
import { COFOUNDER_SKILLS, COFOUNDER_ROLES, IDEA_TAGS, EXPERIENCE_LEVELS } from '@/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { FEED_QUERY_KEY } from '@/hooks/useFeedQuery';

const AVAILABILITY_OPTIONS = ['full-time', 'part-time', 'weekends', 'exploring'] as const;

interface ProfileData {
  skills: string[];
  looking_for: string[];
  bio: string;
  linkedin_url: string;
  availability: string;
  experience_level: string;
  seeking_cofounder: boolean;
  interests: string[];
}

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const [profile, setProfile] = useState<ProfileData>({
    skills: [],
    looking_for: [],
    bio: '',
    linkedin_url: '',
    availability: '',
    experience_level: '',
    seeking_cofounder: false,
    interests: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile({
          skills: data.skills || [],
          looking_for: data.looking_for || [],
          bio: data.bio || '',
          linkedin_url: data.linkedin_url || '',
          availability: data.availability || '',
          experience_level: data.experience_level || '',
          seeking_cofounder: data.seeking_cofounder || false,
          interests: data.interests || [],
        });
      } catch {
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSkillToggle = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));
  };

  const handleRoleToggle = (role: string) => {
    setProfile((prev) => ({
      ...prev,
      looking_for: prev.looking_for.includes(role)
        ? prev.looking_for.filter((r) => r !== role)
        : [...prev.looking_for, role],
    }));
  };

  const handleInterestToggle = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }

      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: FEED_QUERY_KEY });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    'w-full px-0 py-3 bg-transparent border-0 border-b border-border/60 text-foreground placeholder:text-white/30 focus:ring-0 focus:border-primary-500 focus:outline-none transition-colors resize-none';

  if (isLoading) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <div className='flex items-center justify-center py-20'>
          <Loader2 className='w-6 h-6 animate-spin text-white/40' />
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <Link
        href='/profile'
        className='inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors duration-100'
      >
        <ArrowLeft className='w-4 h-4' />
        Back to profile
      </Link>

      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-white mb-2'>Profile Settings</h1>
        <p className='text-sm text-white/50'>
          Update your profile to improve co-founder matching and collaboration requests.
        </p>
      </div>

      {error && <div className='py-3 px-4 rounded-lg bg-error-500/10 text-error-500 text-sm mb-6'>{error}</div>}
      {success && (
        <div className='py-3 px-4 rounded-lg bg-green-500/10 text-green-400 text-sm mb-6'>
          Profile saved successfully.
        </div>
      )}

      <div className='bg-surface-variant rounded-lg p-6 sm:p-8 space-y-8'>
        {/* Seeking Co-founder Toggle */}
        <div className='flex items-center justify-between gap-4'>
          <div>
            <p className='text-sm font-medium text-white/80'>Seeking Co-founder</p>
            <p className='text-xs text-white/40 mt-0.5'>Show your profile in co-founder matching results</p>
          </div>
          <button
            type='button'
            role='switch'
            aria-checked={profile.seeking_cofounder}
            onClick={() => setProfile((prev) => ({ ...prev, seeking_cofounder: !prev.seeking_cofounder }))}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background ${
              profile.seeking_cofounder ? 'bg-primary-500' : 'bg-white/20'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform ${
                profile.seeking_cofounder ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor='bio' className='block text-sm font-medium text-white/60 mb-1.5'>
            Bio
          </label>
          <textarea
            id='bio'
            value={profile.bio}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
            rows={3}
            placeholder='A short elevator pitch about yourself and what you bring to the table'
            className={inputClass}
          />
        </div>

        {/* Skills */}
        <div>
          <label className='block text-sm font-medium text-white/60 mb-3'>Your Skills</label>
          <div className='flex flex-wrap gap-2'>
            {COFOUNDER_SKILLS.map((skill) => {
              const isSelected = profile.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type='button'
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isSelected
                      ? 'bg-primary-500/20 border-primary-500 text-primary-400'
                      : 'bg-transparent border-border/60 text-white/40 hover:border-white/40 hover:text-white/60'
                  }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Looking For (Roles) */}
        <div>
          <label className='block text-sm font-medium text-white/60 mb-3'>Looking For</label>
          <div className='flex flex-wrap gap-2'>
            {COFOUNDER_ROLES.map((role) => {
              const isSelected = profile.looking_for.includes(role);
              return (
                <button
                  key={role}
                  type='button'
                  onClick={() => handleRoleToggle(role)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isSelected
                      ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                      : 'bg-transparent border-border/60 text-white/40 hover:border-white/40 hover:text-white/60'
                  }`}
                >
                  {role}
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className='block text-sm font-medium text-white/60 mb-3'>Interests</label>
          <div className='flex flex-wrap gap-2'>
            {IDEA_TAGS.map((interest) => {
              const isSelected = profile.interests.includes(interest);
              return (
                <button
                  key={interest}
                  type='button'
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    isSelected
                      ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                      : 'bg-transparent border-border/60 text-white/40 hover:border-white/40 hover:text-white/60'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label htmlFor='availability' className='block text-sm font-medium text-white/60 mb-1.5'>
            Availability
          </label>
          <select
            id='availability'
            value={profile.availability}
            onChange={(e) => setProfile((prev) => ({ ...prev, availability: e.target.value }))}
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            <option value='' className='bg-surface text-white/30'>
              Select availability
            </option>
            {AVAILABILITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className='bg-surface text-white'>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Level */}
        <div>
          <label htmlFor='experience_level' className='block text-sm font-medium text-white/60 mb-1.5'>
            Experience Level
          </label>
          <select
            id='experience_level'
            value={profile.experience_level}
            onChange={(e) => setProfile((prev) => ({ ...prev, experience_level: e.target.value }))}
            className={`${inputClass} cursor-pointer appearance-none`}
          >
            <option value='' className='bg-surface text-white/30'>
              Select experience level
            </option>
            {EXPERIENCE_LEVELS.filter((lvl) => lvl !== 'Any').map((lvl) => (
              <option key={lvl} value={lvl} className='bg-surface text-white'>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* LinkedIn URL */}
        <div>
          <label htmlFor='linkedin' className='block text-sm font-medium text-white/60 mb-1.5'>
            LinkedIn URL <span className='text-white/30'>(optional)</span>
          </label>
          <input
            type='url'
            id='linkedin'
            value={profile.linkedin_url}
            onChange={(e) => setProfile((prev) => ({ ...prev, linkedin_url: e.target.value }))}
            placeholder='https://linkedin.com/in/yourprofile'
            className={inputClass}
          />
        </div>

        {/* Save Button */}
        <div className='pt-2'>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className='w-full py-4 px-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2'
          >
            {isSaving ? (
              <>
                <Loader2 className='w-5 h-5 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='w-5 h-5' />
                Save Profile
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
