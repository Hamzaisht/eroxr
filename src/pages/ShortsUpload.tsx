
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { VideoUploadForm } from "@/components/upload/VideoUploadForm";

export default function ShortsUpload() {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication
  if (!session) {
    toast({
      title: "Authentication required",
      description: "You must be logged in to upload videos",
      variant: "destructive",
    });
    navigate("/login");
    return null;
  }

  const handleComplete = (videoId: string) => {
    toast({
      title: "Upload successful",
      description: "Your video has been uploaded successfully"
    });
    navigate("/shorts");
  };

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Upload Short Video</h1>
      
      <VideoUploadForm 
        onComplete={handleComplete}
        onCancel={() => navigate("/shorts")}
        maxSizeInMB={100}
      />
    </div>
  );
}
