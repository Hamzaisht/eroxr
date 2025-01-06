import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { GoLiveDialog } from "@/components/home/GoLiveDialog";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";
import { useToast } from "@/hooks/use-toast";

const Home = () => {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isGoLiveOpen, setIsGoLiveOpen] = useState(false);
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const session = useSession();
  const { toast } = useToast();

  // Fetch initial premium status and subscribe to changes
  useEffect(() => {
    const checkPayingCustomerStatus = async () => {
      if (!session?.user?.id) return;
      
      console.log("Checking premium status for user:", session.user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paying_customer')
        .eq('id', session.user.id)
        .single();
      
      if (!error && data) {
        console.log("Premium status fetched:", data.is_paying_customer);
        setIsPayingCustomer(data.is_paying_customer);
        
        if (data.is_paying_customer) {
          toast({
            title: "Premium Status Active",
            description: "You have access to all premium features",
          });
        }
      } else {
        console.error("Error fetching premium status:", error);
      }
    };

    checkPayingCustomerStatus();

    // Subscribe to real-time changes on the profiles table
    const channel = supabase
      .channel('profile-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${session?.user?.id}`,
        },
        (payload) => {
          console.log("Profile updated:", payload);
          const newPremiumStatus = payload.new.is_paying_customer;
          setIsPayingCustomer(newPremiumStatus);
          
          if (newPremiumStatus) {
            toast({
              title: "Premium Status Updated",
              description: "Your account has been upgraded to premium!",
            });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session?.user?.id, toast]);

  return (
    <MainLayout>
      <HomeLayout>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <MainFeed
            isPayingCustomer={isPayingCustomer}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onFileSelect={setSelectedFiles}
            onOpenGoLive={() => setIsGoLiveOpen(true)}
          />
          <RightSidebar />
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
      </HomeLayout>
    </MainLayout>
  );
};

export default Home;