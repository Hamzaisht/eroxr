import { Post as PostType } from "@/integrations/supabase/types/post";

export interface MainFeedProps {
  userId?: string;
  isPayingCustomer: boolean | null;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  onOpenGoLive: () => void;
}

export interface FeedPost extends PostType {
  has_liked: boolean;
  creator: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}