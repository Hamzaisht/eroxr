
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { VideoUploadForm } from "@/components/upload/VideoUploadForm";

export default function ErosUpload() {
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check authentication
  useEffect(() => {
    if (!session) {
      toast({
        title: "Sign in required",
        description: "Please sign in to upload videos",
        variant: "destructive"
      });
      navigate("/login", { state: { from: "/eros/upload" } });
    }
  }, [session, toast, navigate]);
  
  // Handle successful upload
  const handleUploaded = (videoId: string) => {
    toast({
      title: "Upload successful",
      description: "Your video has been uploaded and is being processed",
    });
    navigate(`/eros/${videoId}`);
  };
  
  const handleCancel = () => {
    navigate("/eros");
  };
  
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen pt-16 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container px-4 mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Upload Video</h1>
        
        <VideoUploadForm 
          onComplete={handleUploaded}
          onCancel={handleCancel}
          maxSizeInMB={100}
          userId={session.user.id}
        />
      </motion.div>
    </div>
  );
}
