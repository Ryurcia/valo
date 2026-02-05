export interface Idea {
  id: string;
  user_id: string;
  title: string;
  problem: string;
  solution: string;
  audience: string;
  market_size: string | null;
  market_growth: string | null;
  competitors: string | null;
  difficulty: string | null;
  vote_count: number;
  created_at: string;
}

export interface IdeaFormData {
  title: string;
  problem: string;
  solution: string;
  audience: string;
}

export interface MarketInsights {
  market_size: string;
  market_growth: string;
  competitors: string;
  difficulty: string;
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
