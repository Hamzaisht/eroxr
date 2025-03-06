
import { motion } from "framer-motion";
import { Info } from "lucide-react";

interface StepSidebarProps {
  title: string;
  description: string;
  currentStep: number;
  totalSteps: number;
}

export const StepSidebar = ({ title, description, currentStep, totalSteps }: StepSidebarProps) => {
  return (
    <div className="col-span-1 lg:col-span-1 flex flex-col justify-between p-6 bg-gradient-to-br from-black/50 to-luxury-primary/5 backdrop-blur-md border-r border-luxury-primary/10">
      <div>
        <motion.h2 
          className="text-2xl font-bold mb-2 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-sm text-gray-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {description}
        </motion.p>
      </div>
      
      <div className="space-y-4">
        <motion.div 
          className="flex items-center text-sm text-luxury-neutral"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Info size={14} className="mr-2 text-luxury-primary/80" />
          <span>Your ad will be reviewed before it goes live</span>
        </motion.div>
        
        <motion.div 
          className="text-sm text-luxury-neutral"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Step {currentStep + 1} of {totalSteps}
        </motion.div>
      </div>
    </div>
  );
};
