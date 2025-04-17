
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { VideoUploadForm } from "@/components/upload/VideoUploadForm";

export default function ShortsUpload() {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleComplete = (videoId: string) => {
    toast({
      title: "Upload successful",
      description: "Your video has been uploaded successfully"
    });
    navigate("/shorts");
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <VideoUploadForm 
        onComplete={handleComplete}
        onCancel={() => navigate("/shorts")}
        maxSizeInMB={100}
      />
    </div>
  );
}
