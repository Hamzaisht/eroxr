
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { DatingAd } from "@/components/ads/types/dating";
import { VideoProfileCarousel } from "@/components/ads/video-profile-carousel/VideoProfileCarousel";
import { useToast } from "@/hooks/use-toast";
import { DatingContent } from "@/components/dating/DatingContent";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Loader2, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateBodyContactDialog } from "@/components/ads/body-contact";
import { HomeLayout } from "@/components/home/HomeLayout";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingFilterSidebar } from "@/components/dating/DatingFilterSidebar";
import { MobileFilterToggle } from "@/components/dating/MobileFilterToggle";
import { FilterOptions } from "@/components/ads/types/dating";
import { Button } from "@/components/ui/button";
import { useInView } from "react-intersection-observer";
import { type Database } from "@/integrations/supabase/types";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { transformRawAds } from "@/components/ads/utils/adTransformers";
import { nordicCountries } from "@/components/dating/utils/datingUtils";

type NordicCountry = Database['public']['Enums']['nordic_country'];

const Dating = () => {
  const [datingAds, setDatingAds] = useState<DatingAd[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<DatingAd | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  
  // App state
  const [activeTab, setActiveTab] = useState<string>("browse");
  
  // Filtering states
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(window.innerWidth < 1024);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minAge: 18,
    maxAge: 80,
    minDistance: 0,
    maxDistance: 100,
    verifiedOnly: false,
    premiumOnly: false,
    keyword: "",
    username: "",
  });
  
  // UI states
  const [isNewMessageOpen, setIsNewMessageOpen] = useState<boolean>(false);
  const { ref: headerRef, inView: headerInView } = useInView({
    threshold: 0
  });
  
  // Default search categories
  const defaultSearchCategories = [
    { seeker: "male", lookingFor: "female", label: "Men seeking Women" },
    { seeker: "female", lookingFor: "male", label: "Women seeking Men" },
    { seeker: "couple", lookingFor: "female", label: "Couples seeking Women" },
    { seeker: "couple", lookingFor: "male", label: "Couples seeking Men" },
    { seeker: "female", lookingFor: "couple", label: "Women seeking Couples" },
    { seeker: "male", lookingFor: "couple", label: "Men seeking Couples" },
    { seeker: "female", lookingFor: "female", label: "Women seeking Women" },
    { seeker: "male", lookingFor: "male", label: "Men seeking Men" },
    { seeker: "any", lookingFor: "any", label: "Open to All" },
    { seeker: "verified", lookingFor: "any", label: "Verified Profiles" },
    { seeker: "premium", lookingFor: "any", label: "Premium Profiles" },
  ];
  
  // Use our AdsQuery hook for better performance
  const { 
    data: queryAds, 
    isLoading: queryLoading, 
    error: queryError 
  } = useAdsQuery({
    verifiedOnly: filterOptions.verifiedOnly,
    premiumOnly: filterOptions.premiumOnly,
    filterOptions: {
      ...filterOptions,
      country: selectedCountry,
      city: selectedCity,
      relationship_status: selectedSeeker,
      looking_for: selectedLookingFor ? [selectedLookingFor] : undefined,
      tags: selectedTag ? [selectedTag] : undefined
    }
  });
  
  // Update ads from query
  useEffect(() => {
    if (queryAds) {
      setDatingAds(queryAds);
      setIsLoading(false);
    } else if (queryError) {
      console.error("Error fetching ads:", queryError);
      toast({
        title: "Failed to load profiles",
        description: "Please try again later",
        variant: "destructive"
      });
      setIsLoading(false);
    } else {
      setIsLoading(queryLoading);
    }
  }, [queryAds, queryLoading, queryError, toast]);
  
  // Get user's own profile if they have one
  useEffect(() => {
    if (!session?.user?.id) {
      setUserProfile(null);
      return;
    }
    
    async function fetchUserProfile() {
      try {
        const { data, error } = await supabase
          .from("dating_ads")
          .select("*")
          .eq("user_id", session.user.id)
          .limit(1)
          .single();
          
        if (error) {
          console.error("Error fetching user profile:", error);
          return;
        }
        
        if (data) {
          setUserProfile(transformRawAds([data])[0]);
        }
      } catch (err) {
        console.error("Exception fetching user profile:", err);
      }
    }
    
    fetchUserProfile();
  }, [session]);

  const handleAdCreationSuccess = () => {
    toast({
      title: "Profile created successfully!",
      description: "Your profile is now visible to others.",
      variant: "default"
    });
    
    // Refetch the user's profile
    if (session?.user?.id) {
      supabase
        .from("dating_ads")
        .select("*")
        .eq("user_id", session.user.id)
        .limit(1)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            setUserProfile(transformRawAds([data])[0]);
          }
        });
    }
  };
  
  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    
    // If on mobile, collapse filters
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    toast({
      title: `Filtering by: ${tag}`,
      description: "Showing profiles matching this tag",
      duration: 2000,
    });
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setSelectedCountry(null);
    setSelectedCity(null);
    setSelectedSeeker(null);
    setSelectedLookingFor(null);
    setSelectedTag(null);
    setFilterOptions({
      minAge: 18,
      maxAge: 80,
      minDistance: 0,
      maxDistance: 100,
      verifiedOnly: false,
      premiumOnly: false,
      keyword: "",
      username: "",
    });
    
    toast({
      title: "Filters reset",
      description: "Showing all profiles",
      duration: 2000,
    });
  };

  // Real-time presence tracking
  useEffect(() => {
    if (!session) return;

    // Set user as online
    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state updated:', state);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString()
          });
        }
      });

    // Update the user's last_active in their dating profile
    if (session.user.id && userProfile) {
      supabase
        .from('dating_ads')
        .update({ last_active: new Date().toISOString() })
        .eq('user_id', session.user.id)
        .then(({ error }) => {
          if (error) console.error('Error updating last_active:', error);
        });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, userProfile]);

  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  return (
    <HomeLayout>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pt-16 pb-20"
      >
        <div className="container mx-auto px-4">
          <div ref={headerRef}>
            <DatingHeader 
              isNewMessageOpen={isNewMessageOpen}
              setIsNewMessageOpen={setIsNewMessageOpen}
              canAccessBodyContact={true}
              onAdCreationSuccess={handleAdCreationSuccess}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            
            <div className="mt-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Body Dating</h2>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-primary hover:bg-luxury-primary/10"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
                <MobileFilterToggle 
                  showFilters={showFilters} 
                  setShowFilters={setShowFilters} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            <DatingFilterSidebar
              isFilterCollapsed={isFilterCollapsed}
              setIsFilterCollapsed={setIsFilterCollapsed}
              showFilters={showFilters}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              selectedSeeker={selectedSeeker}
              selectedLookingFor={selectedLookingFor}
              setSelectedSeeker={setSelectedSeeker}
              setSelectedLookingFor={setSelectedLookingFor}
              filterOptions={filterOptions}
              setFilterOptions={setFilterOptions}
              defaultSearchCategories={defaultSearchCategories}
              nordicCountries={nordicCountries as NordicCountry[]}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />
            
            <div className="flex-1">
              {datingAds && datingAds.length > 0 && !headerInView && (
                <DatingHeader 
                  isNewMessageOpen={isNewMessageOpen}
                  setIsNewMessageOpen={setIsNewMessageOpen}
                  canAccessBodyContact={true}
                  onAdCreationSuccess={handleAdCreationSuccess}
                  isSticky={true}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              )}
              
              {datingAds && datingAds.length > 0 && activeTab === "browse" ? (
                <div className="grid grid-cols-1 gap-8">
                  <div className="relative">
                    <VideoProfileCarousel ads={datingAds} />
                  </div>
                  <DatingContent 
                    ads={datingAds} 
                    canAccessBodyContact={true}
                    onAdCreationSuccess={handleAdCreationSuccess}
                    onTagClick={handleTagClick}
                    isLoading={isLoading}
                    userProfile={userProfile}
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                  />
                </div>
              ) : (
                <DatingContent 
                  ads={datingAds} 
                  canAccessBodyContact={true}
                  onAdCreationSuccess={handleAdCreationSuccess}
                  onTagClick={handleTagClick}
                  isLoading={isLoading}
                  userProfile={userProfile}
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />
              )}
            </div>
          </div>
        </div>
      </motion.main>
      <Footer />
    </HomeLayout>
  );
};

export default Dating;
