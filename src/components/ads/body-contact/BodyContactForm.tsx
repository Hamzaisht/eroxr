
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { ProfileImageUpload } from "./components/ProfileImageUpload";
import { VideoUpload } from "./components/VideoUpload";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { LocationAgeFields } from "./components/LocationAgeFields";
import { TagsField } from "./components/TagsField";
import { LookingForField } from "./components/LookingForField";
import { FormSubmitError } from "./components/FormSubmitError";
import { AdFormValues, BodyContactFormProps } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const BodyContactForm = ({ onSubmit, isLoading, onCancel }: BodyContactFormProps) => {
  const [values, setValues] = useState<AdFormValues>({
    title: "",
    description: "",
    relationshipStatus: "single",
    lookingFor: [],
    tags: [],
    location: "",
    ageRange: { lower: 18, upper: 99 },
    bodyType: "",
    videoFile: null,
    avatarFile: null,
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const updateField = (field: keyof AdFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear previous errors when form is updated
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
    if (!values.videoFile) errors.push("Video profile is required");
    if (values.lookingFor.length === 0) errors.push("Please select at least one 'Looking For' option");
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    try {
      // Validate form before submitting
      if (!validateForm()) {
        return;
      }
      
      // Clear any previous errors
      setSubmitError(null);
      
      console.log("Submitting form with values:", {
        ...values,
        videoFile: values.videoFile ? `${values.videoFile.name} (${(values.videoFile.size / (1024 * 1024)).toFixed(2)}MB)` : null,
        avatarFile: values.avatarFile ? `${values.avatarFile.name} (${(values.avatarFile.size / (1024 * 1024)).toFixed(2)}MB)` : null,
      });
      
      // Submit the form
      await onSubmit(values);
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitError(error.message || "An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-3">
      <ProfileImageUpload 
        avatarPreview={avatarPreview} 
        onAvatarChange={handleAvatarChange} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <BasicInfoFields
            title={values.title}
            description={values.description}
            relationshipStatus={values.relationshipStatus}
            bodyType={values.bodyType}
            onUpdateTitle={(value) => updateField('title', value)}
            onUpdateDescription={(value) => updateField('description', value)}
            onUpdateRelationshipStatus={(value) => updateField('relationshipStatus', value)}
            onUpdateBodyType={(value) => updateField('bodyType', value)}
          />
        </div>
        
        <div>
          <LookingForField
            lookingFor={values.lookingFor}
            onUpdateLookingFor={(value) => updateField('lookingFor', value)}
          />

          <LocationAgeFields
            location={values.location}
            ageRange={values.ageRange}
            onUpdateLocation={(value) => updateField('location', value)}
            onUpdateAgeRange={(value) => updateField('ageRange', value)}
          />
        </div>
      </div>

      <TagsField
        tags={values.tags}
        onUpdateTags={(value) => updateField('tags', value)}
      />

      <VideoUpload
        videoFile={values.videoFile}
        onUpdateVideoFile={(value) => updateField('videoFile', value)}
      />

      {validationErrors.length > 0 && (
        <Alert variant="destructive" className="mt-3">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-semibold mb-1">Please fix the following errors:</div>
            <ul className="list-disc pl-5">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {submitError && <FormSubmitError error={submitError} />}

      <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-2">
        <Button variant="outline" onClick={onCancel} size="sm">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          size="sm"
          className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Ad"
          )}
        </Button>
      </div>
    </div>
  );
};
