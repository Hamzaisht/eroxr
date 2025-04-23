
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

  // Autofill logic: only run on step mount / first update
  useEffect(() => {
    if (userProfile && (!values.title || values.title === "My Body Contact Ad")) {
      const nextTitle =
        userProfile.full_name ||
        userProfile.username ||
        "My Body Contact Ad";
      onUpdateValues({ title: nextTitle });

      if (userProfile.avatar_url && !avatarPreview && !values.avatarFile) {
        setAvatarPreview(userProfile.avatar_url);
        onUpdateValues({ avatarFile: null });
      }
    }
  // Only run when userProfile changes or values.avatarFile/title become empty
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  // Show avatar preview (choose: uploaded by user else from profile else fallback)
  const resolvedAvatar =
    avatarPreview ||
    (values.avatarFile ? "" : userProfile?.avatar_url ?? "");

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

  useEffect(() => {
    handleLocationChange();
    // eslint-disable-next-line
  }, [selectedCity, selectedCountry]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-7 custom-scrollbar"
      style={{ overflowY: "visible", maxHeight: "unset", paddingRight: 2 }}
    >
      {/* Avatar – show only one! */}
      <div className="flex w-full justify-center py-3 pb-0">
        <ProfileImageUploader 
          onAvatarChange={handleAvatarChange}
          avatarPreview={avatarPreview || (userProfile?.avatar_url ?? "")}
        />
      </div>

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

