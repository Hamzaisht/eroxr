import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { MainFeed } from "@/components/home/MainFeed";
import { RightSidebar } from "@/components/home/RightSidebar";
import { HomeLayout } from "@/components/home/HomeLayout";

const Index = () => {
  const session = useSession();
  const [isPayingCustomer, setIsPayingCustomer] = useState<boolean | null>(null);

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

  if (!session) return null;

  return (
    <HomeLayout>
      <div className="w-full max-w-[2000px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          <MainFeed 
            userId={session.user.id}
            isPayingCustomer={isPayingCustomer}
            onOpenCreatePost={() => {}}
            onFileSelect={() => {}}
            onOpenGoLive={() => {}}
          />
          <RightSidebar />
        </div>
      </div>
    </HomeLayout>
  );
};

export default Index;