
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreatorsFeed } from "@/components/CreatorsFeed";
import { MediaGrid } from "./MediaGrid";
import { EmptyState } from "./EmptyState";

export const ProfileTabs = ({ profile }: { profile: any }) => {
  const canAccessBodyContact = profile?.is_paying_customer || profile?.id_verification_status === 'verified';

  const tabItems = [
    {
      value: "showcase",
      label: "Showcase",
      icon: CircuitBoard,
      content: <CreatorsFeed feedType="recent" />
    },
    {
      value: "media",
      label: "Media",
      icon: Image,
      content: <MediaGrid onImageClick={() => {}} />
    },
    {
      value: "subscribers",
      label: "Subscribers",
      icon: Users,
      content: <EmptyState icon={Users} message="No subscribers yet" />
    },
    {
      value: "likes",
      label: "Likes",
      icon: Heart,
      content: <EmptyState icon={Heart} message="No liked content yet" />
    },
    {
      value: "bodycontact",
      label: "Body Contact",
      icon: MessageCircle,
      disabled: !canAccessBodyContact,
      content: !canAccessBodyContact ? (
        <Alert>
          <AlertDescription>
            Body Contact is only available for verified content creators or paying members. 
            {!profile?.is_paying_customer && (
              <span> Subscribe for $4.99/month to access this feature.</span>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <EmptyState icon={MessageCircle} message="No body contact ads yet" />
      )
    }
  ];

  return (
    <div className="w-full">
      <Tabs defaultValue="showcase" className="w-full">
        <div className="sticky top-16 z-50 bg-luxury-dark/95 backdrop-blur-lg border-b border-luxury-primary/10">
          <div className="max-w-[1400px] mx-auto px-4">
            <TabsList className="w-full justify-start overflow-x-auto flex-nowrap rounded-none bg-transparent h-14 sm:h-16 -mb-px">
              {tabItems.map(({ value, label, icon: Icon, disabled }) => (
                <TabsTrigger 
                  key={value}
                  value={value} 
                  disabled={disabled}
                  className="data-[state=active]:bg-luxury-primary/20 data-[state=active]:text-luxury-primary 
                           px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 whitespace-nowrap
                           hover:bg-luxury-primary/10 transition-all duration-300
                           group"
                >
                  <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {tabItems.map(({ value, content }) => (
              <TabsContent key={value} value={value} className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {content}
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
};
