
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "@/components/CreatorCard";
import { useSession } from "@supabase/auth-helpers-react";
import { Database } from "@/integrations/supabase/types/database.types";
import { safeString, isQueryError, ensureUserIdSet } from "@/utils/supabase/typeSafeOperations";

// Define types for database tables
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Define safe creator type
interface Creator {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  banner_url?: string | null;
}

// Define safe subscription type
interface Subscription {
  id: string;
  creator_id: string;
  user_id: string;
  created_at: string;
  creator?: Creator;
}

export const SubscribedCreators = () => {
  const session = useSession();
  const userId = session?.user?.id;
  
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Ensure user ID is set for RLS optimization
      await ensureUserIdSet();
      
      // Check if creator_subscriptions table exists in database schema
      try {
        const { data, error } = await supabase
          .from("creator_subscriptions")
          .select(`
            *,
            creator:creator_id(
              id,
              username,
              avatar_url,
              bio,
              banner_url
            )
          `)
          .eq('user_id', userId)
          .order("created_at", { ascending: false });
          
        if (error || !data || !Array.isArray(data)) {
          console.error("Error fetching subscriptions:", error || "Invalid data format");
          return [];
        }
        
        // Transform data to match expected types with safe type checking
        return data.map((item: any) => {
          // Ensure item exists and has required properties
          if (!item) return null;
          
          // Create subscription object with safe type conversion
          const subscription: Subscription = {
            id: safeString(item.id),
            creator_id: safeString(item.creator_id),
            user_id: safeString(item.user_id),
            created_at: safeString(item.created_at),
            creator: item.creator ? {
              id: safeString(item.creator.id),
              username: item.creator.username || null,
              avatar_url: item.creator.avatar_url || null,
              bio: item.creator.bio || null,
              banner_url: item.creator.banner_url || null
            } : undefined
          };
          
          return subscription;
        }).filter(Boolean) as Subscription[];
      } catch (e) {
        console.error("Exception fetching subscriptions:", e);
        console.warn("The 'creator_subscriptions' table might not exist in the database schema.");
        return [];
      }
    },
    enabled: !!userId,
  });
  
  if (isLoading) {
    return <div>Loading subscriptions...</div>;
  }
  
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center p-8">
        <h3 className="text-xl font-semibold">No Subscriptions Yet</h3>
        <p className="text-muted-foreground mt-2">
          Subscribe to creators to see their content here
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Subscriptions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((subscription) => {
          const creator = subscription.creator;
          if (!creator) return null;
          
          return (
            <CreatorCard
              key={subscription.id}
              creatorId={creator.id}
              username={creator.username || undefined}
              avatarUrl={creator.avatar_url || undefined}
              bio={creator.bio || undefined}
              bannerUrl={creator.banner_url || undefined}
            />
          );
        })}
      </div>
    </div>
  );
};
