import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Heart, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export const TrendingCreators = () => {
  const { toast } = useToast();

  const { data: trendingCreators, isLoading } = useQuery({
    queryKey: ['trending-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trending_content')
        .select(`
          creator_id,
          creator_username,
          creator_avatar,
          likes,
          comments,
          media_interactions,
          trending_rank
        `)
        .eq('content_type', 'post')
        .order('trending_rank', { ascending: true })
        .limit(3);

      if (error) {
        console.error('Error fetching trending creators:', error);
        toast({
          title: "Error loading trending creators",
          description: "Please try again later",
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

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
          <Button variant="outline">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingCreators?.map((creator, index) => (
            <motion.div
              key={creator.creator_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden group">
                <div className="relative h-48 bg-gradient-to-r from-luxury-primary to-luxury-accent">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-4 border-white">
                      <AvatarImage src={creator.creator_avatar} />
                      <AvatarFallback>{creator.creator_username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="text-white">
                      <h3 className="font-semibold">{creator.creator_username}</h3>
                      <p className="text-sm text-white/80">Rank #{creator.trending_rank}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-luxury-primary/10 text-luxury-primary">
                      Trending
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {((creator.likes + creator.comments + creator.media_interactions) / 3).toFixed(1)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4 mr-2" />
                        Follow
                      </Button>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {creator.likes + creator.comments} interactions
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};