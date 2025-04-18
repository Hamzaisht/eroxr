
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { DatingAd } from "@/components/ads/types/dating";
import { VideoProfileCarousel } from "@/components/ads/video-profile-carousel/VideoProfileCarousel";
import { useToast } from "@/hooks/use-toast";
import { DatingContent } from "@/components/dating/DatingContent";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"; 
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dating = () => {
  const [activeView, setActiveView] = useState<"browse" | "create">("browse");
  const [datingAds, setDatingAds] = useState<DatingAd[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  
  // Fetch dating ads
  useEffect(() => {
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

    fetchDatingAds();
  }, [toast]);

  const handleAdCreationSuccess = () => {
    // Refresh the dating ads
    setActiveView("browse");
    
    toast({
      title: "Profile created successfully!",
      description: "Your profile is now visible to others.",
      variant: "default"
    });
    
    // Refetch the ads
    fetchDatingAds();
  };

  const fetchDatingAds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("dating_ads")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setDatingAds(data || []);
    } catch (err) {
      console.error("Error refreshing dating ads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-dark">
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
            
            <Button 
              variant="outline" 
              onClick={() => setActiveView(activeView === "browse" ? "create" : "browse")}
              className="border-luxury-primary text-luxury-primary hover:bg-luxury-primary/20"
            >
              {activeView === "browse" ? (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Profile
                </>
              ) : (
                "Browse Profiles"
              )}
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-luxury-primary" />
            </div>
          ) : (
            <>
              {activeView === "browse" ? (
                datingAds && datingAds.length > 0 ? (
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
                )
              ) : (
                <div className="bg-luxury-darker/40 rounded-lg p-6 shadow-lg">
                  <h2 className="text-2xl font-semibold text-luxury-neutral mb-4">Create your profile</h2>
                  <p className="text-luxury-neutral mb-8">
                    Fill out the form below to create your dating profile. This feature is coming soon.
                  </p>
                  
                  <Button 
                    onClick={() => setActiveView("browse")}
                    variant="default"
                  >
                    Back to Browsing
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default Dating;
