
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "@/components/CreatorCard";
import { useSession } from "@supabase/auth-helpers-react";
import { asColumnName, asUUID, safeCast } from "@/utils/supabase/helpers";
import { Database } from "@/integrations/supabase/types/database.types";

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
        .eq(asColumnName<Database["public"]["Tables"]["creator_subscriptions"]["Row"]>("user_id"), asUUID(userId))
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
      
      return safeCast<Subscription>(data);
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
