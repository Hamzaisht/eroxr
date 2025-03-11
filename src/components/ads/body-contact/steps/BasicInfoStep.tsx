
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { AdFormValues } from "../types";
import { LocationSearch } from "../../LocationSearch";
import { type Database } from "@/integrations/supabase/types";
import { ProfileImageUploader } from "./components/ProfileImageUploader";
import { TitleDescriptionInputs } from "./components/TitleDescriptionInputs";
import { StatusBodyTypeSelects } from "./components/StatusBodyTypeSelects";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface BasicInfoStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const BasicInfoStep = ({ values, onUpdateValues }: BasicInfoStepProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const handleAvatarChange = (file: File | null, preview: string) => {
    onUpdateValues({ avatarFile: file });
    setAvatarPreview(preview);
  };

  // Update location when city or country changes
  const handleLocationChange = () => {
    if (selectedCity && selectedCountry) {
      onUpdateValues({ location: `${selectedCity}, ${selectedCountry}` });
    } else if (selectedCountry) {
      onUpdateValues({ location: selectedCountry });
    } else {
      onUpdateValues({ location: '' });
    }
  };

  // Set location when city or country changes
  useEffect(() => {
    handleLocationChange();
  }, [selectedCity, selectedCountry]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Profile Image */}
      <ProfileImageUploader 
        onAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview}
      />

      {/* Title and Description */}
      <TitleDescriptionInputs 
        title={values.title}
        description={values.description}
        onTitleChange={(title) => onUpdateValues({ title })}
        onDescriptionChange={(description) => onUpdateValues({ description })}
      />

      {/* Status and Body Type */}
      <StatusBodyTypeSelects 
        relationshipStatus={values.relationshipStatus}
        bodyType={values.bodyType}
        onRelationshipStatusChange={(relationshipStatus) => onUpdateValues({ relationshipStatus })}
        onBodyTypeChange={(bodyType) => onUpdateValues({ bodyType })}
      />

      {/* Location */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2"
      >
        <Label htmlFor="location" className="text-luxury-neutral">Location</Label>
        <LocationSearch
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry as (country: NordicCountry | null) => void}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </motion.div>
    </motion.div>
  );
};
