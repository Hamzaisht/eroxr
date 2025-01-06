import { motion, AnimatePresence } from "framer-motion";
import { StoryReel } from "@/components/StoryReel";
import { CreatePostArea } from "./CreatePostArea";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { FeedHeader } from "./FeedHeader";

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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FeedHeader />

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
        >
          <StoryReel />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full bg-luxury-dark/50 backdrop-blur-sm rounded-xl border border-luxury-neutral/10 p-4 shadow-lg"
        >
          <CreatePostArea
            onOpenCreatePost={onOpenCreatePost}
            onFileSelect={onFileSelect}
            onOpenGoLive={onOpenGoLive}
            isPayingCustomer={isPayingCustomer}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="w-full"
        >
          <CreatorsFeed />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};