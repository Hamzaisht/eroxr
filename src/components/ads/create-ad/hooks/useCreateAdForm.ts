import { useState, useCallback } from 'react';
import { CreateAdFormData } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Error",
          description: "You must be logged in to create an ad.",
          variant: "destructive",
        });
        return;
      }

      // Prepare ad data
      const adData = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        city: formData.location,
        country: 'NO', // Default to Norway - you can make this configurable
        age_range: `[${formData.age},${formData.age + 5}]`, // Age range
        relationship_status: formData.relationshipStatus,
        looking_for: formData.lookingFor,
        tags: formData.tags,
        interests: formData.interests,
        body_type: formData.bodyType,
        height: formData.height ? parseInt(formData.height) : null,
        user_type: formData.gender,
        is_active: true,
        view_count: 0,
        message_count: 0,
        click_count: 0,
      };

      // Insert the ad
      const { data: insertedAd, error } = await supabase
        .from('dating_ads')
        .insert([adData])
        .select()
        .single();

      if (error) {
        console.error('Error creating ad:', error);
        toast({
          title: "Error Creating Ad",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('Ad created successfully:', insertedAd);
      
      toast({
        title: "Success!",
        description: "Your body contact ad has been created successfully.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
      
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, resetForm, toast]);

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