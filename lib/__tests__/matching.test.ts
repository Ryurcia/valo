import { describe, it, expect } from 'vitest';
import { calculateIdeaMatch } from '../matching';

const baseProfile = {
  skills: ['React', 'TypeScript', 'Node.js'],
  looking_for: ['CTO', 'Backend Developer'],
  availability: 'Full-time',
  experience_level: 'Senior',
};

const baseRequirements = {
  cofounder_skills_needed: ['React', 'TypeScript', 'Python'],
  cofounder_roles_needed: ['CTO', 'Frontend Developer'],
  cofounder_experience_level: 'Senior',
  cofounder_time_commitment: 'Full-time',
};

describe('calculateIdeaMatch', () => {
  // ─── Null / empty profile cases ───

  it('returns null when user has no skills and no looking_for', () => {
    const profile = { skills: [], looking_for: [], availability: null, experience_level: null };
    expect(calculateIdeaMatch(profile, baseRequirements)).toBeNull();
  });

  it('returns a result when user has skills but empty looking_for', () => {
    const profile = { ...baseProfile, looking_for: [] };
    const result = calculateIdeaMatch(profile, baseRequirements);
    expect(result).not.toBeNull();
  });

  it('returns a result when user has looking_for but empty skills', () => {
    const profile = { ...baseProfile, skills: [], looking_for: ['CTO'] };
    const result = calculateIdeaMatch(profile, baseRequirements);
    expect(result).not.toBeNull();
  });

  // ─── Skills matching (50% weight) ───

  it('scores 50% for skills when all needed skills are matched', () => {
    const profile = { ...baseProfile, skills: ['React', 'TypeScript', 'Python'], looking_for: [] };
    const requirements = {
      ...baseRequirements,
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    // 3/3 skills = 50%, no roles = 0%, no experience/availability requirements = +20%
    expect(result.percentage).toBe(70);
    expect(result.matched_skills).toEqual(['React', 'TypeScript', 'Python']);
  });

  it('scores partial skills when some are matched', () => {
    const profile = { ...baseProfile, skills: ['React'], looking_for: [] };
    const requirements = {
      ...baseRequirements,
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    // 1/3 skills = ~17%, +20% for no requirements on experience/availability
    expect(result.percentage).toBe(37);
    expect(result.matched_skills).toEqual(['React']);
  });

  it('scores 0% for skills when none match', () => {
    const profile = { ...baseProfile, skills: ['Go', 'Rust'], looking_for: [] };
    const requirements = {
      ...baseRequirements,
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    // 0/3 skills = 0%, +20% for no requirements
    expect(result.percentage).toBe(20);
    expect(result.matched_skills).toEqual([]);
  });

  it('gives 0 skill score when idea has no skills needed', () => {
    const requirements = {
      ...baseRequirements,
      cofounder_skills_needed: [],
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    // 0 skill score + 0 role score + 20% bonus = 20%
    expect(result.percentage).toBe(20);
  });

  it('matches skills case-insensitively', () => {
    const profile = { ...baseProfile, skills: ['react', 'typescript'], looking_for: [] };
    const requirements = {
      ...baseRequirements,
      cofounder_skills_needed: ['React', 'TypeScript'],
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.matched_skills).toEqual(['React', 'TypeScript']);
  });

  // ─── Roles matching (30% weight) ───

  it('scores 30% for roles when all needed roles match looking_for', () => {
    const profile = { ...baseProfile, skills: [], looking_for: ['CTO', 'Frontend Developer'] };
    const requirements = {
      ...baseRequirements,
      cofounder_skills_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    // 0 skills + 2/2 roles = 30% + 20% bonus = 50%
    expect(result.percentage).toBe(50);
    expect(result.matched_roles).toEqual(['CTO', 'Frontend Developer']);
  });

  it('matches roles via skill substring overlap', () => {
    const profile = { ...baseProfile, skills: ['Frontend'], looking_for: [] };
    const requirements = {
      ...baseRequirements,
      cofounder_skills_needed: [],
      cofounder_roles_needed: ['Frontend Developer'],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.matched_roles).toEqual(['Frontend Developer']);
  });

  it('gives 0 role score when idea has no roles needed', () => {
    const requirements = {
      ...baseRequirements,
      cofounder_skills_needed: [],
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    expect(result.matched_roles).toEqual([]);
  });

  // ─── Availability matching (10% weight) ───

  it('awards 10% when availability matches exactly', () => {
    const profile = { ...baseProfile, skills: [], looking_for: ['x'], availability: 'Part-time' };
    const requirements = {
      cofounder_skills_needed: [],
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: 'Part-time',
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.availability_match).toBe(true);
  });

  it('awards 10% when time commitment is "Flexible"', () => {
    const profile = { ...baseProfile, skills: [], looking_for: ['x'], availability: 'Part-time' };
    const requirements = {
      cofounder_skills_needed: [],
      cofounder_roles_needed: [],
      cofounder_experience_level: null,
      cofounder_time_commitment: 'Flexible',
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.availability_match).toBe(true);
  });

  it('awards 10% when no time commitment is required', () => {
    const requirements = {
      ...baseRequirements,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    expect(result.availability_match).toBe(true);
  });

  it('does not award availability when mismatch', () => {
    const profile = { ...baseProfile, availability: 'Part-time' };
    const requirements = {
      ...baseRequirements,
      cofounder_time_commitment: 'Full-time',
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.availability_match).toBe(false);
  });

  it('does not award availability when user has no availability set', () => {
    const profile = { ...baseProfile, availability: null };
    const requirements = {
      ...baseRequirements,
      cofounder_time_commitment: 'Full-time',
    };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.availability_match).toBe(false);
  });

  // ─── Experience matching (10% weight) ───

  it('awards 10% when experience level matches exactly', () => {
    const result = calculateIdeaMatch(baseProfile, baseRequirements)!;
    expect(result.experience_match).toBe(true);
  });

  it('awards 10% when required experience is "Any"', () => {
    const requirements = { ...baseRequirements, cofounder_experience_level: 'Any' };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    expect(result.experience_match).toBe(true);
  });

  it('awards 10% when no experience level is required', () => {
    const requirements = { ...baseRequirements, cofounder_experience_level: null };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    expect(result.experience_match).toBe(true);
  });

  it('does not award experience when mismatch', () => {
    const profile = { ...baseProfile, experience_level: 'Junior' };
    const requirements = { ...baseRequirements, cofounder_experience_level: 'Senior' };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.experience_match).toBe(false);
  });

  it('does not award experience when user has no level set', () => {
    const profile = { ...baseProfile, experience_level: null };
    const requirements = { ...baseRequirements, cofounder_experience_level: 'Senior' };
    const result = calculateIdeaMatch(profile, requirements)!;
    expect(result.experience_match).toBe(false);
  });

  // ─── Full scoring ───

  it('calculates 100% for a perfect match', () => {
    const profile = {
      skills: ['React', 'TypeScript', 'Python'],
      looking_for: ['CTO', 'Frontend Developer'],
      availability: 'Full-time',
      experience_level: 'Senior',
    };
    const result = calculateIdeaMatch(profile, baseRequirements)!;
    expect(result.percentage).toBe(100);
    expect(result.matched_skills).toEqual(['React', 'TypeScript', 'Python']);
    expect(result.matched_roles).toEqual(['CTO', 'Frontend Developer']);
    expect(result.availability_match).toBe(true);
    expect(result.experience_match).toBe(true);
  });

  it('calculates 0% when nothing matches and all requirements are set', () => {
    const profile = {
      skills: ['Go'],
      looking_for: ['Designer'],
      availability: 'Part-time',
      experience_level: 'Junior',
    };
    const result = calculateIdeaMatch(profile, baseRequirements)!;
    expect(result.percentage).toBe(0);
    expect(result.matched_skills).toEqual([]);
    expect(result.matched_roles).toEqual([]);
    expect(result.availability_match).toBe(false);
    expect(result.experience_match).toBe(false);
  });

  it('never exceeds 100%', () => {
    const profile = {
      skills: ['React', 'TypeScript', 'Python', 'Node.js', 'Go'],
      looking_for: ['CTO', 'Frontend Developer', 'Backend Developer'],
      availability: 'Full-time',
      experience_level: 'Senior',
    };
    const result = calculateIdeaMatch(profile, baseRequirements)!;
    expect(result.percentage).toBeLessThanOrEqual(100);
  });

  // ─── Null requirements fields ───

  it('handles null cofounder_skills_needed', () => {
    const requirements = { ...baseRequirements, cofounder_skills_needed: null };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    expect(result).not.toBeNull();
    expect(result.matched_skills).toEqual([]);
  });

  it('handles null cofounder_roles_needed', () => {
    const requirements = { ...baseRequirements, cofounder_roles_needed: null };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    expect(result).not.toBeNull();
    expect(result.matched_roles).toEqual([]);
  });

  it('handles all null requirements gracefully (20% from bonuses)', () => {
    const requirements = {
      cofounder_skills_needed: null,
      cofounder_roles_needed: null,
      cofounder_experience_level: null,
      cofounder_time_commitment: null,
    };
    const result = calculateIdeaMatch(baseProfile, requirements)!;
    // 0 skills + 0 roles + 10% availability + 10% experience = 20%
    expect(result.percentage).toBe(20);
    expect(result.availability_match).toBe(true);
    expect(result.experience_match).toBe(true);
  });
});
