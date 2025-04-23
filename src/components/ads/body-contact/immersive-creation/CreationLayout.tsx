
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
    <div className="flex flex-col w-full h-full min-h-0 bg-gradient-to-br from-[#171A24da] to-[#0D1117f6] rounded-2xl overflow-hidden">
      {/* Navigation bar */}
      <div className="flex items-center justify-between py-4 px-6 lg:px-16 bg-transparent">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="rounded-full bg-black/40 hover:bg-black/60 shadow-lg"
        >
          <X size={24} />
        </Button>

        <div className="flex-1 mx-4 md:mx-10">
          <ProgressBar progress={formProgress} />
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep} 
            onStepClick={onStepClick}
          />
        </div>

        <div className="w-10" />
      </div>

      {/* Content area */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence initial={false} mode="wait">
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
            className="absolute inset-0 w-full h-full overflow-y-auto custom-scrollbar"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-full">
              {/* Sidebar */}
              <StepSidebar 
                title={steps[currentStep].title}
                description={steps[currentStep].description}
                currentStep={currentStep}
                totalSteps={steps.length}
              />
              
              {/* Main Content */}
              <div className="col-span-1 lg:col-span-4 px-4 md:px-12 py-8 flex flex-col">
                {steps[currentStep].component}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation actions */}
      <div className="px-7 py-3 border-t border-white/5">
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
