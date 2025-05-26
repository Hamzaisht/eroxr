
import { useState } from "react";
import { AdFormValues } from "../types";

export const useBodyContactForm = (onSubmit: (values: AdFormValues) => void) => {
  const [values, setValues] = useState<AdFormValues>({
    title: "",
    description: "",
    relationshipStatus: "single",
    lookingFor: [],
    tags: [],
    location: "",
    ageRange: { lower: 18, upper: 99 },
    bodyType: "average", // Set to valid default
    videoFile: null,
    avatarFile: null,
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateField = (field: keyof AdFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setSubmitError(null);
    setValidationErrors([]);
  };

  const handleAvatarChange = (file: File | null, preview: string) => {
    updateField('avatarFile', file);
    setAvatarPreview(preview);
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!values.title) errors.push("Title is required");
    if (!values.description) errors.push("Description is required");
    if (!values.location) errors.push("Location is required");
    if (values.lookingFor.length === 0) errors.push("Please select at least one 'Looking For' option");
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      
      setSubmitError(null);
      
      console.log("Submitting form with values:", {
        ...values,
        videoFile: values.videoFile ? `${values.videoFile.name} (${(values.videoFile.size / (1024 * 1024)).toFixed(2)}MB)` : null,
        avatarFile: values.avatarFile ? `${values.avatarFile.name} (${(values.avatarFile.size / (1024 * 1024)).toFixed(2)}MB)` : null,
      });
      
      await onSubmit(values);
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmitError(error.message || "An unexpected error occurred");
    }
  };

  return {
    values,
    avatarPreview,
    submitError,
    validationErrors,
    updateField,
    handleAvatarChange,
    handleSubmit
  };
};
