
import { useCallback } from 'react';

export const usePreventFormSubmission = () => {
  const preventFormSubmission = useCallback((e: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  return { preventFormSubmission };
};
