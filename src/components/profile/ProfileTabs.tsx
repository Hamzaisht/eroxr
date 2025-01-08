import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, MessageCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionBanner } from "./SubscriptionBanner";
import { MediaGrid } from "./MediaGrid";
import { EmptyState } from "./EmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileTabsProps {
  profile: any;
}

export const ProfileTabs = ({ profile }: ProfileTabsProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { data: creatorPrice } = useQuery({
    queryKey: ["creator-price", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return null;
      
      const { data, error } = await supabase
        .from("creator_content_prices")
        .select("*")
        .eq("creator_id", profile.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.id,
  });

  const canAccessBodyContact = profile?.is_paying_customer || profile?.id_verification_status === 'verified';

  const displayPrice = creatorPrice?.monthly_price || 9.99;

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
        <SubscriptionBanner 
          username={profile?.username} 
          price={displayPrice}
        />

        <Tabs defaultValue="showcase" className="w-full">
          <TabsList className="w-full justify-start bg-luxury-dark/50 backdrop-blur-lg rounded-2xl p-2 sticky top-0 z-10">
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
            <TabsTrigger 
              value="bodycontact" 
              className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2"
              disabled={!canAccessBodyContact}
            >
              <MessageCircle className="h-4 w-4" />
              Body Contact
            </TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <AnimatePresence mode="wait">
              <TabsContent value="media" className="space-y-8">
                <MediaGrid onImageClick={setSelectedImage} />
              </TabsContent>

              <TabsContent value="showcase" className="space-y-8">
                <EmptyState 
                  icon={CircuitBoard}
                  message="No created content yet"
                />
              </TabsContent>

              <TabsContent value="subscribers" className="space-y-8">
                <EmptyState 
                  icon={Users}
                  message="No subscribers yet"
                />
              </TabsContent>

              <TabsContent value="likes" className="space-y-8">
                <EmptyState 
                  icon={Heart}
                  message="No liked content yet"
                />
              </TabsContent>

              <TabsContent value="bodycontact" className="space-y-8">
                {!canAccessBodyContact ? (
                  <Alert>
                    <AlertDescription>
                      Body Contact is only available for verified content creators or paying members. 
                      {!profile?.is_paying_customer && (
                        <span> Subscribe for $4.99/month to access this feature.</span>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <EmptyState 
                    icon={MessageCircle}
                    message="No body contact ads yet"
                  />
                )}
              </TabsContent>
            </AnimatePresence>
          </div>
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
    </div>
  );
};