
import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import type { DateRange, RevenueBreakdown } from "./types";

export function useEarningsData() {
  const session = useSession();
  const [earningsData, setEarningsData] = useState([]);
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown>({
    subscriptions: 0,
    tips: 0,
    liveStreamPurchases: 0,
    messages: 0
  });

  const fetchEarningsData = useCallback(async (dateRange: DateRange, revenueShare: number) => {
    if (!session?.user?.id) return null;

    const { data: earningsData, error: earningsError } = await supabase
      .from('post_purchases')
      .select(`
        id,
        created_at,
        amount,
        post_id,
        posts!inner (creator_id)
      `)
      .eq('posts.creator_id', session.user.id)
      .gte('created_at', format(dateRange.from, 'yyyy-MM-dd'))
      .lte('created_at', format(dateRange.to, 'yyyy-MM-dd'));

    if (earningsError) {
      console.error("Error fetching earnings data:", earningsError);
      return { earningsData: [], revenueBreakdown: null, totalEarnings: 0 };
    }

    const breakdown: RevenueBreakdown = {
      subscriptions: 0,
      tips: 0,
      liveStreamPurchases: 0,
      messages: 0
    };

    if (earningsData && earningsData.length > 0) {
      earningsData.forEach((purchase: any) => {
        const amount = Number(purchase.amount);
        
        if (amount > 20) {
          breakdown.subscriptions += amount;
        } else if (amount < 5) {
          breakdown.tips += amount;
        } else if (amount >= 10 && amount <= 15) {
          breakdown.liveStreamPurchases += amount;
        } else {
          breakdown.messages += amount;
        }
      });
    }

    setRevenueBreakdown(breakdown);

    const processedEarningsData = earningsData?.reduce((acc: any, purchase: any) => {
      const date = format(new Date(purchase.created_at), 'yyyy-MM-dd');
      acc[date] = (acc[date] || 0) + purchase.amount;
      return acc;
    }, {}) || {};

    const chartEarningsData = Object.entries(processedEarningsData).map(
      ([date, amount]) => ({
        date,
        amount: Number(amount) * revenueShare
      })
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setEarningsData(chartEarningsData);

    const totalEarnings = chartEarningsData.reduce((sum, item) => sum + Number(item.amount), 0);

    return { earningsData: chartEarningsData, revenueBreakdown: breakdown, totalEarnings };
  }, [session?.user?.id]);

  return {
    earningsData,
    revenueBreakdown,
    fetchEarningsData
  };
}
