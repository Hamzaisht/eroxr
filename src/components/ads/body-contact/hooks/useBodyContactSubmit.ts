
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AdFormValues } from '../types';

interface UseBodyContactSubmitProps {
  onSuccess?: () => void;
  onComplete?: () => void;
  isSuperAdmin?: boolean;
}

export const useBodyContactSubmit = ({ onSuccess, onComplete, isSuperAdmin }: UseBodyContactSubmitProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: AdFormValues) => {
    if (isLoading) return; // Prevent multiple submissions
    
    setIsLoading(true);
    try {
      // Basic validation
      if (!data.title?.trim() || !data.description?.trim()) {
        throw new Error('Title and description are required');
      }

      // Simulate API call
      console.log('Submitting ad:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your dating ad has been created successfully!",
      });
      
      onSuccess?.();
      onComplete?.();
    } catch (error: any) {
      console.error('Error submitting ad:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create dating ad. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading };
};
