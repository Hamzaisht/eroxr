import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useInstantFeedback = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const withInstantFeedback = useCallback(async <T>(
    operation: () => Promise<T>,
    options: {
      loadingMessage?: string;
      successMessage: string;
      errorMessage?: string;
      showInstantSuccess?: boolean;
      onSuccess?: (result: T) => void;
      onError?: (error: any) => void;
    }
  ): Promise<T | null> => {
    setIsProcessing(true);

    try {
      // Show instant success if requested
      if (options.showInstantSuccess) {
        toast({
          title: "Success!",
          description: options.successMessage,
        });
      }

      // Perform operation
      const result = await operation();

      // Show success message if not shown instantly
      if (!options.showInstantSuccess) {
        toast({
          title: "Success!",
          description: options.successMessage,
        });
      }

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      console.error('Operation failed:', error);
      
      toast({
        title: "Error",
        description: options.errorMessage || "Something went wrong. Please try again.",
        variant: "destructive",
      });

      if (options.onError) {
        options.onError(error);
      }

      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  return {
    isProcessing,
    withInstantFeedback
  };
};