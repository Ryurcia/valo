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
  market_analysis: MarketAnalysis | null;
  competitors: CompetitiveAnalysis | null;
  difficulty: string | null;
  vote_count: number;
  upvotes: number;
  downvotes: number;
  user_vote: -1 | 0 | 1;
  created_at: string;
  author?: IdeaAuthor | null;
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
