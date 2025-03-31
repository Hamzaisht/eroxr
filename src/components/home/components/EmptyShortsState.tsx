
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSession } from "@supabase/auth-helpers-react";

export const EmptyShortsState = () => {
  const session = useSession();
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-luxury-darker text-white text-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md"
      >
        <h2 className="text-2xl font-bold mb-2">No videos yet</h2>
        <p className="text-luxury-neutral mb-8">Be the first to upload a short video and start the trend!</p>
        
        {session?.user && (
          <Button 
            size="lg" 
            className="bg-luxury-primary hover:bg-luxury-primary/80"
            onClick={() => document.getElementById('upload-video-button')?.click()}
          >
            Upload Your First Short
          </Button>
        )}
      </motion.div>
    </div>
  );
};
