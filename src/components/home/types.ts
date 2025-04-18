
import { Post as PostType } from "@/integrations/supabase/types/post";
import { Creator, BasicProfile } from "@/integrations/supabase/types/profile";

export interface MainFeedProps {
  userId?: string;
  isPayingCustomer: boolean | null;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  onOpenGoLive: () => void;
}

export interface FeedPost extends PostType {
  has_liked: boolean;
  creator: BasicProfile | Creator;
}
