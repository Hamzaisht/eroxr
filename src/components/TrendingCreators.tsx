import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingCreatorCard } from "./trending/TrendingCreatorCard";
import { useTrendingCreators } from "./trending/useTrendingCreators";
import { useNavigate } from "react-router-dom";

export const TrendingCreators = () => {
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  const { data: trendingCreators, isLoading } = useTrendingCreators();

  const handleMessage = async (creatorId: string) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to message creators",
        variant: "destructive",
      });
      return;
    }
    navigate(`/messages/${creatorId}`);
  };

  const handleFollow = async (creatorId: string) => {
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
        .from('followers')
        .insert([
          {
            follower_id: session.user.id,
            following_id: creatorId,
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You are now following this creator",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow creator. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Trending Creators</h2>
          <Button variant="outline" onClick={() => navigate('/trending')}>View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCreators?.map((creator, index) => (
            <TrendingCreatorCard
              key={creator.creator_id}
              creator={creator}
              index={index}
              onMessage={handleMessage}
              onFollow={handleFollow}
            />
          ))}
        </div>
      </div>
    </section>
  );
};