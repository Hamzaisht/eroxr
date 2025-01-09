import { useState } from "react";
import { motion } from "framer-motion";
import { FeedHeader } from "./FeedHeader";
import { CreatePostArea } from "./CreatePostArea";
import { PostCard } from "../feed/PostCard";
import { usePostActions } from "../feed/usePostActions";
import { useFeedQuery } from "../feed/useFeedQuery";
import { LoadingSkeleton } from "../feed/LoadingSkeleton";
import { EmptyFeed } from "../feed/EmptyFeed";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

type TabValue = 'feed' | 'popular' | 'recent' | 'shorts';

interface MainFeedProps {
  isPayingCustomer: boolean | null;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  onOpenGoLive: () => void;
}

export const MainFeed = ({
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: MainFeedProps) => {
  const [activeTab, setActiveTab] = useState<TabValue>('feed');
  const { data, isLoading, fetchNextPage } = useFeedQuery(undefined, activeTab);
  const { handleLike, handleDelete } = usePostActions();
  const session = useSession();
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
      </div>
    );
  }

  const posts = data?.pages.flatMap(page => page) ?? [];

  const handleComment = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment on posts",
        variant: "destructive",
      });
      return;
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />
      
      {session && (
        <CreatePostArea 
          onOpenCreatePost={onOpenCreatePost}
          onFileSelect={onFileSelect}
          onOpenGoLive={onOpenGoLive}
          isPayingCustomer={isPayingCustomer}
        />
      )}
      
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {posts.length === 0 ? (
          <EmptyFeed />
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PostCard
                post={post}
                onLike={handleLike}
                onDelete={handleDelete}
                onComment={handleComment}
                currentUserId={session?.user?.id}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};