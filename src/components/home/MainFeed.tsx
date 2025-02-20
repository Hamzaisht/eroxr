
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { FeedContainer } from "./feed/components/FeedContainer";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import type { MainFeedProps } from "./types";

export const MainFeed = ({
  userId,
  isPayingCustomer,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: MainFeedProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  const [hasSeenTip, setHasSeenTip] = useState(() => 
    localStorage.getItem("hasSeenEngagementTip")
  );

  // Show engagement tip for new users
  useEffect(() => {
    if (!hasSeenTip) {
      setTimeout(() => {
        toast({
          title: "Pro Tip! 💡",
          description: "Interact with content to see more of what you love. Try liking or commenting!",
          duration: 5000,
        });
        localStorage.setItem("hasSeenEngagementTip", "true");
        setHasSeenTip("true");
      }, 10000);
    }
  }, [hasSeenTip, toast]);

  return (
    <div className={`w-full ${isMobile ? "px-2" : "px-4"} py-6`}>
      {/* Trending Content Alert */}
      <AnimatePresence>
        {!hasSeenTip && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-lg bg-luxury-primary/10 border border-luxury-primary/20"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-luxury-primary animate-pulse" />
              <p className="text-sm text-luxury-neutral">
                Your feed learns from your interactions. Engage with content you enjoy!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedContainer
        userId={userId}
        isPayingCustomer={isPayingCustomer}
        onOpenCreatePost={onOpenCreatePost}
        onFileSelect={(files) => onFileSelect(files)}
        onOpenGoLive={onOpenGoLive}
      />
    </div>
  );
};
