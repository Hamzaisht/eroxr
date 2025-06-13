
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EroxrProfileViewer } from "@/components/studio/enhanced/EroxrProfileViewer";
import { EroxrProfileStudio } from "@/components/studio/enhanced/EroxrProfileStudio";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Profile() {
  const { id } = useParams();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  if (!id) {
    return (
      <div className="min-h-screen bg-luxury-gradient flex items-center justify-center">
        <p className="text-luxury-muted text-xl">Divine profile not found</p>
      </div>
    );
  }

  return (
    <>
      <EroxrProfileViewer 
        profileId={id}
        onEditClick={() => setIsStudioOpen(true)}
      />

      <Dialog open={isStudioOpen} onOpenChange={setIsStudioOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] p-0 border-none bg-transparent overflow-hidden">
          <EroxrProfileStudio
            profileId={id}
            onClose={() => setIsStudioOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
