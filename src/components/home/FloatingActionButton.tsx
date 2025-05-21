
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateBodyContactDialog } from "@/components/ads/body-contact";
import { useToast } from "@/hooks/use-toast";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  const [isBodyContactDialogOpen, setIsBodyContactDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsBodyContactDialogOpen(true);
    }
  };

  const handleBodyContactSuccess = () => {
    toast({
      title: "Dating Ad Created",
      description: "Your dating ad has been created successfully",
    });
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={handleClick}
          size="lg"
          className="rounded-full h-14 w-14 bg-black hover:bg-black/80 shadow-xl"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </motion.div>
      
      <CreateBodyContactDialog onSuccess={handleBodyContactSuccess} />
    </>
  );
};
