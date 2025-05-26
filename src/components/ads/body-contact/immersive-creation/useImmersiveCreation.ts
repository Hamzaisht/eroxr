
import { useState, useEffect, useRef } from "react";
import { AdFormValues } from "../types";
import { useBodyContactSubmit } from "../hooks/useBodyContactSubmit";

export const useImmersiveCreation = (onSuccess?: () => void, onClose?: () => void) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  
  const [values, setValues] = useState<AdFormValues>({
    title: "",
    description: "",
    relationshipStatus: "single",
    lookingFor: [],
    tags: [],
    location: "",
    ageRange: { lower: 18, upper: 99 },
    bodyType: "average",
    videoFile: null,
    avatarFile: null,
  });

  const isNavigating = useRef(false);

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
    },
    isSuperAdmin: false
  });

  useEffect(() => {
    const calculateProgress = () => {
      let points = 0;
      const totalPoints = 10;
      
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

  const goToNextStep = (maxSteps: number) => {
    if (isNavigating.current || isExiting || currentStep >= maxSteps - 1) return;
    
    isNavigating.current = true;
    setDirection(1);
    setIsExiting(true);
    
    setTimeout(() => {
      setCurrentStep((prev) => Math.min(prev + 1, maxSteps - 1));
      setIsExiting(false);
      
      setTimeout(() => {
        isNavigating.current = false;
      }, 50);
    }, 300);
  };

  const goToPrevStep = () => {
    if (isNavigating.current || isExiting || currentStep <= 0) return;
    
    isNavigating.current = true;
    setDirection(-1);
    setIsExiting(true);
    
    setTimeout(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      setIsExiting(false);
      
      setTimeout(() => {
        isNavigating.current = false;
      }, 50);
    }, 300);
  };

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  const jumpToStep = (index: number) => {
    if (isNavigating.current || isExiting || index === currentStep) return;
    
    isNavigating.current = true;
    
    if (index < currentStep) {
      setDirection(-1);
    } else {
      setDirection(1);
    }
    
    setIsExiting(true);
    
    setTimeout(() => {
      setCurrentStep(index);
      setIsExiting(false);
      
      setTimeout(() => {
        isNavigating.current = false;
      }, 50);
    }, 300);
  };

  // Fixed: Change function signature to accept partial values object
  const updateValues = (newValues: Partial<AdFormValues>) => {
    setValues(prev => ({ ...prev, ...newValues }));
  };

  const submitForm = () => {
    handleSubmit(values);
  };

  return {
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
    updateValues, // Changed from updateField
    submitForm,
    setShowSuccess,
  };
};
