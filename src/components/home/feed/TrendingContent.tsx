import { Post } from "@/components/feed/Post";
import type { FeedPost } from "../types";
import { useSession } from "@supabase/auth-helpers-react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface TrendingContentProps {
  data: any;
}

export const TrendingContent = ({ data }: TrendingContentProps) => {
  const session = useSession();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
      {data?.pages.map((page: any, i: number) => (
        <div key={i} className="space-y-4">
          {page
            .filter((post: FeedPost) => post.likes_count > 50)
            .map((post: FeedPost) => (
              <Post
                key={post.id}
                post={post}
                creator={post.creator}
                currentUser={session?.user || null}
              />
            ))}
        </div>
      ))}
    </div>
  );
};