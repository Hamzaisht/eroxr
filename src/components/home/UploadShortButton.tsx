
import { useState } from "react";
import { Plus } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UploadVideoDialog } from "./UploadVideoDialog";

export const UploadShortButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleOpenDialog = () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload shorts",
        variant: "destructive",
      });
      return;
    }
    
    setIsDialogOpen(true);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleOpenDialog}
          className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg hover:shadow-luxury z-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          Upload Short
        </Button>
      </motion.div>

      <UploadVideoDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};
