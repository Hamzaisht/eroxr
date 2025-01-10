import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Button
        onClick={onClick}
        size="lg"
        className="rounded-full h-14 w-14 bg-black hover:bg-black/80 shadow-xl"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </motion.div>
  );
};