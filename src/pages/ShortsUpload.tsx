
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { MediaUploader } from "@/components/upload/MediaUploader";

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

  const handleComplete = (url: string) => {
    // Here we would typically create a database entry for the short
    // For now we'll just navigate back to shorts feed
    toast({
      title: "Upload successful",
      description: "Your video has been uploaded successfully"
    });
    navigate("/shorts");
  };

  const handleError = (error: string) => {
    toast({
      title: "Upload failed",
      description: error,
      variant: "destructive"
    });
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Upload Short Video</h1>
      
      <MediaUploader
        onComplete={handleComplete}
        onError={handleError}
        context="shorts"
        mediaTypes="video"
        buttonText="Select Video to Upload"
        maxSizeInMB={100}
        autoUpload={true}
      />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Upload short videos to share with your audience.</p>
        <p className="mt-2">Maximum size: 100MB</p>
      </div>
    </div>
  );
}
