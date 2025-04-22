
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

type NordicCountry = Database['public']['Enums']['nordic_country'];

const Dating = () => {
  const [datingAds, setDatingAds] = useState<DatingAd[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  
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
  ];
  
  // Nordic countries list
  const nordicCountries = ["denmark", "finland", "iceland", "norway", "sweden"];
  
  // Fetch dating ads
  useEffect(() => {
    fetchDatingAds();
  }, [selectedCountry, selectedCity, selectedSeeker, selectedLookingFor, selectedTag, filterOptions]);

  const fetchDatingAds = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("dating_ads")
        .select("*")
        .order("created_at", { ascending: false });
      
      // Apply filters
      if (selectedCountry) {
        query = query.eq("country", selectedCountry);
      }
      
      if (selectedCity) {
        query = query.eq("city", selectedCity);
      }
      
      if (selectedSeeker) {
        query = query.eq("relationship_status", selectedSeeker);
      }
      
      if (selectedLookingFor) {
        query = query.contains("looking_for", [selectedLookingFor]);
      }
      
      if (selectedTag) {
        query = query.contains("tags", [selectedTag]);
      }
      
      if (filterOptions.verifiedOnly) {
        query = query.eq("is_verified", true);
      }
      
      if (filterOptions.premiumOnly) {
        query = query.eq("is_premium", true);
      }
      
      if (filterOptions.minAge || filterOptions.maxAge) {
        // Note: This is a simplified approach. In a real app, you would use a more complex query
        if (filterOptions.minAge) {
          query = query.gte("age_range->>lower", filterOptions.minAge);
        }
        
        if (filterOptions.maxAge) {
          query = query.lte("age_range->>upper", filterOptions.maxAge);
        }
      }
      
      if (filterOptions.keyword) {
        query = query.or(`title.ilike.%${filterOptions.keyword}%,description.ilike.%${filterOptions.keyword}%`);
      }
      
      if (filterOptions.username) {
        // This would typically join with a users table, simplified here
        query = query.ilike("user_id", `%${filterOptions.username}%`);
      }
      
      const { data, error } = await query;
      
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
                />
              )}
              
              {datingAds && datingAds.length > 0 ? (
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
                  />
                </div>
              ) : (
                <DatingContent 
                  ads={[]}
                  canAccessBodyContact={true}
                  onAdCreationSuccess={handleAdCreationSuccess}
                  onTagClick={handleTagClick}
                  isLoading={isLoading}
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
