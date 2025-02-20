
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UploadVideoDialog } from "./UploadVideoDialog";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export const UploadVideoButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleClick = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive",
      });
      return;
    }
    setIsDialogOpen(true);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="fixed bottom-6 right-6 h-14 px-6 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg hover:shadow-luxury z-50"
      >
        <Plus className="h-5 w-5 mr-2" />
        Upload Video
      </Button>

      <UploadVideoDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </>
  );
};
