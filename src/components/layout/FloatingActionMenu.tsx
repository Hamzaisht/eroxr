import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, Video, Heart, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FloatingActionMenuProps {
  currentPath: string;
}

export const FloatingActionMenu = ({ currentPath }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getContextualMenuItems = () => {
    switch (currentPath) {
      case '/shorts':
        return [
          { 
            icon: Film, 
            label: "Upload Eros", 
            onClick: () => navigate("/shorts/upload") 
          }
        ];
      case '/dating':
        return [
          { 
            icon: Heart, 
            label: "Create BD", 
            onClick: () => navigate("/dating/create") 
          }
        ];
      default:
        return [
          { icon: Image, label: "Create Post", onClick: () => navigate("/create-post") },
          { icon: Video, label: "Create Story", onClick: () => navigate("/create-story") },
          { icon: Heart, label: "Dating Ad", onClick: () => navigate("/dating/create") },
          { icon: Film, label: "Create Eros", onClick: () => navigate("/shorts/upload") },
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
            {menuItems.map(({ icon: Icon, label, onClick }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-end gap-2"
              >
                <span className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm">
                  {label}
                </span>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    onClick();
                  }}
                  size="icon"
                  className="bg-luxury-primary hover:bg-luxury-primary/80"
                >
                  <Icon className="h-5 w-5" />
                </Button>
              </motion.div>
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