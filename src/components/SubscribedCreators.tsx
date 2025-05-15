import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "./CreatorCard";
import { Skeleton } from "./ui/skeleton";
import { Users } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Creator } from "@/integrations/supabase/types/profile";

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

  const { data: creators, isLoading: isLoadingCreators } = useQuery({
    queryKey: ["subscribed-creators-details", subscriptions],
    queryFn: async () => {
      if (!subscriptions?.length) return [];

      try {
        const creatorIds = subscriptions.map((sub) => sub.creator_id);
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
        return [];
      }
    },
    enabled: !!subscriptions?.length,
  });

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

  if (!creators?.length) {
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
      {creators?.map((creator) => (
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
