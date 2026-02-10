export interface MatchResult {
  percentage: number;
  matched_skills: string[];
  matched_roles: string[];
  availability_match: boolean;
  experience_match: boolean;
}

interface UserProfileForMatch {
  skills: string[];
  looking_for: string[];
  availability: string | null;
  experience_level: string | null;
}

interface IdeaRequirementsForMatch {
  cofounder_skills_needed: string[] | null;
  cofounder_roles_needed: string[] | null;
  cofounder_experience_level: string | null;
  cofounder_time_commitment: string | null;
}

export function calculateIdeaMatch(
  userProfile: UserProfileForMatch,
  ideaRequirements: IdeaRequirementsForMatch
): MatchResult | null {
  // If user has no profile data, return null (not 0%)
  if (!userProfile.skills?.length && !userProfile.looking_for?.length) {
    return null;
  }

  const skillsNeeded = ideaRequirements.cofounder_skills_needed || [];
  const rolesNeeded = ideaRequirements.cofounder_roles_needed || [];

  // Skills match: 50% weight — what % of needed skills does the user have?
  const matchedSkills = skillsNeeded.filter((s) =>
    userProfile.skills.some((us) => us.toLowerCase() === s.toLowerCase())
  );
  const skillScore = skillsNeeded.length > 0 ? matchedSkills.length / skillsNeeded.length : 0;

  // Roles match: 30% weight — does user's looking_for or skills overlap with needed roles?
  const matchedRoles = rolesNeeded.filter(
    (r) =>
      userProfile.looking_for.some((lf) => lf.toLowerCase() === r.toLowerCase()) ||
      userProfile.skills.some((s) => r.toLowerCase().includes(s.toLowerCase()))
  );
  const roleScore = rolesNeeded.length > 0 ? Math.min(matchedRoles.length / rolesNeeded.length, 1) : 0;

  // Time commitment match: 10% weight
  const availabilityMatch =
    !ideaRequirements.cofounder_time_commitment ||
    ideaRequirements.cofounder_time_commitment.toLowerCase() === 'flexible' ||
    (userProfile.availability || '').toLowerCase() === ideaRequirements.cofounder_time_commitment.toLowerCase();

  // Experience match: 10% weight
  const experienceMatch =
    !ideaRequirements.cofounder_experience_level ||
    ideaRequirements.cofounder_experience_level.toLowerCase() === 'any' ||
    (userProfile.experience_level || '').toLowerCase() === ideaRequirements.cofounder_experience_level.toLowerCase();

  const percentage = Math.round(
    skillScore * 50 + roleScore * 30 + (availabilityMatch ? 10 : 0) + (experienceMatch ? 10 : 0)
  );

  return {
    percentage: Math.min(percentage, 100),
    matched_skills: matchedSkills,
    matched_roles: matchedRoles,
    availability_match: availabilityMatch,
    experience_match: experienceMatch,
  };
}
