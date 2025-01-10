import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { InteractiveNav } from "./InteractiveNav";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { Loader2 } from "lucide-react";

export const MainLayout = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isErosDialogOpen, setIsErosDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
          <p className="text-luxury-neutral">Loading your experience...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized || !session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark via-luxury-darker to-luxury-dark">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center opacity-5 pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/10 blur-3xl animate-pulse" />
      </div>
      
      {/* Main content */}
      <div className="relative flex min-h-screen">
        {/* Navigation */}
        <InteractiveNav />
        
        {/* Main content area */}
        <main className="flex-1 min-h-screen w-full pl-20 lg:pl-24">
          <div className="container mx-auto px-4 py-6 min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />

      <Dialog open={isErosDialogOpen} onOpenChange={setIsErosDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-luxury-dark/95 backdrop-blur-xl border-luxury-primary/20">
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <input
                type="file"
                id="eros-upload"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleErosUpload(file);
                    setIsErosDialogOpen(false);
                  }
                }}
              />
              <Button
                onClick={() => document.getElementById('eros-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors bg-luxury-dark/20"
              >
                <div className="flex flex-col items-center gap-2">
                  <Video className="h-8 w-8" />
                  <span>Upload video</span>
                  <span className="text-sm text-luxury-neutral/60">
                    Maximum length: 60 seconds
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  async function handleErosUpload(file: File) {
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
  }
};