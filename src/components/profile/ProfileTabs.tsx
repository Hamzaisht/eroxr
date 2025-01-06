import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Image, Users, CircuitBoard, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <TabsList className="w-full justify-start bg-luxury-dark/50 backdrop-blur-lg rounded-2xl p-2">
          <TabsTrigger 
            value="showcase"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <CircuitBoard className="h-4 w-4" />
            Showcase
          </TabsTrigger>
          <TabsTrigger 
            value="created"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Image className="h-4 w-4" />
            Created
          </TabsTrigger>
          <TabsTrigger 
            value="collected"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Collected
          </TabsTrigger>
          <TabsTrigger 
            value="likes"
            className="data-[state=active]:bg-luxury-primary data-[state=active]:text-white px-6 py-3 rounded-xl flex items-center gap-2"
          >
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
            <TabsContent value="showcase" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ 
                      scale: 1.02,
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    className="rounded-2xl overflow-hidden bg-luxury-dark/30 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border border-luxury-primary/20 group"
                  >
                    <div className="relative">
                      <img
                        src={`https://picsum.photos/400/300?random=${index}`}
                        alt="Showcase"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Sparkles className="text-white w-6 h-6" />
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="text-xl font-semibold text-luxury-neutral">Showcase Item {index}</h3>
                      <p className="text-sm text-luxury-neutral/70 leading-relaxed">
                        Description for showcase item {index}
                      </p>
                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1 text-luxury-primary">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm">{Math.floor(Math.random() * 1000)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-luxury-accent">
                          <Users className="h-4 w-4" />
                          <span className="text-sm">{Math.floor(Math.random() * 100)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="created" className="mt-8">
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

            <TabsContent value="collected" className="mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center text-luxury-neutral/70 p-12 rounded-2xl border border-luxury-primary/20 bg-luxury-dark/30 backdrop-blur-sm"
              >
                <Users className="w-12 h-12 mx-auto mb-4 text-luxury-primary animate-pulse" />
                <p className="text-lg">No collected items yet</p>
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
    </div>
  );
};