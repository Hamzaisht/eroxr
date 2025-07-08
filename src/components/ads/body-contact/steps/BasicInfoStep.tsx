
import { motion } from "framer-motion";
import { TitleDescriptionInputs } from "./components/TitleDescriptionInputs";
import { StatusBodyTypeSelects } from "./components/StatusBodyTypeSelects";
import { ProfileImageUploader } from "./components/ProfileImageUploader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdFormValues } from "../types";

interface BasicInfoStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const BasicInfoStep = ({ values, onUpdateValues }: BasicInfoStepProps) => {
  const handleImageUpload = (file: File | null, preview: string) => {
    onUpdateValues({ avatarFile: file });
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
          onTitleChange={(value) => onUpdateValues({ title: value })}
          onDescriptionChange={(value) => onUpdateValues({ description: value })}
        />

        <StatusBodyTypeSelects
          relationshipStatus={values.relationshipStatus}
          bodyType={values.bodyType}
          onRelationshipStatusChange={(value) => onUpdateValues({ 
            relationshipStatus: value as "single" | "taken" | "complicated" 
          })}
          onBodyTypeChange={(value) => onUpdateValues({ 
            bodyType: value as "slim" | "average" | "curvy" | "athletic" 
          })}
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-2"
        >
          <Label htmlFor="location" className="text-luxury-neutral">Location</Label>
          <Input
            id="location"
            value={values.location}
            onChange={(e) => onUpdateValues({ location: e.target.value })}
            placeholder="Enter your location..."
            className="bg-black/20 border-luxury-primary/20 focus:border-luxury-primary/50 text-white"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
