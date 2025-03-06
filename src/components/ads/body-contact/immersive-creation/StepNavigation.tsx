
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevClick: () => void;
  onNextClick: () => void;
  onSubmitClick: () => void;
  isLoading: boolean;
}

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevClick, 
  onNextClick, 
  onSubmitClick,
  isLoading 
}: StepNavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;
  
  return (
    <div className="flex justify-between py-6">
      <Button
        variant="outline"
        onClick={onPrevClick}
        disabled={currentStep === 0}
        className={cn(
          "rounded-full bg-black/20 backdrop-blur-sm border-luxury-primary/20",
          "transition-all duration-300 hover:border-luxury-primary/50",
          currentStep === 0 && "opacity-50 pointer-events-none"
        )}
      >
        <ChevronLeft size={16} className="mr-2" />
        Back
      </Button>
      
      <Button
        onClick={isLastStep ? onSubmitClick : onNextClick}
        disabled={isLoading}
        className="rounded-full bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white 
          hover:from-luxury-secondary hover:to-luxury-primary hover:shadow-[0_0_15px_rgba(155,135,245,0.5)]
          transition-all duration-300"
      >
        {isLoading ? (
          <>Loading...</>
        ) : isLastStep ? (
          <>
            Create Ad
            <Check size={16} className="ml-2" />
          </>
        ) : (
          <>
            Next
            <ChevronRight size={16} className="ml-2" />
          </>
        )}
      </Button>
    </div>
  );
};
