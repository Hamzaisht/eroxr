import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users } from "lucide-react";
import { motion } from "framer-motion";

interface ProfileTabsProps {
  profile: any;
}

export const ProfileTabs = ({ profile }: ProfileTabsProps) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="showcase" className="w-full">
        <TabsList className="w-full justify-start bg-luxury-dark/50 backdrop-blur-lg">
          <TabsTrigger 
            value="showcase"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white"
          >
            Showcase
          </TabsTrigger>
          <TabsTrigger 
            value="created"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white"
          >
            <Image className="h-4 w-4 mr-2" />
            Created
          </TabsTrigger>
          <TabsTrigger 
            value="collected"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white"
          >
            <Users className="h-4 w-4 mr-2" />
            Collected
          </TabsTrigger>
          <TabsTrigger 
            value="likes"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white"
          >
            <Heart className="h-4 w-4 mr-2" />
            Likes
          </TabsTrigger>
        </TabsList>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
        >
          <TabsContent value="showcase" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  variants={item}
                  className="rounded-xl overflow-hidden bg-luxury-dark/30 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <img
                    src={`https://picsum.photos/400/300?random=${item}`}
                    alt="Showcase"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-luxury-neutral">Showcase Item {item}</h3>
                    <p className="text-sm text-luxury-neutral/70">Description for showcase item {item}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="created" className="mt-6">
            <div className="text-center text-luxury-neutral/70">
              No created content yet
            </div>
          </TabsContent>

          <TabsContent value="collected" className="mt-6">
            <div className="text-center text-luxury-neutral/70">
              No collected items yet
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <div className="text-center text-luxury-neutral/70">
              No liked content yet
            </div>
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};