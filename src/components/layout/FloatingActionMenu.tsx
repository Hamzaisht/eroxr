
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, Video, Heart, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingMenuItem } from "./menu/FloatingMenuItem";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UploadVideoDialog } from "../home/UploadVideoDialog";
// import { CreateBodyContactDialog } from "../ads/body-contact"; // REMOVED - to be rebuilt

interface FloatingActionMenuProps {
  currentPath: string;
}

export const FloatingActionMenu = ({ currentPath }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isBodyContactDialogOpen, setIsBodyContactDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAuthentication = (action: () => void) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to access this feature",
        variant: "destructive",
      });
      return;
    }
    action();
  };

  const getContextualMenuItems = () => {
    const commonItems = [
      { 
        icon: Image, 
        label: "Create Post", 
        onClick: () => {
          setIsOpen(false);
          handleAuthentication(() => {
            navigate("/create-post");
            toast({
              title: "Create Post",
              description: "Share your thoughts with your audience"
            });
          });
        }
      },
      { 
        icon: Video, 
        label: "Create Story", 
        onClick: () => {
          setIsOpen(false);
          handleAuthentication(() => {
            navigate("/create-story");
            toast({
              title: "Create Story",
              description: "Share a moment with your audience"
            });
          });
        }
      },
      { 
        icon: Film, 
        label: "Upload Eros", 
        onClick: () => {
          setIsOpen(false);
          handleAuthentication(() => {
            setIsVideoDialogOpen(true);
          });
        }
      },
      { 
        icon: Heart, 
        label: "Dating Ad", 
        onClick: () => {
          setIsOpen(false);
          handleAuthentication(() => {
            setIsBodyContactDialogOpen(true);
            toast({
              title: "Create Dating Profile",
              description: "Start creating your dating profile"
            });
          });
        }
      },
    ];
    
    // Return specialized menu based on current path
    switch (currentPath) {
      case '/shorts':
        return [commonItems[2]]; // Just the Upload Eros option
      case '/dating':
        return [commonItems[3]]; // Just the Dating Ad option
      default:
        return commonItems;
    }
  };

  const menuItems = getContextualMenuItems();

  const handleBodyContactSuccess = () => {
    setIsBodyContactDialogOpen(false);
    toast({
      title: "Dating Ad Created",
      description: "Your dating ad has been created successfully",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {menuItems.map((item, index) => (
              <FloatingMenuItem
                key={item.label}
                {...item}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className={`rounded-full h-14 w-14 bg-luxury-primary hover:bg-luxury-primary/80 shadow-xl transition-transform duration-200 ${
          isOpen ? "rotate-45" : ""
        }`}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Video Upload Dialog */}
      <UploadVideoDialog 
        open={isVideoDialogOpen} 
        onOpenChange={setIsVideoDialogOpen}
      />
      
      {/* Body Contact Dialog - TO BE REBUILT */}
      {isBodyContactDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <p>Create BD Ad Dialog - Coming Soon (to be rebuilt from scratch)</p>
            <button onClick={() => setIsBodyContactDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
