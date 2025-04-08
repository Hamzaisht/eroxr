
import { useState } from "react";

interface OptimisticUploadState {
  isProcessing: boolean;
  progress: number;
  isComplete: boolean;
  isError: boolean;
  errorMessage: string | null;
}

export const useOptimisticUpload = (onUploadComplete?: () => void) => {
  const [uploadState, setUploadState] = useState<OptimisticUploadState>({
    isProcessing: false,
    progress: 0,
    isComplete: false,
    isError: false,
    errorMessage: null
  });
  
  // Simulate progressive upload for better UX
  const simulateProgressiveUpload = (actualUploadFn: () => Promise<boolean>) => {
    setUploadState({
      isProcessing: true,
      progress: 0,
      isComplete: false,
      isError: false,
      errorMessage: null
    });
    
    // Start with fast progress that slows down
    let progressInterval = setInterval(() => {
      setUploadState(prev => {
        if (prev.progress >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        
        // Slow down as we get closer to 85%
        const increment = prev.progress < 30 ? 10 : 
                        prev.progress < 60 ? 5 : 
                        prev.progress < 80 ? 2 : 1;
                        
        return {
          ...prev,
          progress: Math.min(85, prev.progress + increment)
        };
      });
    }, 200);
    
    // Execute the actual upload
    return actualUploadFn()
      .then(success => {
        clearInterval(progressInterval);
        
        if (success) {
          setUploadState({
            isProcessing: false,
            progress: 100,
            isComplete: true,
            isError: false,
            errorMessage: null
          });
          
          // Add artificial delay for UX smoothness
          if (onUploadComplete) {
            setTimeout(onUploadComplete, 200);
          }
          
          return true;
        } else {
          throw new Error("Upload failed");
        }
      })
      .catch(error => {
        clearInterval(progressInterval);
        setUploadState({
          isProcessing: false,
          progress: 0,
          isComplete: false,
          isError: true,
          errorMessage: error.message || "Upload failed"
        });
        return false;
      });
  };
  
  const resetUploadState = () => {
    setUploadState({
      isProcessing: false,
      progress: 0,
      isComplete: false,
      isError: false,
      errorMessage: null
    });
  };
  
  const retryUpload = (actualUploadFn: () => Promise<boolean>) => {
    resetUploadState();
    return simulateProgressiveUpload(actualUploadFn);
  };
  
  return {
    uploadState,
    simulateProgressiveUpload,
    resetUploadState,
    retryUpload
  };
};
