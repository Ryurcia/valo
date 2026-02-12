export const COFOUNDER_SKILLS = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Mobile (iOS)',
  'Mobile (Android)',
  'AI/ML',
  'Data Science',
  'DevOps',
  'UI/UX Design',
  'Product Management',
  'Marketing',
  'Sales',
  'Growth Hacking',
  'Finance',
  'Legal',
  'Operations',
  'Content Writing',
  'Community Management',
] as const;

export const COFOUNDER_ROLES = [
  'Technical Co-Founder',
  'Business Co-Founder',
  'Design Co-Founder',
  'Marketing Co-Founder',
  'Operations Co-Founder',
] as const;

export const EXPERIENCE_LEVELS = ['Any', 'Junior', 'Mid-Level', 'Senior', 'Lead/Principal'] as const;

export const TIME_COMMITMENTS = ['Full-time', 'Part-time', 'Weekends', 'Flexible'] as const;

export const IDEA_TAGS = [
  'AI/ML',
  'SaaS',
  'Mobile App',
  'Marketplace',
  'API/Platform',
  'Developer Tools',
  'Hardware',
  'Fintech',
  'HealthTech',
  'EdTech',
  'E-commerce',
  'Real Estate',
  'Entertainment',
  'Social',
  'Sustainability',
  'Logistics',
  'Food & Beverage',
  'Travel',
  'Crypto/Web3',
] as const;

export const IDEA_CATEGORIES = [
  'SaaS',
  'Mobile App',
  'Marketplace',
  'Hardware',
  'API/Platform',
  'AI/ML',
  'Developer Tools',
  'Fintech',
  'HealthTech',
  'EdTech',
  'E-commerce',
  'Real Estate',
  'Entertainment',
  'Social',
] as const;

export const IDEA_STAGES = ['Concept', 'Validation', 'MVP', 'Beta', 'Launched', 'Scaling'] as const;

export interface IdeaAuthor {
  first_name: string;
  last_name: string;
  username: string;
  image_url?: string | null;
}

export interface MarketAnalysis {
  tam: string;
  cagr: string;
  market_growth: string;
  market_size: string;
}

export interface CompetitorEntry {
  name: string;
  market_share: string;
  revenue: string;
}

export interface CompetitiveAnalysis {
  competitors: CompetitorEntry[];
  your_estimated_share: string;
  market_opportunity: string;
}

export interface Idea {
  id: string;
  user_id: string;
  title: string;
  problem: string;
  solution: string;
  audience: string;
  tags: string[];
  category: string;
  stage: string;
  looking_for_cofounder: boolean;
  cofounder_skills_needed: string[];
  cofounder_roles_needed: string[];
  cofounder_experience_level: string | null;
  cofounder_time_commitment: string | null;
  market_analysis: MarketAnalysis | null;
  competitors: CompetitiveAnalysis | null;
  difficulty: string | null;
  vote_count: number;
  upvotes: number;
  downvotes: number;
  user_vote: -1 | 0 | 1;
  created_at: string;
  author?: IdeaAuthor | null;
  match_percentage?: number | null;
  connection_status?: 'pending' | 'accepted' | 'declined' | null;
}

export interface IdeaFormData {
  title: string;
  problem: string;
  solution: string;
  audience: string;
  tags: string[];
  category: string;
  stage: string;
  looking_for_cofounder: boolean;
  cofounder_skills_needed: string[];
  cofounder_roles_needed: string[];
  cofounder_experience_level: string;
  cofounder_time_commitment: string;
}

export interface MarketInsights {
  market_analysis: MarketAnalysis | null;
  competitors: CompetitiveAnalysis | null;
  difficulty: string | null;
}

export interface Comment {
  id: string;
  idea_id: string;
  user_id: string;
  user_name: string;
  user_image: string | null;
  content: string;
  created_at: string;
}

export interface Vote {
  id: string;
  idea_id: string;
  user_id: string;
  vote_type: -1 | 1;
  created_at: string;
}

export type ConnectionStatus = 'pending' | 'accepted' | 'declined';

export interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  idea_id: string | null;
  status: ConnectionStatus;
  message: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'connection_accepted' | 'connection_declined' | 'connection_request';

export interface EnrichedConnection extends Connection {
  requester_name?: string;
  requester_username?: string;
  idea_title?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  connection_id: string | null;
  idea_id: string | null;
  actor_name: string;
  idea_title: string | null;
  message: string | null;
  read: boolean;
  seen_at: string | null;
  created_at: string;
}

export interface UserProfile {
  clerk_id: string;
  first_name: string;
  last_name: string;
  username: string;
  role: string | null;
  skills: string[];
  looking_for: string[];
  bio: string | null;
  linkedin_url: string | null;
  availability: string | null;
  seeking_cofounder: boolean;
  interests: string[];
  country: string | null;
  image_url?: string | null;
}
