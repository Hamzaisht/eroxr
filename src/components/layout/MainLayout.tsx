import { useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MainNav } from "@/components/MainNav";
import { InteractiveNav } from "./InteractiveNav";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { LoadingScreen } from "./LoadingScreen";
import { BackgroundEffects } from "./components/BackgroundEffects";
import { MainContent } from "./components/MainContent";
import { UploadDialog } from "./UploadDialog";
import { FloatingActionMenu } from "./FloatingActionMenu";

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

  const handleUpload = (files: FileList) => {
    console.log('Files to upload:', files);
    // Handle file upload logic here
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isInitialized || !session) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#0D1117] relative overflow-hidden">
      <BackgroundEffects />

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
      
      <div className="relative flex min-h-screen">
        <InteractiveNav />
        <MainContent isErosRoute={isErosRoute}>
          {children}
        </MainContent>
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
        onUpload={handleUpload}
      />
    </div>
  );
};