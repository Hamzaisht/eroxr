
import { Database } from "@/integrations/supabase/types/database.types";

export type StoryData = Database["public"]["Tables"]["stories"]["Row"] & {
  profiles?: {
    username?: string | null;
    avatar_url?: string | null;
  } | null;
};

export interface Story {
  id: string;
  creator_id: string;
  media_url: string | null;
  video_url: string | null;
  content_type: string;
  created_at: string;
  expires_at: string;
  is_active: boolean;
  creator: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}
