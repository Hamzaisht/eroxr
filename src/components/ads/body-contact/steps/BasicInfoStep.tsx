
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { AdFormValues } from "../types";
import { LocationSearch } from "../../LocationSearch";
import { type Database } from "@/integrations/supabase/types";
import { ProfileImageUploader } from "./components/ProfileImageUploader";
import { TitleDescriptionInputs } from "./components/TitleDescriptionInputs";
import { StatusBodyTypeSelects } from "./components/StatusBodyTypeSelects";
import { useLoggedInProfile } from "../hooks/useLoggedInProfile";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface BasicInfoStepProps {
  values: AdFormValues;
  onUpdateValues: (values: Partial<AdFormValues>) => void;
}

export const BasicInfoStep = ({ values, onUpdateValues }: BasicInfoStepProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Fetch profile info for logged in user
  const userProfile = useLoggedInProfile();

  // Initialize the avatar and title fields if profile available
  useEffect(() => {
    // Only set title if not yet set and userProfile is available
    if (userProfile && !values.title) {
      const nextTitle =
        userProfile.full_name ||
        userProfile.username ||
        "My Body Contact Ad";
      onUpdateValues({ title: nextTitle });

      // auto-preview avatar
      if (userProfile.avatar_url && !avatarPreview) {
        setAvatarPreview(userProfile.avatar_url);
        onUpdateValues({ avatarFile: null }); // keep file null, just preview for now
      }
    }
    // Auto-preview avatar if user updates, but do not overwrite if user uploads own image
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

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
    // eslint-disable-next-line
  }, [selectedCity, selectedCountry]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 custom-scrollbar"
      style={{ overflowY: "auto", maxHeight: "62vh", paddingRight: 4 }}
    >
      {/* Profile Image */}
      <ProfileImageUploader 
        onAvatarChange={handleAvatarChange}
        avatarPreview={avatarPreview || (userProfile?.avatar_url ?? "")}
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
