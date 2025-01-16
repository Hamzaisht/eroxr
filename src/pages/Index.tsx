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
  const [userData, setUserData] = useState<any>(null);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(true);
  
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const navigate = useNavigate();

  // Initial auth and profile check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          console.error("Auth check failed:", userError);
          navigate("/login");
          return;
        }

        setUserData(user);

        // Check paying customer status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_paying_customer')
          .eq('id', user.id)
          .single();
        
        if (!profileError && profile) {
          setIsPayingCustomer(profile.is_paying_customer);
        } else {
          console.error("Profile check failed:", profileError);
        }

      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // No session state
  if (!userData || !session) {
    return null; // useEffect will handle navigation
  }

  // Main render
  return (
    <HomeLayout>
      <div className="w-full max-w-[2000px] mx-auto px-4">
        <div className={`grid gap-8 ${
          isMobile ? 'grid-cols-1' : 'lg:grid-cols-[1fr,400px]'
        }`}>
          <MainFeed 
            userId={userData.id}
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