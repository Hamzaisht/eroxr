
import { MoreVertical, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export const SuggestedCreators = () => {
  const { toast } = useToast();
  const session = useSession();
  const [followedCreators, setFollowedCreators] = useState<string[]>([]);

  const { data: suggestedCreators, isLoading } = useQuery({
    queryKey: ["suggested-creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles_with_stats")
        .select("*")
        .order('follower_count', { ascending: false })
        .limit(5)
        .throwOnError();

      if (error) throw error;
      return data;
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  const handleFollow = async (creatorId: string, creatorName: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow creators",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("followers")
        .upsert(
          {
            follower_id: session.user.id,
            following_id: creatorId,
          },
          { 
            onConflict: 'follower_id,following_id',
            ignoreDuplicates: true 
          }
        );

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already following",
            description: `You are already following ${creatorName}`,
          });
          return;
        }
        throw error;
      }

      setFollowedCreators(prev => [...prev, creatorId]);
      toast({
        title: "Following",
        description: `You are now following ${creatorName}`,
      });
    } catch (error) {
      console.error("Follow error:", error);
      
      if (error.message?.includes("timeout") || error.message?.includes("504")) {
        toast({
          title: "Network timeout",
          description: "Please check your connection and try again",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Error",
        description: "Failed to follow creator. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-luxury-neutral">Top Creators</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-luxury-neutral/60 hover:text-luxury-primary"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="h-12 w-12 rounded-full bg-luxury-neutral/10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-luxury-neutral/10 rounded"></div>
                <div className="h-3 w-1/2 bg-luxury-neutral/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {suggestedCreators?.map((creator, i) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center gap-3 rounded-lg p-2 hover:bg-luxury-neutral/5 transition-all cursor-pointer"
            >
              <Link to={`/profile/${creator.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar className="h-12 w-12 ring-2 ring-luxury-primary/20">
                  <AvatarImage src={creator.avatar_url || undefined} />
                  <AvatarFallback className="bg-luxury-primary/20">
                    {creator.username?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-luxury-neutral truncate">{creator.username}</p>
                    {creator.follower_count > 100 && (
                      <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-luxury-neutral/60">
                    <span className="truncate">{creator.follower_count || 0} followers</span>
                    <span className="truncate">{creator.post_count || 0} posts</span>
                  </div>
                </div>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className={`w-8 h-8 p-0 rounded-full transition-all duration-300 ${
                  followedCreators.includes(creator.id)
                    ? 'bg-luxury-primary text-white animate-neon-glow'
                    : 'bg-transparent hover:bg-luxury-neutral/10'
                }`}
                onClick={() => handleFollow(creator.id, creator.username || "Creator")}
              >
                {followedCreators.includes(creator.id) ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
