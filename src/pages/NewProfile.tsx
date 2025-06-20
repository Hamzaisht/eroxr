
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SimpleProfileViewer } from "@/components/profile/core/SimpleProfileViewer";
import { SimpleProfileStudio } from "@/components/profile/core/SimpleProfileStudio";
import { useAuth } from "@/contexts/AuthContext";

export default function NewProfile() {
  const { profileIdentifier } = useParams();
  const { user } = useAuth();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  console.log('NewProfile - profileIdentifier:', profileIdentifier);
  console.log('NewProfile - user:', user?.id);

  // Function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Determine the profile ID to use
  let profileId: string | null = null;
  
  if (profileIdentifier) {
    // If profileIdentifier is a valid UUID, use it directly
    if (isValidUUID(profileIdentifier)) {
      profileId = profileIdentifier;
    } else {
      // If it's not a UUID, we'll need to handle username lookup
      // For now, show an error message
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-xl mb-4">Invalid profile identifier</p>
            <p className="text-slate-500">Please provide a valid user ID</p>
          </div>
        </div>
      );
    }
  } else {
    // No identifier provided, use current user's ID
    profileId = user?.id || null;
  }

  if (!profileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <p className="text-slate-400 text-xl">Profile not found</p>
      </div>
    );
  }

  return (
    <>
      <SimpleProfileViewer 
        profileId={profileId}
        onEditClick={() => setIsStudioOpen(true)}
      />

      <SimpleProfileStudio
        profileId={profileId}
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
      />
    </>
  );
}
