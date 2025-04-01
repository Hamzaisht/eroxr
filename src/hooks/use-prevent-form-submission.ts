
import { useCallback } from 'react';

/**
 * Custom hook to prevent form submission events that would cause page refresh
 * For use in forms, filters, and other interactive elements
 */
export const usePreventFormSubmission = () => {
  const preventFormSubmission = useCallback((e: React.FormEvent | React.MouseEvent | React.TouchEvent | React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      preventFormSubmission(e);
    }
  }, [preventFormSubmission]);

  return { preventFormSubmission, handleKeyDown };
};
