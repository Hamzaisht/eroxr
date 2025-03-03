
import { Users, Heart, Image, Lock } from "lucide-react";
import { StatCard } from "./StatCard";
import { TipButton } from "./TipButton";
import type { ProfileStats as ProfileStatsType } from "./types";

interface StatsGridProps {
  stats: ProfileStatsType;
  onShowUserList: (type: 'followers' | 'subscribers') => void;
  onShowTipDialog: () => void;
  isTipLoading: boolean;
}

export const StatsGrid = ({ 
  stats, 
  onShowUserList, 
  onShowTipDialog, 
  isTipLoading 
}: StatsGridProps) => {
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

      <TipButton 
        onClick={onShowTipDialog}
        isLoading={isTipLoading}
      />
    </div>
  );
};
