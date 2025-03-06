
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

  // Check for at least one media item (photo OR video)
  if (!values.avatarFile && !values.videoFile) {
    return { isValid: false, error: "Please upload at least one photo or video. Media content is required." };
  }

  return { isValid: true };
};

// Export a hook version for consistency with other hooks
export const useAdValidation = () => {
  return { validateAdSubmission };
};
