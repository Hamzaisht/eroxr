import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { useToast } from "@/hooks/use-toast";
import { useMediaQuery } from "@/hooks/use-mobile";

const Index = () => {
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const checkPayingCustomerStatus = async () => {
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_paying_customer')
        .eq('id', session.user.id)
        .single();
      
      if (!error && data) {
        setIsPayingCustomer(data.is_paying_customer);
      }
    };

    checkPayingCustomerStatus();
  }, [session?.user?.id]);

  // Add console log to debug rendering
  console.log("Index component rendering", { session, isPayingCustomer });

  if (!session) {
    console.log("No session, returning null");
    return null;
  }

  return (
    <div className="relative w-full min-h-screen">
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
    </div>
  );
};

export default Index;