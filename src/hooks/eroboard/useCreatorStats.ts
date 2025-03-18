
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

export function useCreatorStats() {
  const session = useSession();

  const fetchCreatorStats = async () => {
    if (!session?.user?.id) return null;

    const { data: creatorEarnings, error: creatorEarningsError } = await supabase
      .from("top_creators_by_earnings")
      .select("total_earnings, earnings_percentile")
      .eq("id", session.user.id)
      .single();

    if (creatorEarningsError && !creatorEarningsError.message.includes('No rows found')) {
      console.error("Error fetching creator earnings:", creatorEarningsError);
      return null;
    }

    const { count: followerCount, error: followerError } = await supabase
      .from("followers")
      .select("*", { count: 'exact', head: true })
      .eq("following_id", session.user.id);

    if (followerError) {
      console.error("Error fetching follower count:", followerError);
    }

    return {
      totalEarnings: creatorEarnings?.total_earnings || 0,
      earningsPercentile: creatorEarnings?.earnings_percentile || null,
      followers: followerCount || 0
    };
  };

  return {
    fetchCreatorStats
  };
}
