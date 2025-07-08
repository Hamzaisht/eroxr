import { useState, useCallback } from 'react';
import { CreateAdFormData } from '../types';

const initialFormData: CreateAdFormData = {
  title: '',
  description: '',
  location: '',
  age: 18,
  gender: 'male',
  bodyType: 'average',
  height: '',
  relationshipStatus: 'single',
  lookingFor: [],
  interests: [],
  tags: [],
  profileImage: null,
  additionalImages: [],
  profileVideo: null,
  isVerified: false,
  verificationLevel: 'basic',
};

export const useCreateAdForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<CreateAdFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateData = useCallback((updates: Partial<CreateAdFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsSubmitting(false);
  }, []);

  const submitForm = useCallback(async (onSuccess?: () => void) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, resetForm]);

  const getProgress = useCallback(() => {
    const totalSteps = 4; // We'll have 4 steps
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep]);

  return {
    currentStep,
    formData,
    isSubmitting,
    updateData,
    nextStep,
    previousStep,
    goToStep,
    resetForm,
    submitForm,
    getProgress,
  };
};