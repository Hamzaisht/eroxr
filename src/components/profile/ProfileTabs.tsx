import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, MessageCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { MediaGrid } from "./MediaGrid";
import { EmptyState } from "./EmptyState";

export const ProfileTabs = ({ profile }: { profile: any }) => {
  const canAccessBodyContact = profile?.is_paying_customer || profile?.id_verification_status === 'verified';

  return (
    <div className="w-full min-h-[calc(100vh-24rem)]">
      <Tabs defaultValue="showcase" className="w-full">
        <div className="sticky top-16 z-50 bg-luxury-dark/95 backdrop-blur-lg border-b border-luxury-primary/10">
          <div className="max-w-[1400px] mx-auto px-4">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap rounded-none bg-transparent h-14 sm:h-16 -mb-px">
              <TabsTrigger 
                value="showcase" 
                className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap"
              >
                <CircuitBoard className="h-4 w-4" />
                <span className="hidden sm:inline">Showcase</span>
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap"
              >
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscribers" 
                className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Subscribers</span>
              </TabsTrigger>
              <TabsTrigger 
                value="likes" 
                className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap"
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Likes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="bodycontact" 
                className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap"
                disabled={!canAccessBodyContact}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Body Contact</span>
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 py-4 sm:py-6 md:py-8">
          <AnimatePresence mode="wait">
            <TabsContent value="showcase" className="mt-0 min-h-[300px]">
              <CreatorsFeed feedType="recent" />
            </TabsContent>

            <TabsContent value="media" className="mt-0 min-h-[300px]">
              <MediaGrid onImageClick={() => {}} />
            </TabsContent>

            <TabsContent value="subscribers" className="mt-0 min-h-[300px]">
              <EmptyState 
                icon={Users}
                message="No subscribers yet"
              />
            </TabsContent>

            <TabsContent value="likes" className="mt-0 min-h-[300px]">
              <EmptyState 
                icon={Heart}
                message="No liked content yet"
              />
            </TabsContent>

            <TabsContent value="bodycontact" className="mt-0 min-h-[300px]">
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
  );
};