import { motion } from 'framer-motion';
import { Check, User, Heart, Camera, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const stepIcons = [User, Heart, Camera, Send];
const stepTitles = ['Basic Info', 'Preferences', 'Media', 'Review'];

export const StepIndicator = ({ currentStep, totalSteps, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center space-x-6 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const Icon = stepIcons[index];
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= currentStep;
        
        return (
          <motion.div
            key={index}
            className="flex flex-col items-center space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Step circle */}
            <motion.button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={cn(
                "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300",
                isCompleted 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400 text-white" 
                  : isCurrent
                  ? "bg-white/10 border-purple-400 text-purple-300 backdrop-blur-xl"
                  : "bg-white/5 border-white/20 text-white/40 backdrop-blur-xl",
                isClickable && "cursor-pointer hover:scale-110"
              )}
              whileHover={isClickable ? { scale: 1.1 } : undefined}
              whileTap={isClickable ? { scale: 0.95 } : undefined}
            >
              {/* Glow effect for current step */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-purple-500/30 blur-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {/* Icon or check */}
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <Icon className="w-4 h-4" />
              )}
              
              {/* Ripple effect on click */}
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-purple-400"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>
            
            {/* Step title */}
            <motion.span
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isCompleted || isCurrent ? "text-white" : "text-white/50"
              )}
              animate={{
                scale: isCurrent ? 1.05 : 1,
              }}
            >
              {stepTitles[index]}
            </motion.span>
            
            {/* Progress line to next step */}
            {index < totalSteps - 1 && (
              <motion.div
                className="absolute top-6 left-14 w-12 h-0.5 -z-10"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: isCompleted ? 1 : 0,
                  backgroundColor: isCompleted ? "#a855f7" : "rgba(255,255,255,0.2)"
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};