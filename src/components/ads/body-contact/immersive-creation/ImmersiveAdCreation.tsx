
import { useSession } from "@supabase/auth-helpers-react";
import { useBodyContactAccess } from "../hooks/useBodyContactAccess";
import { useBodyContactSubmit } from "../hooks/useBodyContactSubmit";
import { AdFormValues } from "../types";
import { PremiumAccessRequired } from "../components/PremiumAccessRequired";
import { SuccessStep } from "../steps/SuccessStep";
import { BasicInfoStep } from "../steps/BasicInfoStep";
import { PreferencesStep } from "../steps/PreferencesStep";
import { MediaUploadStep } from "../steps/MediaUploadStep";
import { ReviewStep } from "../steps/ReviewStep";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useImmersiveCreation } from "./useImmersiveCreation";
import { CreationLayout } from "./CreationLayout";

interface ImmersiveAdCreationProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export const ImmersiveAdCreation = ({ onClose, onSuccess }: ImmersiveAdCreationProps) => {
  const session = useSession();
  const accessResult = useBodyContactAccess();
  
  // Check if user is super admin
  const isSuperAdmin = session?.user?.email && ["hamzaishtiaq242@gmail.com"].includes(session.user.email.toLowerCase());

  const {
    currentStep,
    direction,
    isExiting,
    showSuccess,
    formProgress,
    values,
    isLoading,
    goToNextStep,
    goToPrevStep,
    jumpToStep,
    onUpdateValues,
    submitForm,
    setShowSuccess
  } = useImmersiveCreation(onSuccess, onClose);

  // Define steps
  const steps = [
    {
      title: "Basic Information",
      description: "Tell us about yourself",
      component: (
        <BasicInfoStep 
          values={values} 
          onUpdateValues={onUpdateValues}
        />
      )
    },
    {
      title: "Your Preferences",
      description: "What are you looking for?",
      component: (
        <PreferencesStep 
          values={values} 
          onUpdateValues={onUpdateValues}
        />
      )
    },
    {
      title: "Media Upload",
      description: "Add your photos and video",
      component: (
        <MediaUploadStep 
          values={values} 
          onUpdateValues={onUpdateValues}
        />
      )
    },
    {
      title: "Review & Publish",
      description: "Final check before going live",
      component: (
        <ReviewStep 
          values={values} 
          onSubmit={submitForm}
          isLoading={isLoading}
        />
      )
    }
  ];

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
  
  if (!accessResult.canAccess && !isSuperAdmin) {
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
    <CreationLayout
      steps={steps}
      currentStep={currentStep}
      direction={direction}
      isExiting={isExiting}
      formProgress={formProgress}
      isLoading={isLoading}
      onClose={onClose}
      onStepClick={jumpToStep}
      onPrevClick={goToPrevStep}
      onNextClick={() => goToNextStep(steps.length)}
      onSubmitClick={submitForm}
    />
  );
};
