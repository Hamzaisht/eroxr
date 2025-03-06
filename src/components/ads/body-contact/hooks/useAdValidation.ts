
import { AdFormValues } from "../types";

export const validateAdSubmission = (values: AdFormValues): { isValid: boolean; error?: string } => {
  // Validate required fields
  if (!values.title || !values.description || !values.relationshipStatus || !values.location) {
    return { isValid: false, error: "Please fill all required fields" };
  }

  // Check if Looking For is selected
  if (!values.lookingFor || values.lookingFor.length === 0) {
    return { isValid: false, error: "Please select at least one 'Looking For' option" };
  }

  // Check for at least one media item (photo or video)
  if (!values.videoFile && !values.avatarFile) {
    return { isValid: false, error: "At least one photo or video is required. Please upload media content." };
  }

  return { isValid: true };
};

// Export a hook version for consistency with other hooks
export const useAdValidation = () => {
  return { validateAdSubmission };
};
