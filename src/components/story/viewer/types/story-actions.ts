
export interface StoryViewer {
  id: string;
  username: string;
  avatar_url: string;
  action_type: string;
  created_at: string;
}

export interface PostMediaAction {
  id: string;
  action_type: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
}

export interface StoryStats {
  views: number;
  screenshots: number;
  shares: number;
  comments: number;
}
