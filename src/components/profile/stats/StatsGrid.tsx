
import { Users, Heart, Image, Lock, DollarSign } from "lucide-react";
import { StatCard } from "./StatCard";
import { TipButton } from "./TipButton";
import type { ProfileStats as ProfileStatsType } from "./types";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatsGridProps {
  stats: ProfileStatsType;
  profileId: string;
  onShowUserList: (type: 'followers' | 'subscribers') => void;
  onShowTipDialog: () => void;
  isTipLoading: boolean;
}

export const StatsGrid = ({ 
  stats, 
  profileId,
  onShowUserList, 
  onShowTipDialog, 
  isTipLoading 
}: StatsGridProps) => {
  const session = useSession();
  const isOwnProfile = session?.user?.id === profileId;

  // Fetch earnings data ONLY if it's the user's own profile
  const { data: earningsData } = useQuery({
    queryKey: ["creator-earnings", profileId],
    queryFn: async () => {
      if (!isOwnProfile) return null;
      
      const { data, error } = await supabase
        .from("top_creators_by_earnings")
        .select("total_earnings, earnings_percentile")
        .eq("id", profileId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!isOwnProfile && !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="flex flex-wrap gap-4 justify-center relative z-10 px-4">
      <div onClick={() => onShowUserList('followers')}>
        <StatCard
          icon={Users}
          value={stats?.follower_count || 0}
          label="Followers"
          iconColor="text-luxury-primary"
          delay={0.2}
          showTooltip
          tooltipContent="Click to see followers"
        />
      </div>
      
      <div onClick={() => onShowUserList('subscribers')}>
        <StatCard
          icon={Users}
          value={stats?.subscriber_count || 0}
          label="Subscribers"
          iconColor="text-luxury-accent"
          delay={0.3}
          showTooltip
          tooltipContent="Click to see subscribers"
        />
      </div>
      
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

      {/* Only show earnings if it's the user's own profile */}
      {isOwnProfile && earningsData?.total_earnings ? (
        <StatCard
          icon={DollarSign}
          value={earningsData.total_earnings}
          label="Earnings"
          iconColor="text-green-500"
          delay={0.7}
          showTooltip
          tooltipContent={`You're in the top ${Math.ceil(100 - earningsData.earnings_percentile)}% of earners`}
          isCurrency
        />
      ) : null}

      <TipButton 
        onClick={onShowTipDialog}
        isLoading={isTipLoading}
      />
    </div>
  );
};
