import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, Video, Heart, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FloatingMenuItem } from "./menu/FloatingMenuItem";
import { useToast } from "@/hooks/use-toast";

interface FloatingActionMenuProps {
  currentPath: string;
}

export const FloatingActionMenu = ({ currentPath }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getContextualMenuItems = () => {
    switch (currentPath) {
      case '/shorts':
        return [
          { 
            icon: Film, 
            label: "Upload Eros", 
            onClick: () => {
              setIsOpen(false);
              navigate("/shorts/upload");
              toast({
                title: "Create new Eros",
                description: "Upload a video to share with your audience"
              });
            }
          }
        ];
      case '/dating':
        return [
          { 
            icon: Heart, 
            label: "Create BD", 
            onClick: () => {
              setIsOpen(false);
              navigate("/dating/create");
              toast({
                title: "Create Dating Profile",
                description: "Start creating your dating profile"
              });
            }
          }
        ];
      default:
        return [
          { 
            icon: Image, 
            label: "Create Post", 
            onClick: () => {
              setIsOpen(false);
              navigate("/create-post");
              toast({
                title: "Create Post",
                description: "Share your thoughts with your audience"
              });
            }
          },
          { 
            icon: Video, 
            label: "Create Story", 
            onClick: () => {
              setIsOpen(false);
              navigate("/create-story");
              toast({
                title: "Create Story",
                description: "Share a moment with your audience"
              });
            }
          },
          { 
            icon: Heart, 
            label: "Dating Ad", 
            onClick: () => {
              setIsOpen(false);
              navigate("/dating/create");
              toast({
                title: "Create Dating Profile",
                description: "Start creating your dating profile"
              });
            }
          },
          { 
            icon: Film, 
            label: "Create Eros", 
            onClick: () => {
              setIsOpen(false);
              navigate("/shorts/upload");
              toast({
                title: "Create new Eros",
                description: "Upload a video to share with your audience"
              });
            }
          },
        ];
    }
  };

  const menuItems = getContextualMenuItems();

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
    </div>
  );
};