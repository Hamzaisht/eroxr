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
import { supabase } from "@/integrations/supabase/client";
import type { Post } from "@/integrations/supabase/types/post";

interface MainFeedProps {
  isPayingCustomer: boolean | null;
  userRole?: 'admin' | 'moderator' | 'user';
  onOpenCreatePost?: () => void;
  onFileSelect?: (files: FileList | null) => void;
  onOpenGoLive?: () => void;
}

export const MainFeed = ({
  isPayingCustomer,
  userRole,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: MainFeedProps) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'popular' | 'recent' | 'shorts'>('feed');
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, refetch } = useFeedQuery(undefined, activeTab);
  const { handleLike, handleDelete } = usePostActions();
  const session = useSession();
  const { toast } = useToast();

  // Set up real-time subscription for posts
  useEffect(() => {
    const channel = supabase
      .channel('public:posts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Received real-time update:', payload);
          refetch();
          
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Post updated",
              description: "A post you're viewing has been edited",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch, toast]);

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
        className="glass-effect p-4 rounded-xl"
      >
        <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />
      </motion.div>
      
      {session && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl"
        >
          <CreatePostArea 
            onOpenCreatePost={onOpenCreatePost}
            onFileSelect={onFileSelect}
            onOpenGoLive={onOpenGoLive}
            isPayingCustomer={isPayingCustomer}
          />
        </motion.div>
      )}
      
      {posts.length === 0 ? (
        <div className="glass-effect p-8 rounded-xl">
          <EmptyFeed />
        </div>
      ) : (
        posts.map((post) => {
          const typedPost: Post = {
            ...post,
            visibility: (post.visibility || 'public') as 'public' | 'subscribers_only',
            is_ppv: post.is_ppv || false,
            has_liked: post.has_liked || false,
            screenshots_count: post.screenshots_count || 0,
            downloads_count: post.downloads_count || 0,
            creator: {
              username: post.creator?.username || null,
              avatar_url: post.creator?.avatar_url || null
            }
          };

          return (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="glass-card hover:scale-[1.02] transition-all duration-300"
            >
              <PostCard
                post={typedPost}
                onLike={handleLike}
                onDelete={handleDelete}
                onComment={handleComment}
                currentUserId={session?.user?.id}
              />
            </motion.div>
          );
        })
      )}
      
      {hasNextPage && (
        <div ref={ref} className="h-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary" />
        </div>
      )}
    </div>
  );
};
