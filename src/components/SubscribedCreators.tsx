
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "@/components/CreatorCard";
import { useSession } from "@supabase/auth-helpers-react";
import { Database } from "@/integrations/supabase/types/database.types";
import { safeString, isSubscriptionRow, isProfileRow } from "@/utils/supabase/typeSafeOperations";

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface Creator {
  id: string;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  banner_url?: string | null;
}

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
        .eq('user_id', userId as string)
        .order("created_at", { ascending: false });
        
      if (error || !data) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
      
      // Transform data to match expected types, ensuring we only map valid rows
      return data
        .filter((item): item is (Database['public']['Tables']['creator_subscriptions']['Row'] & {
          creator?: ProfileRow | null;
        }) => {
          return isSubscriptionRow(item) && 
                (!item.creator || (item.creator && typeof item.creator === 'object'));
        })
        .map((item) => ({
          id: safeString(item.id),
          creator_id: safeString(item.creator_id),
          user_id: safeString(item.user_id),
          created_at: safeString(item.created_at),
          creator: item.creator as Creator
        }));
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
