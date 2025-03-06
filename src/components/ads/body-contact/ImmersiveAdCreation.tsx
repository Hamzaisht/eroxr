
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "@supabase/auth-helpers-react";
import { useBodyContactAccess } from "./hooks/useBodyContactAccess";
import { useBodyContactSubmit } from "./hooks/useBodyContactSubmit";
import { PremiumAccessRequired } from "./components/PremiumAccessRequired";
import { AdFormValues } from "./types";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Check, X, Upload, Image, Video, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Import step components
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { PreferencesStep } from "./steps/PreferencesStep";
import { MediaUploadStep } from "./steps/MediaUploadStep";
import { ReviewStep } from "./steps/ReviewStep";
import { SuccessStep } from "./steps/SuccessStep";

interface ImmersiveAdCreationProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const ImmersiveAdCreation = ({ onClose, onSuccess }: ImmersiveAdCreationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const accessResult = useBodyContactAccess();
  const session = useSession();
  const { toast } = useToast();
  
  // Define initial form values
  const [values, setValues] = useState<AdFormValues>({
    title: "",
    description: "",
    relationshipStatus: "single",
    lookingFor: [],
    tags: [],
    location: "",
    ageRange: { lower: 18, upper: 99 },
    bodyType: "",
    videoFile: null,
    avatarFile: null,
  });

  // Handle form submission
  const { handleSubmit, isLoading } = useBodyContactSubmit({
    onSuccess: () => {
      setShowSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    },
    onComplete: () => {
      // Do nothing here, we'll handle the closing manually
    }
  });

  // Update form progress based on field completion
  useEffect(() => {
    const calculateProgress = () => {
      let points = 0;
      const totalPoints = 10;
      
      // Required fields
      if (values.title) points += 1;
      if (values.description) points += 1;
      if (values.lookingFor.length > 0) points += 1;
      if (values.location) points += 1;
      if (values.bodyType) points += 1;
      if (values.relationshipStatus) points += 1;
      if (values.videoFile) points += 2;
      if (values.avatarFile) points += 1;
      if (values.tags.length > 0) points += 1;
      
      return Math.min(100, Math.round((points / totalPoints) * 100));
    };
    
    setFormProgress(calculateProgress());
  }, [values]);

  const steps = [
    {
      title: "Basic Information",
      description: "Tell us about yourself",
      component: (
        <BasicInfoStep 
          values={values} 
          onUpdateValues={(newValues) => setValues({ ...values, ...newValues })}
        />
      )
    },
    {
      title: "Your Preferences",
      description: "What are you looking for?",
      component: (
        <PreferencesStep 
          values={values} 
          onUpdateValues={(newValues) => setValues({ ...values, ...newValues })}
        />
      )
    },
    {
      title: "Media Upload",
      description: "Add your photos and video",
      component: (
        <MediaUploadStep 
          values={values} 
          onUpdateValues={(newValues) => setValues({ ...values, ...newValues })}
        />
      )
    },
    {
      title: "Review & Publish",
      description: "Final check before going live",
      component: (
        <ReviewStep 
          values={values} 
          onSubmit={() => handleSubmit(values)}
          isLoading={isLoading}
        />
      )
    }
  ];

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1);
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsExiting(false);
      }, 300);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsExiting(false);
      }, 300);
    }
  };

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

  // Handle escape key to close the modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  if (!session) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-md p-6 rounded-lg glass-morph"
        >
          <h2 className="text-xl font-bold text-center mb-4">Authentication Required</h2>
          <p className="text-center mb-6">Please log in to create a Body Contact ad.</p>
          <div className="flex justify-center">
            <Button onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!accessResult.canAccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-lg p-6 rounded-lg glass-morph"
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4" 
            onClick={onClose}
          >
            <X size={20} />
          </Button>
          <PremiumAccessRequired accessResult={accessResult} />
        </motion.div>
      </div>
    );
  }
  
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <SuccessStep onClose={onClose} />
      </div>
    );
  }

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
            <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-luxury-primary to-luxury-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              />
            </div>
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
                  onClick={() => {
                    if (index < currentStep) {
                      setDirection(-1);
                      setIsExiting(true);
                      setTimeout(() => {
                        setCurrentStep(index);
                        setIsExiting(false);
                      }, 300);
                    } else if (index > currentStep) {
                      setDirection(1);
                      setIsExiting(true);
                      setTimeout(() => {
                        setCurrentStep(index);
                        setIsExiting(false);
                      }, 300);
                    }
                  }}
                >
                  {index + 1}. {step.title}
                </motion.button>
              ))}
            </div>
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
                <div className="col-span-1 lg:col-span-1 flex flex-col justify-between p-6 bg-gradient-to-br from-black/50 to-luxury-primary/5 backdrop-blur-md border-r border-luxury-primary/10">
                  <div>
                    <motion.h2 
                      className="text-2xl font-bold mb-2 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {steps[currentStep].title}
                    </motion.h2>
                    <motion.p 
                      className="text-sm text-gray-400"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {steps[currentStep].description}
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
                      Step {currentStep + 1} of {steps.length}
                    </motion.div>
                  </div>
                </div>
                
                {/* Right side - step content */}
                <div className="col-span-1 lg:col-span-4 p-6 overflow-y-auto">
                  {steps[currentStep].component}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Bottom action buttons */}
        <div className="flex justify-between py-6">
          <Button
            variant="outline"
            onClick={goToPrevStep}
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
            onClick={currentStep < steps.length - 1 ? goToNextStep : () => handleSubmit(values)}
            disabled={isLoading}
            className="rounded-full bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white 
              hover:from-luxury-secondary hover:to-luxury-primary hover:shadow-[0_0_15px_rgba(155,135,245,0.5)]
              transition-all duration-300"
          >
            {isLoading ? (
              <>Loading...</>
            ) : currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight size={16} className="ml-2" />
              </>
            ) : (
              <>
                Create Ad
                <Check size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
