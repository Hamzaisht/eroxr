
import { useCallback } from 'react';

/**
 * Custom hook to prevent form submission events that would cause page refresh
 */
export const usePreventFormSubmission = () => {
  const preventFormSubmission = useCallback((e: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  return { preventFormSubmission };
};
