
import { Creator } from './profile';

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
  content_type?: string;
  media_type?: string; // Added media_type field
  creator: Creator;
};
