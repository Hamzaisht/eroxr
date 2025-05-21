
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";
import { StoryReel } from "@/components/StoryReel";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video, Loader2 } from "lucide-react";

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [isErosDialogOpen, setIsErosDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const checkPayingCustomerStatus = async () => {
      if (!session?.user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_paying_customer')
          .eq('id', session.user.id)
          .single();
      
        if (error) {
          console.error('Error fetching profile data:', error);
          setLoadError("Could not load your profile information");
          return;
        }
      
        if (data) {
          setIsPayingCustomer(data.is_paying_customer);
        }
      } catch (err) {
        console.error('Exception in checkPayingCustomerStatus:', err);
        setLoadError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    checkPayingCustomerStatus();
  }, [session?.user?.id]);

  if (!session) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-luxury-primary" />
          <p className="text-luxury-neutral">Loading your personalized feed...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <p className="text-red-500">{loadError}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <HomeLayout>
      <div className="w-full max-w-[2000px] mx-auto px-0">
        <div className="mb-6">
          <StoryReel />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4 md:gap-8 px-4 md:px-6">
          <MainFeed
            userId={session.user.id}
            isPayingCustomer={isPayingCustomer}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onFileSelect={setSelectedFiles}
            onOpenGoLive={() => setIsGoLiveOpen(true)}
          />
          <div className={`${isMobile ? 'hidden' : 'block'}`}>
            <RightSidebar />
          </div>
        </div>
      </div>

      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />

      <GoLiveDialog 
        open={isGoLiveOpen}
        onOpenChange={setIsGoLiveOpen}
      />

      <Dialog open={isErosDialogOpen} onOpenChange={setIsErosDialogOpen}>
        <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none mx-auto rounded-lg mt-auto' : 'sm:max-w-[425px]'}`}>
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
                    toast({
                      title: "Video selected",
                      description: "Your Eros video is ready to be edited",
                    });
                    setIsErosDialogOpen(false);
                  }
                }}
              />
              <Button
                onClick={() => document.getElementById('eros-upload')?.click()}
                className="w-full h-32 rounded-lg border-2 border-dashed border-luxury-primary/20 hover:border-luxury-primary/40 transition-colors"
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
    </HomeLayout>
  );
};

export default Home;
