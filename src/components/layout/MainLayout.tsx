import { ReactNode, useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { BackgroundEffects } from "./BackgroundEffects";
import { InteractiveNav } from "./InteractiveNav";
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

      if (!session?.user) {
        throw new Error('Authentication required to upload files');
      }

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size exceeds 100MB limit');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an image or video file.');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      toast({
        title: "Upload started",
        description: "Your file is being processed...",
      });

      const { error: uploadError, data } = await supabase.storage
        .from('posts')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

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

  const isErosRoute = location.pathname.includes('/shorts');

  return (
    <div className="flex min-h-screen bg-[#0D1117]">
      <InteractiveNav />
      
      <div className="flex-1 relative">
        <div className="fixed inset-0 pointer-events-none">
          <BackgroundEffects />
        </div>
        
        <main className="relative ml-[80px] md:ml-[240px] min-h-screen">
          <MainContent isErosRoute={isErosRoute}>
            {children}
          </MainContent>

          <FloatingActionMenu currentPath={location.pathname} />

          <UploadDialog
            open={isUploadOpen}
            onOpenChange={setIsUploadOpen}
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        </main>
      </div>
    </div>
  );
};