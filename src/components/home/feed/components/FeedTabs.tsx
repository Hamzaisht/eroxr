
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload, Radio, TrendingUp, Home } from "lucide-react";

interface FeedTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  onOpenCreatePost: () => void;
  onFileSelect: (files: FileList | null) => void;
  onOpenGoLive: () => void;
}

export const FeedTabs = ({
  activeTab,
  onTabChange,
  onOpenCreatePost,
  onFileSelect,
  onOpenGoLive,
}: FeedTabsProps) => {
  return (
    <div className="flex items-center justify-between p-2">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full max-w-[300px] p-1 bg-white/5 backdrop-blur-lg rounded-xl">
          <TabsTrigger 
            value="feed"
            className="relative w-full data-[state=active]:bg-gradient-to-r from-luxury-primary to-luxury-accent data-[state=active]:text-white"
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-4 h-4" />
              For You
            </motion.div>
          </TabsTrigger>
          <TabsTrigger 
            value="trending"
            className="relative w-full data-[state=active]:bg-gradient-to-r from-luxury-primary to-luxury-accent data-[state=active]:text-white"
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <TrendingUp className="w-4 h-4" />
              Trending
            </motion.div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = 'image/*,video/*';
              input.onchange = (e) => {
                const target = e.target as HTMLInputElement;
                if (target.files) {
                  onFileSelect(target.files);
                }
              };
              input.click();
            }}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-xl"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenCreatePost}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-xl"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenGoLive}
            className="bg-white/5 hover:bg-white/10 backdrop-blur-lg rounded-xl"
          >
            <Radio className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};
