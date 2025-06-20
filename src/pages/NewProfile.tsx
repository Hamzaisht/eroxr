
import { useState } from "react";
import { useParams } from "react-router-dom";
import { SimpleProfileViewer } from "@/components/profile/core/SimpleProfileViewer";
import { SimpleProfileStudio } from "@/components/profile/core/SimpleProfileStudio";
import { useAuth } from "@/contexts/AuthContext";

export default function NewProfile() {
  const { profileIdentifier } = useParams();
  const { user } = useAuth();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Use the current user's ID if no identifier is provided in the URL
  const profileId = profileIdentifier || user?.id;

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
