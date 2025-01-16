import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { useNavigate } from "react-router-dom";

const Index = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session?.user?.id) {
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_paying_customer')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          console.error("Profile check failed:", profileError);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        } else {
          setIsPayingCustomer(profile?.is_paying_customer || false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        toast({
          title: "Error",
          description: "Authentication check failed",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [session, navigate, toast]);

  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen />;
  }

  // If no session, redirect to login
  if (!session?.user) {
    navigate("/login");
    return null;
  }

  return (
    <HomeLayout>
      <div className="w-full max-w-[2000px] mx-auto px-4">
        <div className={`grid gap-8 ${
          isMobile ? 'grid-cols-1' : 'lg:grid-cols-[1fr,400px]'
        }`}>
          <MainFeed 
            userId={session.user.id}
            isPayingCustomer={isPayingCustomer}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onFileSelect={setSelectedFiles}
            onOpenGoLive={() => {
              toast({
                title: "Coming Soon",
                description: "Live streaming feature will be available soon!",
              });
            }}
          />
          {!isMobile && <RightSidebar />}
        </div>
      </div>

      <CreatePostDialog 
        open={isCreatePostOpen} 
        onOpenChange={setIsCreatePostOpen}
        selectedFiles={selectedFiles}
        onFileSelect={setSelectedFiles}
      />
    </HomeLayout>
  );
};

export default Index;