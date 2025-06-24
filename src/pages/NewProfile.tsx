
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SimpleProfileViewer } from "@/components/profile/core/SimpleProfileViewer";
import { SimpleProfileStudio } from "@/components/profile/core/SimpleProfileStudio";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function NewProfile() {
  const { profileIdentifier } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  console.log('NewProfile - profileIdentifier:', profileIdentifier);
  console.log('NewProfile - user:', user?.id);
  console.log('NewProfile - current URL path:', window.location.pathname);

  // Function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Determine the profile ID to use
  let profileId: string | null = null;
  
  if (profileIdentifier) {
    // Check if it's the literal route parameter (debugging issue)
    if (profileIdentifier === ':profileIdentifier') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-xl mb-4">Invalid URL</p>
            <p className="text-slate-500 mb-6">You're visiting the route template, not an actual profile.</p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/new-profile')} className="block mx-auto">
                View Your Profile
              </Button>
              <p className="text-slate-600 text-sm">
                To view someone else's profile, use: /new-profile/[their-user-id]
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // If profileIdentifier is a valid UUID, use it directly
    if (isValidUUID(profileIdentifier)) {
      profileId = profileIdentifier;
    } else {
      // If it's not a UUID, show helpful error with navigation options
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-xl mb-4">Invalid profile identifier</p>
            <p className="text-slate-500 mb-6">"{profileIdentifier}" is not a valid user ID</p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/new-profile')} className="block mx-auto">
                View Your Profile
              </Button>
              <p className="text-slate-600 text-sm">
                Profile IDs must be valid UUIDs (like: 12345678-1234-1234-1234-123456789abc)
              </p>
            </div>
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
        <div className="text-center">
          <p className="text-slate-400 text-xl mb-4">Profile not found</p>
          <p className="text-slate-500 mb-6">You need to be logged in to view profiles</p>
          <Button onClick={() => navigate('/login')} className="block mx-auto">
            Login
          </Button>
        </div>
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
