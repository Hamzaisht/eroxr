import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SuggestedCreators = () => {
  const { toast } = useToast();
  const session = useSession();

  const { data: suggestedCreators } = useQuery({
    queryKey: ["suggested-creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(5);

      if (error) throw error;
      return data;
    },
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
      // First check if the follow relationship already exists
      const { data: existingFollow } = await supabase
        .from("followers")
        .select()
        .eq("follower_id", session.user.id)
        .eq("following_id", creatorId)
        .maybeSingle();

      if (existingFollow) {
        toast({
          title: "Already following",
          description: `You are already following ${creatorName}`,
        });
        return;
      }

      // If no existing follow, create new follow relationship
      const { error } = await supabase
        .from("followers")
        .insert([
          {
            follower_id: session.user.id,
            following_id: creatorId,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Following",
        description: `You are now following ${creatorName}`,
      });
    } catch (error) {
      console.error("Follow error:", error);
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
        <h2 className="text-lg font-semibold text-luxury-neutral">Top 5%</h2>
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
                  <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                    New
                  </Badge>
                </div>
                <p className="text-sm text-luxury-neutral/60 truncate">{creator.bio || "Creator"}</p>
              </div>
            </Link>
            <Button
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary"
              onClick={() => handleFollow(creator.id, creator.username || "Creator")}
            >
              Follow
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};