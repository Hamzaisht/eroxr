import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, Sparkles, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileTabsProps {
  profile: any;
}

export const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Fetch creator's subscription price
  const { data: creatorPrice } = useQuery({
    queryKey: ["creator-price", profile?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creator_content_prices")
        .select("*")
        .eq("creator_id", profile?.id)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    },
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const mediaItems = [
    { id: 1, type: "image", url: "https://picsum.photos/400/300?random=1", isPremium: true },
    { id: 2, type: "image", url: "https://picsum.photos/400/300?random=2", isPremium: false },
    { id: 3, type: "image", url: "https://picsum.photos/400/300?random=3", isPremium: true },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Subscription Price Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-luxury-dark/80 to-luxury-primary/20 backdrop-blur-lg border border-luxury-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Subscribe to {profile?.username}</h3>
            <p className="text-luxury-neutral/70">Get exclusive access to premium content</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-luxury-primary mb-1">
              ${creatorPrice?.monthly_price || "9.99"}<span className="text-sm text-luxury-neutral/70">/month</span>
            </div>
            <Button className="bg-luxury-primary hover:bg-luxury-secondary">
              Subscribe Now
            </Button>
          </div>
        </div>
      </div>

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
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            <TabsContent value="media" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map((mediaItem) => (
                  <motion.div
                    key={mediaItem.id}
                    variants={item}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="relative group cursor-pointer"
                    onClick={() => !mediaItem.isPremium && setSelectedImage(mediaItem.url)}
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-video">
                      <img
                        src={mediaItem.url}
                        alt="Media content"
                        className={`w-full h-full object-cover transition-all duration-300 ${
                          mediaItem.isPremium ? "blur-lg" : ""
                        }`}
                      />
                      {mediaItem.isPremium && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                          <Lock className="w-8 h-8 text-luxury-primary mb-2" />
                          <p className="text-white font-medium">Premium Content</p>
                          <Button 
                            size="sm"
                            className="mt-2 bg-luxury-primary hover:bg-luxury-secondary"
                          >
                            Subscribe to Unlock
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="showcase" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-luxury-neutral/70 p-12 rounded-2xl border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm"
              >
                <CircuitBoard className="w-12 h-12 mx-auto mb-4 text-luxury-primary animate-pulse" />
                <p className="text-lg">No created content yet</p>
              </motion.div>
            </TabsContent>

            <TabsContent value="subscribers" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-luxury-neutral/70 p-12 rounded-2xl border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm"
              >
                <Users className="w-12 h-12 mx-auto mb-4 text-luxury-primary animate-pulse" />
                <p className="text-lg">No subscribers yet</p>
              </motion.div>
            </TabsContent>

            <TabsContent value="likes" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-luxury-neutral/70 p-12 rounded-2xl border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm"
              >
                <Heart className="w-12 h-12 mx-auto mb-4 text-luxury-primary animate-pulse" />
                <p className="text-lg">No liked content yet</p>
              </motion.div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Full Screen Media Dialog */}
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