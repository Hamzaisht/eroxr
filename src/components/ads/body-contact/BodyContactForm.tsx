
import { FormSubmitError } from "./components/FormSubmitError";
import { ProfileImageUpload } from "./components/ProfileImageUpload";
import { VideoUpload } from "./components/VideoUpload";
import { BasicInfoFields } from "./components/BasicInfoFields";
import { LocationAgeFields } from "./components/LocationAgeFields";
import { TagsField } from "./components/TagsField";
import { LookingForField } from "./components/LookingForField";
import { ValidationErrors } from "./components/ValidationErrors";
import { FormSubmitButtons } from "./components/FormSubmitButtons";
import { BodyContactFormProps } from "./types";
import { useBodyContactForm } from "./hooks/useBodyContactForm";

export const BodyContactForm = ({ onSubmit, isLoading, onCancel }: BodyContactFormProps) => {
  const {
    values,
    avatarPreview,
    submitError,
    validationErrors,
    updateField,
    handleAvatarChange,
    handleSubmit
  } = useBodyContactForm(onSubmit);

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

      <ValidationErrors errors={validationErrors} />

      {submitError && <FormSubmitError error={submitError} />}

      <FormSubmitButtons 
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
      />
    </div>
  );
};
