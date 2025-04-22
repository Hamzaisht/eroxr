
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { DatingAd } from "@/components/ads/types/dating";
import { VideoProfileCarousel } from "@/components/ads/video-profile-carousel/VideoProfileCarousel";
import { useToast } from "@/hooks/use-toast";
import { DatingContent } from "@/components/dating/DatingContent";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateBodyContactDialog } from "@/components/ads/body-contact";
import { HomeLayout } from "@/components/home/HomeLayout";

const Dating = () => {
  const [datingAds, setDatingAds] = useState<DatingAd[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  
  // Fetch dating ads
  useEffect(() => {
    fetchDatingAds();
  }, []);

  const fetchDatingAds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("dating_ads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching dating ads:", error);
        toast({
          title: "Failed to load profiles",
          description: "Please try again later",
          variant: "destructive"
        });
        setDatingAds([]);
      } else {
        console.log("Dating ads loaded:", data.length);
        setDatingAds(data);
      }
    } catch (err) {
      console.error("Exception fetching dating ads:", err);
      toast({
        title: "Error loading profiles",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      setDatingAds([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdCreationSuccess = () => {
    toast({
      title: "Profile created successfully!",
      description: "Your profile is now visible to others.",
      variant: "default"
    });
    
    // Refetch the ads
    fetchDatingAds();
  };

  return (
    <HomeLayout>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-20"
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-luxury-neutral">
              Body Dating
            </h1>
            
            <CreateBodyContactDialog onSuccess={handleAdCreationSuccess} />
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
            </div>
          ) : (
            <>
              {datingAds && datingAds.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  <div className="relative">
                    <VideoProfileCarousel ads={datingAds} />
                  </div>
                  <DatingContent 
                    ads={datingAds} 
                    canAccessBodyContact={true}
                    onAdCreationSuccess={handleAdCreationSuccess}
                    isLoading={isLoading}
                  />
                </div>
              ) : (
                <DatingContent 
                  ads={[]}
                  canAccessBodyContact={true}
                  onAdCreationSuccess={handleAdCreationSuccess}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </div>
      </motion.main>
      <Footer />
    </HomeLayout>
  );
};

export default Dating;
