import { useState } from "react";
import { motion } from "framer-motion";
import { FeedHeader } from "./FeedHeader";
import { CreatePostArea } from "./CreatePostArea";
import { PostCard } from "../feed/PostCard";
import { usePostActions } from "../feed/usePostActions";
import { useFeedQuery } from "../feed/useFeedQuery";
import { LoadingSkeleton } from "../feed/LoadingSkeleton";
import { EmptyFeed } from "../feed/EmptyFeed";

export const MainFeed = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const { data: posts, isLoading } = useFeedQuery(activeTab);
  const { handleLike, handleDelete } = usePostActions();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (!posts?.length) {
    return <EmptyFeed />;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <FeedHeader activeTab={activeTab} onTabChange={setActiveTab} />
      <CreatePostArea />
      
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {posts.map((post) => (
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
              currentUserId={post.creator_id}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};