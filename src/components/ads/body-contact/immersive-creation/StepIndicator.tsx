
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  title: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between mt-2 text-xs text-gray-400">
      {steps.map((step, index) => (
        <motion.button
          key={index}
          className={cn(
            "transition-colors",
            currentStep >= index ? "text-luxury-primary" : "text-gray-500"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onStepClick(index)}
        >
          {index + 1}. {step.title}
        </motion.button>
      ))}
    </div>
  );
};
