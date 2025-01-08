import { motion, AnimatePresence } from "framer-motion";
import { StoryReel } from "@/components/StoryReel";
import { CreatePostArea } from "./CreatePostArea";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { FeedHeader } from "./FeedHeader";
import { ShortsFeed } from "./ShortsFeed";
import { useState } from "react";

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
  const [activeTab, setActiveTab] = useState("feed");

  const renderFeedContent = () => {
    switch (activeTab) {
      case "shorts":
        return <ShortsFeed />;
      default:
        return (
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
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
              <StoryReel />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <CreatorsFeed />
            </motion.div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <FeedHeader />
      <AnimatePresence mode="wait">
        {renderFeedContent()}
      </AnimatePresence>
    </motion.div>
  );
};