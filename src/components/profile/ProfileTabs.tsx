import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, MessageCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { MediaGrid } from "./MediaGrid";
import { EmptyState } from "./EmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { useParams } from "react-router-dom";

export const ProfileTabs = ({ profile }: { profile: any }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams();
  const canAccessBodyContact = profile?.is_paying_customer || profile?.id_verification_status === 'verified';

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto">
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
              <TabsContent value="showcase" className="space-y-8">
                <div className="w-full">
                  <CreatorsFeed feedType="recent" />
                </div>
              </TabsContent>

              <TabsContent value="media" className="space-y-8">
                <MediaGrid onImageClick={setSelectedImage} />
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
      </div>
    </div>
  );
};