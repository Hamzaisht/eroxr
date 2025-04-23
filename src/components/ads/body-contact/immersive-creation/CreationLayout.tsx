
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
    <div className="relative z-20 w-full h-full min-h-[60vh] flex flex-col rounded-2xl bg-gradient-to-br from-[#171A24da] to-[#0D1117f6] shadow-xl overflow-hidden">
      {/* Navigation bar */}
      <div className="flex items-center justify-between py-4 px-2 md:px-6 bg-transparent rounded-t-2xl">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full bg-black/40 hover:bg-black/60 shadow-lg"
        >
          <X size={22} />
        </Button>
        
        <div className="flex-1 mx-4 md:mx-8">
          <ProgressBar progress={formProgress} />
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={onStepClick}
          />
        </div>
        
        {/* Spacer for symmetry */}
        <div className="w-10" />
      </div>
      
      {/* Step content */}
      <div className="flex-1 relative overflow-hidden flex flex-col rounded-b-2xl">
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
              {/* Sidebar */}
              <StepSidebar 
                title={steps[currentStep].title}
                description={steps[currentStep].description}
                currentStep={currentStep}
                totalSteps={steps.length}
              />
              
              {/* Main Content */}
              <div className="col-span-1 lg:col-span-4 p-4 md:p-6 pb-8 overflow-y-auto">
                {steps[currentStep].component}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation actions */}
      <div className="bg-transparent px-4 py-2">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          onSubmitClick={onSubmitClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
