
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "./CreatorCard";
import { Skeleton } from "./ui/skeleton";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Creator } from "@/integrations/supabase/types/profile";
import { toDbValue, safeDataAccess } from "@/utils/supabase/helpers";

interface CreatorWithStats extends Creator {
  subscriber_count: number;
}

interface SubscriptionData {
  creator: {
    id: string;
    username: string | null;
    avatar_url: string | null;
  };
}

export const SubscribedCreators = () => {
  const session = useSession();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscribed-creators", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      try {
        const { data, error } = await supabase
          .from("creator_subscriptions")
          .select()
          .eq("user_id", toDbValue(session.user.id))
          .limit(5);

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        return [];
      }
    },
    enabled: !!session?.user?.id,
  });

  // Safely access the subscriptions data
  const safeSubscriptions = safeDataAccess(subscriptions, []);

  const { data: creators, isLoading: isLoadingCreators } = useQuery({
    queryKey: ["subscribed-creators-details", safeSubscriptions],
    queryFn: async () => {
      if (!safeSubscriptions.length) return [];

      try {
        // Extract creator IDs safely
        const creatorIds = safeSubscriptions.map((sub: any) => sub.creator_id).filter(Boolean);
        
        if (creatorIds.length === 0) return [];
        
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            username,
            avatar_url,
            bio,
            banner_url,
            followers!followers(count)
          `)
          .in("id", toDbValue(creatorIds));

        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching creator details:", error);
        setError("Failed to load creator details");
        return [];
      }
    },
    enabled: safeSubscriptions.length > 0,
  });

  // Safely access the creators data
  const safeCreators = safeDataAccess(creators, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-2xl font-semibold text-red-500 mb-2">
          Error Loading Subscriptions
        </h3>
        <p className="text-luxury-neutral/70 max-w-md">
          There was an error loading your subscriptions. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[400px] w-full" />
        ))}
      </div>
    );
  }

  if (!safeCreators.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-16 w-16 text-luxury-primary mb-4" />
        <h3 className="text-2xl font-semibold text-luxury-primary mb-2">
          No Subscriptions Yet
        </h3>
        <p className="text-luxury-neutral/70 max-w-md">
          You haven't subscribed to any creators yet. Explore our featured creators
          to find content you'll love!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {safeCreators?.map((creator: any) => (
        <CreatorCard
          key={creator.id}
          id={creator.id}
          username={creator.username}
          avatarUrl={creator.avatar_url}
          banner={creator.banner_url}
          bio={creator.bio}
          followerCount={creator.followers?.length || 0}
          isVerified={true}
          isPremium={true}
        />
      ))}
    </div>
  );
};
