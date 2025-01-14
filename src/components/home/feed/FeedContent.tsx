import { Post } from "@/components/feed/Post";
import { Loader2, AlertTriangle } from "lucide-react";
import type { FeedPost } from "../types";
import { useSession } from "@supabase/auth-helpers-react";

interface FeedContentProps {
  data: any;
  isLoading: boolean;
  isError: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  observerRef: (node?: Element | null) => void;
}

export const FeedContent = ({
  data,
  isLoading,
  isError,
  isFetchingNextPage,
  hasNextPage,
  observerRef,
}: FeedContentProps) => {
  const session = useSession();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-red-500">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p>Error loading feed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page: any, i: number) => (
        <div key={i} className="space-y-4">
          {page.map((post: FeedPost) => (
            <Post
              key={post.id}
              post={post}
              creator={post.creator}
              currentUser={session?.user || null}
            />
          ))}
        </div>
      ))}
      <div ref={observerRef} className="h-10">
        {isFetchingNextPage && hasNextPage && (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-luxury-primary" />
          </div>
        )}
      </div>
    </div>
  );
};