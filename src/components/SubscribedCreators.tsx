import { useEffect, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorCard } from "./CreatorCard";
import { Skeleton } from "./ui/skeleton";
import { Users } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface Creator {
  id: string;
  username: string | null;
  avatar_url: string | null;
  subscriber_count: number;
}

export const SubscribedCreators = () => {
  const session = useSession();
  const { toast } = useToast();

  const { data: creators, isLoading, error } = useQuery({
    queryKey: ["subscribed-creators", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) return [];
      
      // First verify the creator exists in profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select()
        .eq("id", session.user.id)
        .maybeSingle();

      if (profileError) {
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
        throw profileError;
      }

      // If profile doesn't exist, create it
      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([
            { 
              id: session.user.id,
              username: session.user.email?.split('@')[0] || 'Anonymous User',
              avatar_url: null 
            }
          ]);

        if (insertError) {
          toast({
            title: "Error",
            description: "Failed to create profile",
            variant: "destructive",
          });
          throw insertError;
        }
      }

      // Now fetch subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from("creator_subscriptions")
        .select(`
          creator:creator_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq("user_id", session.user.id);

      if (subsError) {
        toast({
          title: "Error",
          description: "Failed to fetch subscriptions",
          variant: "destructive",
        });
        throw subsError;
      }

      // Get subscriber count for each creator
      const creatorsWithCounts = await Promise.all(
        (subscriptions || []).map(async (sub) => {
          const { count } = await supabase
            .from("creator_subscriptions")
            .select("*", { count: "exact", head: true })
            .eq("creator_id", sub.creator.id);

          return {
            ...sub.creator,
            subscriber_count: count || 0,
          } as Creator;
        })
      );

      return creatorsWithCounts;
    },
    enabled: !!session?.user,
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
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          name={creator.username || "Anonymous Creator"}
          image={creator.avatar_url || "https://via.placeholder.com/400"}
          banner="https://images.unsplash.com/photo-1605810230434-7631ac76ec81"
          description="Content creator on our platform"
          subscribers={creator.subscriber_count}
          creatorId={creator.id}
        />
      ))}
    </div>
  );
};