
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export const CreatorShowcase = () => {
  const { data: creators, isLoading } = useQuery({
    queryKey: ["top-creators"],
    queryFn: async () => {
      // Handle the case where supabase might not be initialized yet
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, username, avatar_url, bio")
          .eq("is_paying_customer", true)
          .limit(10);

        if (error) {
          console.error("Error fetching creators:", error);
          throw error;
        }

        return data || [];
      } catch (err) {
        console.error("Failed to fetch creators:", err);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const renderCreatorCards = () => {
    if (isLoading) {
      return Array(3).fill(0).map((_, i) => (
        <CarouselItem key={`loading-${i}`} className="md:basis-1/3 lg:basis-1/3">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group"
          >
            <div className="rounded-xl overflow-hidden border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl p-4">
              <div className="h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-luxury-darker/50">
                <Skeleton className="h-full w-full" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </motion.div>
        </CarouselItem>
      ));
    }

    if (!creators || creators.length === 0) {
      return (
        <CarouselItem className="md:basis-1/3 lg:basis-1/3">
          <div className="rounded-xl overflow-hidden border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl p-4 text-center">
            <div className="h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-luxury-darker/50">
              <span className="text-luxury-neutral/40">Be the first creator</span>
            </div>
            <div className="text-luxury-primary font-semibold">
              Join and grow your audience
            </div>
          </div>
        </CarouselItem>
      );
    }

    return creators.map((creator) => (
      <CarouselItem key={creator.id} className="md:basis-1/3 lg:basis-1/3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -10 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="rounded-xl overflow-hidden border border-luxury-neutral/10 bg-luxury-dark/50 backdrop-blur-xl p-4">
            <div className="h-48 mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-luxury-darker/50">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={creator.avatar_url || undefined} />
                  <AvatarFallback>
                    {creator.username?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-luxury-primary font-semibold">
                  {creator.username || 'Anonymous Creator'}
                </span>
              </div>
            </div>
            <div className="text-luxury-neutral text-sm line-clamp-2">
              {creator.bio || 'This creator is building their profile'}
            </div>
          </div>
        </motion.div>
      </CarouselItem>
    ));
  };

  return (
    <section className="py-20 bg-luxury-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-luxury-neutral mb-4">
            Success Stories
          </h2>
          <p className="text-luxury-neutral/60 max-w-2xl mx-auto">
            Join our community of successful creators
          </p>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
        >
          <CarouselContent>
            {renderCreatorCards()}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default CreatorShowcase;
