import { motion } from "framer-motion";
import type { MainFeedProps } from "../../types";
import { CreatePostArea } from "../../CreatePostArea";
import { FeedTabs } from "./FeedTabs";

export const FeedContainer = ({
  userId,
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: MainFeedProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto space-y-6"
    >
      <CreatePostArea
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={onFileSelect}
        isPayingCustomer={isPayingCustomer}
      />
      
      <FeedTabs 
        userId={userId}
        onOpenGoLive={onOpenGoLive}
      />
    </motion.div>
  );
};