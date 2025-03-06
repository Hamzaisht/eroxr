
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { StepIndicator } from "./StepIndicator";
import { StepNavigation } from "./StepNavigation";
import { StepSidebar } from "./StepSidebar";

interface Step {
  title: string;
  description: string;
  component: ReactNode;
}

interface CreationLayoutProps {
  steps: Step[];
  currentStep: number;
  direction: number;
  isExiting: boolean;
  formProgress: number;
  isLoading: boolean;
  onClose: () => void;
  onStepClick: (index: number) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
  onSubmitClick: () => void;
}

export const CreationLayout = ({
  steps,
  currentStep,
  direction,
  isExiting,
  formProgress,
  isLoading,
  onClose,
  onStepClick,
  onPrevClick,
  onNextClick,
  onSubmitClick
}: CreationLayoutProps) => {
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    })
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-luxury-primary/10 via-transparent to-transparent pointer-events-none"
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="container relative z-10 max-w-6xl h-[90vh] flex flex-col"
      >
        {/* Top navigation bar */}
        <div className="flex items-center justify-between py-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/40"
          >
            <X size={20} />
          </Button>
          
          <div className="flex-1 mx-8">
            <ProgressBar progress={formProgress} />
            <StepIndicator 
              steps={steps} 
              currentStep={currentStep} 
              onStepClick={onStepClick}
            />
          </div>
          
          <div className="w-12"></div> {/* Empty div for flex alignment */}
        </div>
        
        {/* Main content area */}
        <div className="flex-1 relative overflow-hidden glass-morph rounded-xl border border-luxury-primary/20">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                {/* Left side - step info */}
                <StepSidebar 
                  title={steps[currentStep].title}
                  description={steps[currentStep].description}
                  currentStep={currentStep}
                  totalSteps={steps.length}
                />
                
                {/* Right side - step content */}
                <div className="col-span-1 lg:col-span-4 p-6 overflow-y-auto">
                  {steps[currentStep].component}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Bottom action buttons */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onSubmitClick={onSubmitClick}
          isLoading={isLoading}
        />
      </motion.div>
    </div>
  );
};
