import { useState, useEffect, ReactNode } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { InteractiveNav } from "./InteractiveNav";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { LoadingScreen } from "./LoadingScreen";
import { BackgroundEffects } from "./BackgroundEffects";
import { UploadDialog } from "./UploadDialog";
import { FloatingActionMenu } from "./FloatingActionMenu";
import { supabase } from "@/integrations/supabase/client";
import { MainNav } from "@/components/MainNav";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isErosDialogOpen, setIsErosDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isErosRoute = location.pathname === "/shorts";

  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        if (!session) {
          navigate('/login', { replace: true });
          return;
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Session check error:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please try logging in again",
        });
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [session, navigate, toast]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isInitialized || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      <BackgroundEffects />
      
      <AnimatePresence mode="wait">
        {!isErosRoute && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MainNav />
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={cn(
        "relative flex min-h-screen",
        isErosRoute ? 'pt-0' : 'pt-16',
        "transition-all duration-300"
      )}>
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <InteractiveNav />
          </motion.div>
        )}
        
        <main className={cn(
          "flex-1 min-h-screen w-full",
          !isMobile && !isErosRoute ? 'pl-20 lg:pl-24' : '',
          "transition-all duration-300"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="w-full min-h-screen"
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {session && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <FloatingActionMenu currentPath={location.pathname} />
        </motion.div>
      )}

      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />

      <UploadDialog 
        open={isErosDialogOpen}
        onOpenChange={setIsErosDialogOpen}
        onUpload={async (file: File) => {
          if (!session?.user?.id) return;

          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from('posts')
              .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
              .from('posts')
              .getPublicUrl(filePath);

            const { data: post, error: postError } = await supabase
              .from('posts')
              .insert([
                {
                  creator_id: session.user.id,
                  content: "New Eros video",
                  video_urls: [publicUrl],
                  visibility: 'public'
                }
              ])
              .select()
              .single();

            if (postError) throw postError;

            toast({
              title: "Video uploaded successfully",
              description: "Your Eros video is ready to be edited",
            });
            
            navigate(`/shorts/edit/${post.id}`);
          } catch (error) {
            console.error('Upload error:', error);
            toast({
              title: "Upload failed",
              description: "Failed to upload video. Please try again.",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
};