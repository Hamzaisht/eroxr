import { ReactNode, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { MainContent } from "./components/MainContent";
import { UploadDialog } from "./UploadDialog";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { supabase } from "@/integrations/supabase/client";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const location = useLocation();

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      if (!session?.user?.id) {
        throw new Error('Authentication required to upload files');
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 100MB limit');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an image or video file.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // Show upload started toast
      toast({
        title: "Upload started",
        description: "Your file is being processed...",
      });

      // Upload to storage
      const { error: uploadError, data } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(filePath);

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded successfully",
      });

      setIsUploadOpen(false);
      return publicUrl;

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "There was an error uploading your file. Please try again.",
      });
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const isErosRoute = location.pathname.includes('/eros');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative min-h-screen w-full backdrop-blur-3xl">
        <div className="flex w-full">
          <MainContent isErosRoute={isErosRoute}>
            {children}
          </MainContent>
        </div>

        <FloatingActionMenu currentPath={location.pathname} />
        
        <UploadDialog
          open={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          onUpload={handleUpload}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
        />
      </div>
    </div>
  );
};