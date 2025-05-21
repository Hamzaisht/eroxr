
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CreateBodyContactDialog } from "@/components/ads/body-contact";
import { useToast } from "@/hooks/use-toast";

interface FloatingActionButtonProps {
  onClick?: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  const [animateButton, setAnimateButton] = useState(false);
  const { toast } = useToast();

  // Auto-animate the button periodically to attract attention
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateButton(true);
      setTimeout(() => setAnimateButton(false), 1000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
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
          className={`rounded-full h-14 w-14 bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary shadow-xl overflow-hidden relative ${
            animateButton ? 'animate-pulse' : ''
          }`}
        >
          <Plus className="h-6 w-6 relative z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
        </Button>
      </motion.div>
    </>
  );
};
