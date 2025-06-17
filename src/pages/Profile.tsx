
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EroxrProfileViewer } from "@/components/studio/enhanced/EroxrProfileViewer";
import { EroxrProfileStudio } from "@/components/studio/enhanced/EroxrProfileStudio";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { profileIdentifier } = useParams();
  const { user } = useAuth();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Use the current user's ID if no identifier is provided in the URL
  // profileIdentifier can be either a username or UUID
  const profileId = profileIdentifier || user?.id;

  if (!profileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <p className="text-slate-400 text-xl">Divine profile not found</p>
      </div>
    );
  }

  return (
    <>
      <EroxrProfileViewer 
        profileId={profileId}
        onEditClick={() => setIsStudioOpen(true)}
      />

      <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0 border-none bg-transparent overflow-hidden">
          <EroxrProfileStudio
            profileId={profileId}
            onClose={() => setIsStudioOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
