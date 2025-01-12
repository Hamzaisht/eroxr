export type Story = {
  id: string;
  creator_id: string;
  media_url: string | null;
  video_url: string | null;
  duration: number | null;
  created_at: string;
  expires_at: string;
  is_active: boolean | null;
  screenshot_disabled: boolean | null;
  creator: {
    username: string | null;
    avatar_url: string | null;
  };
};

export type StoryInsert = {
  creator_id: string;
  media_url?: string;
  video_url?: string;
  duration?: number;
  expires_at: string;
  id: string;
  is_active?: boolean;
  screenshot_disabled?: boolean;
};