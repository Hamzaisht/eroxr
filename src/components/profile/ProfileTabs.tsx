import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { MediaGrid } from "./MediaGrid";
import { EmptyState } from "./EmptyState";

interface ProfileTabsProps {
  profile: any;
}

export const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: creatorPrice, isError } = useQuery({
    queryKey: ["creator-price", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_content_prices")
        .select("*")
        .eq("creator_id", profile?.id)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const mediaItems = [
    { id: 1, type: "image", url: "https://picsum.photos/400/300?random=1", isPremium: true },
    { id: 2, type: "image", url: "https://picsum.photos/400/300?random=2", isPremium: false },
    { id: 3, type: "image", url: "https://picsum.photos/400/300?random=3", isPremium: true },
  ];

  const displayPrice = creatorPrice?.monthly_price || 9.99;

  return (
    <div className="container mx-auto px-4 py-8">
      <SubscriptionBanner 
        username={profile?.username} 
        price={displayPrice}
      />

      <Tabs defaultValue="showcase" className="w-full">
        <TabsList className="w-full justify-start bg-luxury-dark/50 backdrop-blur-lg rounded-2xl p-2">
          <TabsTrigger value="showcase" className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2">
            <CircuitBoard className="h-4 w-4" />
            Showcase
          </TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2">
            <Image className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="subscribers" className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscribers
          </TabsTrigger>
          <TabsTrigger value="likes" className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Likes
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="media" className="mt-8">
            <MediaGrid items={mediaItems} onImageClick={setSelectedImage} />
          </TabsContent>

          <TabsContent value="showcase" className="mt-8">
            <EmptyState 
              icon={CircuitBoard}
              message="No created content yet"
            />
          </TabsContent>

          <TabsContent value="subscribers" className="mt-8">
            <EmptyState 
              icon={Users}
              message="No subscribers yet"
            />
          </TabsContent>

          <TabsContent value="likes" className="mt-8">
            <EmptyState 
              icon={Heart}
              message="No liked content yet"
            />
          </TabsContent>
        </AnimatePresence>
      </Tabs>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl bg-luxury-dark/95 border-luxury-primary/20">
          <div className="relative aspect-video">
            <img
              src={selectedImage || ""}
              alt="Full screen media"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};