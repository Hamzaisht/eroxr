import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
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
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage } = useFeedQuery(undefined, activeTab);
  const { handleLike, handleDelete } = usePostActions();
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
      </div>
    );
  }

  const posts = data?.pages.flatMap(page => page) ?? [];

  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="glass-effect p-4"
      >
        <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>
      
      {session && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect"
        >
          <CreatePostArea 
            onOpenCreatePost={onOpenCreatePost}
            onFileSelect={onFileSelect}
            onOpenGoLive={onOpenGoLive}
            isPayingCustomer={isPayingCustomer}
          />
        </motion.div>
      )}
      
      <motion.div 
        className="space-y-6 infinite-scroll-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {posts.length === 0 ? (
          <div className="glass-effect p-8">
            <EmptyFeed />
          </div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card hover-scale"
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
        
        {hasNextPage && (
          <div ref={ref} className="h-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}
      </motion.div>
    </div>
  );
};