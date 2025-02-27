
import { Users, Heart, Image, DollarSign, Lock, Loader2, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "./stats/StatCard";
import { TipDialog } from "./stats/TipDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { ProfileStats as ProfileStatsType } from "./stats/types";

const StatSkeleton = () => (
  <div className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg">
    <Skeleton className="h-5 w-5 rounded-full" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
  </div>
);

export const ProfileStats = ({ profileId }: { profileId: string }) => {
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ["profileStats", profileId],
    queryFn: async () => {
      try {
        // Use batch fetching to optimize performance
        const [
          { count: followerCount, error: followerError }, 
          { count: likeCount, error: likeError }, 
          { data: posts, error: postError },
          { count: subscriberCount, error: subError }
        ] = await Promise.all([
          supabase
            .from("followers")
            .select("*", { count: 'exact', head: true })
            .eq("following_id", profileId),
          supabase
            .from("post_likes")
            .select("posts!inner(*)", { count: 'exact', head: true })
            .eq("posts.creator_id", profileId),
          supabase
            .from("posts")
            .select("id, is_ppv")
            .eq("creator_id", profileId),
          supabase
            .from("creator_subscriptions")
            .select("*", { count: 'exact', head: true })
            .eq("creator_id", profileId)
        ]);

        // Check for errors in any of the queries
        if (followerError) throw followerError;
        if (likeError) throw likeError;
        if (postError) throw postError;
        if (subError) throw subError;

        const postCount = posts?.length || 0;
        const premiumPostCount = posts?.filter(post => post.is_ppv).length || 0;

        return {
          follower_count: followerCount || 0,
          like_count: likeCount || 0,
          post_count: postCount,
          premium_post_count: premiumPostCount,
          subscriber_count: subscriberCount || 0
        } as ProfileStatsType;
      } catch (error: any) {
        console.error("Error fetching profile stats:", error);
        toast({
          title: "Error loading stats",
          description: "Failed to load profile statistics. Please try again later.",
          variant: "destructive"
        });
        throw new Error("Failed to fetch profile statistics");
      }
    },
    retry: 2,
    staleTime: 30000
  });

  const handleOpenTipDialog = () => {
    setIsTipLoading(true);
    // Simulate loading for better UX
    setTimeout(() => {
      setShowTipDialog(true);
      setIsTipLoading(false);
    }, 300);
  };

  if (error) {
    return (
      <div className="flex justify-center w-full py-6 px-4">
        <Alert variant="destructive" className="max-w-md bg-luxury-darker border-red-500/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile stats. Please refresh or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-4 justify-center relative z-10 px-4">
        {[...Array(5)].map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4 justify-center relative z-10 px-4">
      <StatCard
        icon={Users}
        value={stats?.follower_count || 0}
        label="Followers"
        iconColor="text-luxury-primary"
        delay={0.2}
        showTooltip
        tooltipContent="People following this creator"
      />
      
      <StatCard
        icon={Users}
        value={stats?.subscriber_count || 0}
        label="Subscribers"
        iconColor="text-luxury-accent"
        delay={0.3}
        showTooltip
        tooltipContent="Paying subscribers to this creator"
      />
      
      <StatCard
        icon={Heart}
        value={stats?.like_count || 0}
        label="Likes"
        iconColor="text-luxury-accent"
        delay={0.4}
        showTooltip
        tooltipContent="Total likes on all posts"
      />
      
      <StatCard
        icon={Image}
        value={stats?.post_count || 0}
        label="Posts"
        iconColor="text-luxury-neutral"
        delay={0.5}
        showTooltip
        tooltipContent="Total posts published"
      />

      {stats?.premium_post_count ? (
        <StatCard
          icon={Lock}
          value={stats.premium_post_count}
          label="Premium"
          iconColor="text-luxury-secondary"
          delay={0.6}
          showTooltip
          tooltipContent="Pay-per-view premium content"
        />
      ) : null}

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: isTipLoading ? 1 : 1.05 }}
        onClick={handleOpenTipDialog}
        className={`neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-primary/20 backdrop-blur-lg 
                   transition-colors duration-300 hover:bg-luxury-primary/30 cursor-pointer
                   ${isTipLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={isTipLoading}
        aria-label="Send tip to creator"
      >
        {isTipLoading ? (
          <Loader2 className="h-5 w-5 text-luxury-primary animate-spin" />
        ) : (
          <DollarSign className="h-5 w-5 text-luxury-primary animate-pulse" />
        )}
        <span className="text-white font-medium">Send Tip</span>
      </motion.button>

      <TipDialog 
        open={showTipDialog}
        onOpenChange={setShowTipDialog}
        recipientId={profileId}
      />
    </div>
  );
};
