
import { useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileViewer } from "@/components/studio/ProfileViewer";
import { ProfileStudio } from "@/components/studio/ProfileStudio";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Profile() {
  const { id } = useParams();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  if (!id) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <p className="text-luxury-muted text-xl">Profile not found</p>
      </div>
    );
  }

  return (
    <>
      <ProfileViewer 
        profileId={id}
        onEditClick={() => setIsStudioOpen(true)}
      />

      <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0 border-none bg-transparent overflow-hidden">
          <ProfileStudio
            profileId={id}
            onClose={() => setIsStudioOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
