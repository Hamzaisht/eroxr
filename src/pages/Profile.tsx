
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileViewer } from "@/components/profile/ProfileViewer";
import { ProfileEditor } from "@/components/profile/ProfileEditor";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Profile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  console.log('Profile - userId:', userId);
  console.log('Profile - user:', user?.id);

  // Function to check if string is a valid UUID
  const isValidUUID = (str: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  // Determine the profile ID to use
  let profileId: string | null = null;
  
  if (userId) {
    // If userId is a valid UUID, use it directly
    if (isValidUUID(userId)) {
      profileId = userId;
    } else {
      // If it's not a UUID, show helpful error with navigation options
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-400 text-xl mb-4">Invalid profile identifier</p>
            <p className="text-slate-500 mb-6">"{userId}" is not a valid user ID</p>
            <div className="space-y-3">
              <Button onClick={() => navigate('/profile')} className="block mx-auto">
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
      {isEditing ? (
        <ProfileEditor 
          profileId={profileId}
          onClose={() => setIsEditing(false)}
        />
      ) : (
        <ProfileViewer 
          profileId={profileId}
          onEditClick={() => setIsEditing(true)}
        />
      )}
    </>
  );
}
