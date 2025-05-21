
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MessageCircle, Filter } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CreateBodyContactDialog } from "@/components/ads/body-contact"; // Add this import

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  showFilters?: () => void;
  onLike?: () => void;
  onSkip?: () => void;
  onMessage?: () => void;
}

export const FloatingActionButton = ({
  showFilters,
  onLike,
  onSkip,
  onMessage
}: FloatingActionButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Add state for body contact dialog
  const [showBodyContactDialog, setShowBodyContactDialog] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleCreateAd = () => {
    setIsOpen(false);
    setShowBodyContactDialog(true);
  };

  const actionItems: ActionItem[] = [
    {
      icon: <Filter className="h-5 w-5" />,
      label: "Filters",
      onClick: () => {
        if (showFilters) {
          showFilters();
        }
        setIsOpen(false);
      },
      color: "bg-luxury-primary text-white"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Create Ad",
      onClick: handleCreateAd,
      color: "bg-green-500 text-white"
    },
    {
      icon: <X className="h-5 w-5" />,
      label: "Skip",
      onClick: () => {
        if (onSkip) {
          onSkip();
        }
        setIsOpen(false);
      },
      color: "bg-red-500 text-white"
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "Message",
      onClick: () => {
        if (onMessage) {
          onMessage();
        }
        setIsOpen(false);
      },
      color: "bg-blue-500 text-white"
    }
  ];

  const handleBodyContactSuccess = () => {
    // Handle success, maybe refresh the page or show a toast
  };

  return (
    <div className="fixed right-4 bottom-24 z-50 md:hidden">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3">
            {actionItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{
                  duration: 0.2,
                  delay: 0.05 * (actionItems.length - index)
                }}
                className="flex items-center gap-2"
              >
                <motion.div
                  className="bg-luxury-dark/80 backdrop-blur-sm text-white px-3 py-1 rounded-md shadow-md text-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {item.label}
                </motion.div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "w-12 h-12 rounded-full shadow-lg flex items-center justify-center",
                    item.color
                  )}
                  onClick={item.onClick}
                >
                  {item.icon}
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.button
        className="w-14 h-14 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent text-white shadow-lg flex items-center justify-center"
        whileTap={{ scale: 0.9 }}
        animate={{ 
          rotate: isOpen ? 45 : 0,
          boxShadow: isOpen 
            ? "0 0 15px 5px rgba(155, 135, 245, 0.5)" 
            : "0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
        }}
        onClick={toggleMenu}
      >
        <motion.div 
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="text-2xl font-bold"
        >
          +
        </motion.div>
      </motion.button>

      {/* Add the CreateBodyContactDialog */}
      <CreateBodyContactDialog onSuccess={handleBodyContactSuccess} />
    </div>
  );
};
