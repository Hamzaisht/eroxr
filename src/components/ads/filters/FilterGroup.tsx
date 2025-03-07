
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FilterGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const FilterGroup = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = false 
}: FilterGroupProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-luxury-primary/10 last:border-none">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-luxury-dark/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-medium text-luxury-neutral">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-luxury-neutral" />
        ) : (
          <ChevronDown className="h-4 w-4 text-luxury-neutral" />
        )}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
