
import { motion, useScroll, useTransform } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bell, Filter } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

interface StickyHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFilterToggle?: () => void;
}

export const StickyHeader = ({ 
  activeTab, 
  onTabChange, 
  onFilterToggle
}: StickyHeaderProps) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 50, 100], [0, 0.8, 1]);
  const yPos = useTransform(scrollY, [0, 100], [-100, 0]);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();
  const session = useSession();
  
  const handleTabChange = (value: string) => {
    onTabChange(value);
    // Smooth scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <motion.div 
      style={{ opacity, y: yPos }}
      className="fixed top-0 left-0 right-0 z-40 bg-luxury-dark/80 backdrop-blur-lg border-b border-luxury-primary/10 py-3 px-4"
    >
      <div className="container mx-auto flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
            Body Dating
          </h2>
          
          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/50 border-luxury-primary/20 hidden sm:flex"
                  onClick={() => navigate("/dating/favorites")}
                >
                  <Heart className="h-4 w-4 text-luxury-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/50 border-luxury-primary/20 hidden sm:flex"
                  onClick={() => navigate("/messages")}
                >
                  <MessageCircle className="h-4 w-4 text-luxury-primary" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative bg-luxury-dark/50 border-luxury-primary/20 hidden sm:flex"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-4 w-4 text-luxury-primary" />
                </Button>
              </>
            ) : null}
            
            <Button
              variant="outline"
              size="sm"
              className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-primary"
              onClick={onFilterToggle}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className={`grid grid-cols-4 ${isMobile ? 'w-full' : 'max-w-md mx-auto'}`}>
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="quick-match">Match</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  );
};
