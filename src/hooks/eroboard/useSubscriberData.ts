
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { isAfter, subMonths } from "date-fns";
import type { DateRange } from "./types";
import { format } from "date-fns";

export function useSubscriberData() {
  const session = useSession();

  const fetchSubscriberData = async (dateRange: DateRange) => {
    if (!session?.user?.id) return null;

    const { data: subscriptionsData, error: subscriptionsError } = await supabase
      .from('creator_subscriptions')
      .select('created_at, user_id')
      .eq('creator_id', session.user.id);

    if (subscriptionsError) {
      console.error("Error fetching subscriber data:", subscriptionsError);
      return null;
    }

    const subscribers = subscriptionsData || [];
    const subscribersInRange = subscribers.filter(sub => {
      const subDate = new Date(sub.created_at);
      return isAfter(subDate, dateRange.from) && 
              !isAfter(subDate, dateRange.to);
    });

    const totalSubscribersCount = subscribers.length;
    const newSubscribersCount = subscribersInRange.length;
    
    const userSubscriptionDates = subscribers.reduce((acc: Record<string, Date[]>, sub) => {
      if (!acc[sub.user_id]) acc[sub.user_id] = [];
      acc[sub.user_id].push(new Date(sub.created_at));
      return acc;
    }, {});
    
    const returningSubscribersCount = Object.values(userSubscriptionDates)
      .filter(dates => 
        dates.length > 1 && 
        dates.some(date => 
          isAfter(date, dateRange.from) && 
          !isAfter(date, dateRange.to)
        )
      ).length;
    
    const lastMonthSubscribers = subscribers.filter(sub => 
      isAfter(new Date(sub.created_at), subMonths(dateRange.from, 1)) && 
      !isAfter(new Date(sub.created_at), dateRange.from)
    ).length;
    
    const previousMonthUsers = new Set();
    const currentMonthUsers = new Set();
    
    subscribers.forEach(sub => {
      const date = new Date(sub.created_at);
      if (isAfter(date, subMonths(dateRange.from, 1)) && 
          !isAfter(date, dateRange.from)) {
        previousMonthUsers.add(sub.user_id);
      }
      if (isAfter(date, dateRange.from) && 
          !isAfter(date, dateRange.to)) {
        currentMonthUsers.add(sub.user_id);
      }
    });
    
    const renewedUsers = [...previousMonthUsers].filter(id => currentMonthUsers.has(id)).length;
    const churnRate = previousMonthUsers.size > 0 
      ? Math.min(100, Math.round(100 * (1 - renewedUsers / previousMonthUsers.size)))
      : 0;

    return {
      totalSubscribers: totalSubscribersCount,
      newSubscribers: newSubscribersCount,
      returningSubscribers: returningSubscribersCount,
      churnRate
    };
  };

  const fetchVipFansData = async () => {
    if (!session?.user?.id) return 0;
    
    try {
      // Fix the query to avoid RLS error
      const { data: purchases, error } = await supabase
        .from('post_purchases')
        .select('user_id')
        .eq('creator_id', session.user.id)
        .gte('created_at', format(subMonths(new Date(), 3), 'yyyy-MM-dd'));
      
      if (error) {
        console.error("Error fetching VIP fans data:", error);
        return 0;
      }
      
      let vipFansCount = 0;
      
      if (purchases && purchases.length > 0) {
        const purchasesByUser: Record<string, number> = {};
        
        purchases.forEach(purchase => {
          const userId = purchase.user_id;
          purchasesByUser[userId] = (purchasesByUser[userId] || 0) + 1;
        });
        
        vipFansCount = Object.values(purchasesByUser).filter(count => count > 5).length;
      }
      
      return vipFansCount;
    } catch (error) {
      console.error("Error in VIP fans calculation:", error);
      return 0;
    }
  };

  return {
    fetchSubscriberData,
    fetchVipFansData
  };
}
