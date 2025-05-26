
import { motion } from "framer-motion";
import { TitleDescriptionInputs } from "./components/TitleDescriptionInputs";
import { StatusBodyTypeSelects } from "./components/StatusBodyTypeSelects";
import { ProfileImageUploader } from "./components/ProfileImageUploader";

interface BasicInfoStepProps {
  values: any;
  onUpdateValues: (field: string, value: any) => void;
}

export const BasicInfoStep = ({ values, onUpdateValues }: BasicInfoStepProps) => {
  const handleImageUpload = (file: File | null, preview: string) => {
    onUpdateValues('avatarFile', file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Tell us about yourself</h2>
        <p className="text-gray-400">Start with the basics to create your profile</p>
      </div>

      <div className="space-y-6">
        <ProfileImageUploader
          onImageChange={handleImageUpload}
        />

        <TitleDescriptionInputs
          title={values.title}
          description={values.description}
          onTitleChange={(value) => onUpdateValues('title', value)}
          onDescriptionChange={(value) => onUpdateValues('description', value)}
        />

        <StatusBodyTypeSelects
          relationshipStatus={values.relationshipStatus}
          bodyType={values.bodyType}
          onRelationshipStatusChange={(value) => onUpdateValues('relationshipStatus', value)}
          onBodyTypeChange={(value) => onUpdateValues('bodyType', value)}
        />
      </div>
    </motion.div>
  );
};
