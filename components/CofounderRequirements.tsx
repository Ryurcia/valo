import { Users, Briefcase, Clock, Award } from 'lucide-react';

interface CofounderRequirementsProps {
  skillsNeeded: string[];
  rolesNeeded: string[];
  experienceLevel: string | null;
  timeCommitment: string | null;
}

export default function CofounderRequirements({
  skillsNeeded,
  rolesNeeded,
  experienceLevel,
  timeCommitment,
}: CofounderRequirementsProps) {
  const hasContent =
    skillsNeeded.length > 0 || rolesNeeded.length > 0 || experienceLevel || timeCommitment;

  if (!hasContent) return null;

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Users size={16} className='text-green-400' />
        <h3 className='text-sm font-medium text-white'>Co-Founder Requirements</h3>
      </div>

      {skillsNeeded.length > 0 && (
        <div>
          <p className='text-xs text-white/40 mb-2 flex items-center gap-1.5'>
            <Briefcase size={12} />
            Skills Needed
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {skillsNeeded.map((skill) => (
              <span
                key={skill}
                className='px-2.5 py-1 rounded-full text-xs font-medium bg-primary-500/15 text-primary-400'
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {rolesNeeded.length > 0 && (
        <div>
          <p className='text-xs text-white/40 mb-2 flex items-center gap-1.5'>
            <Users size={12} />
            Roles Needed
          </p>
          <div className='flex flex-wrap gap-1.5'>
            {rolesNeeded.map((role) => (
              <span
                key={role}
                className='px-2.5 py-1 rounded-full text-xs font-medium bg-accent-500/15 text-accent-400'
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className='flex flex-wrap gap-4'>
        {experienceLevel && (
          <div>
            <p className='text-xs text-white/40 mb-1 flex items-center gap-1.5'>
              <Award size={12} />
              Experience
            </p>
            <span className='text-sm text-white/70'>{experienceLevel}</span>
          </div>
        )}

        {timeCommitment && (
          <div>
            <p className='text-xs text-white/40 mb-1 flex items-center gap-1.5'>
              <Clock size={12} />
              Commitment
            </p>
            <span className='text-sm text-white/70'>{timeCommitment}</span>
          </div>
        )}
      </div>
    </div>
  );
}
