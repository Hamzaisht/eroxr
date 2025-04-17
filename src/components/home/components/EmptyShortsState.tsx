
import { motion } from "framer-motion";
import { VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmptyShortsState = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white p-4"
    >
      <div className="flex flex-col items-center max-w-md text-center">
        <div className="bg-luxury-darker/50 p-6 rounded-full mb-6">
          <VideoOff className="h-12 w-12 text-luxury-primary/70" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">No videos found</h2>
        <p className="text-white/70 mb-6">
          We couldn't find any short videos to display. Be the first to upload or check back later!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={() => navigate('/shorts/upload')}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            Upload a Short
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/home')}
            className="border-luxury-neutral/30 text-luxury-neutral"
          >
            Go to Home
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
