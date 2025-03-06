
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ProfileImageUpload } from "./components/ProfileImageUpload";
import { VideoUpload } from "./components/VideoUpload";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { LocationAgeFields } from "./components/LocationAgeFields";
import { TagsField } from "./components/TagsField";
import { BodyContactFormProps, AdFormValues } from "./types";

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

  const updateField = (field: keyof AdFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = (file: File | null, preview: string) => {
    updateField('avatarFile', file);
    setAvatarPreview(preview);
  };

  const handleSubmit = () => {
    onSubmit(values);
  };

  return (
    <div className="space-y-4">
      <ProfileImageUpload 
        avatarPreview={avatarPreview} 
        onAvatarChange={handleAvatarChange} 
      />

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

      <LocationAgeFields
        location={values.location}
        ageRange={values.ageRange}
        onUpdateLocation={(value) => updateField('location', value)}
        onUpdateAgeRange={(value) => updateField('ageRange', value)}
      />

      <TagsField
        tags={values.tags}
        onUpdateTags={(value) => updateField('tags', value)}
      />

      <VideoUpload
        videoFile={values.videoFile}
        onUpdateVideoFile={(value) => updateField('videoFile', value)}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-gradient-to-r from-luxury-primary to-luxury-secondary hover:from-luxury-secondary hover:to-luxury-primary text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
