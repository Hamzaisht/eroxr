
import { useState, useEffect, useMemo } from "react";
import { DatingFiltersPanel } from "../components/dating/DatingFiltersPanel";
import { DatingContent } from "../components/dating/DatingContent";
import { DatingHeader } from "../components/dating/DatingHeader";
import { CreateAdDialog } from "../components/ads/create-ad";
import { DatingAd } from "@/types/dating";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface DatingFiltersPanelProps {
  // Define all required props to match what's being passed
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (collapsed: boolean) => void;
  showFilters: boolean;
  selectedCountry: "denmark" | "finland" | "iceland" | "norway" | "sweden";
  setSelectedCountry: (country: "denmark" | "finland" | "iceland" | "norway" | "sweden") => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;
  minAge: number;
  setMinAge: (age: number) => void;
  maxAge: number;
  setMaxAge: (age: number) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedLookingFor: string[];
  setSelectedLookingFor: (lookingFor: string[]) => void;
  isFilterApplied: boolean;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  selectedCity?: string;
  setSelectedCity?: (city: string) => void;
  selectedVerified: boolean;
  setSelectedVerified: (verified: boolean) => void;
  selectedPremium: boolean;
  setSelectedPremium: (premium: boolean) => void;
  distanceRange: [number, number];
  setDistanceRange: (range: [number, number]) => void;
}

export interface DatingContentProps {
  datingAds: DatingAd[];
  isLoading: boolean;
  activeTab: string;
  userProfile: DatingAd | null;
  handleAdCreationSuccess: () => void;
  handleTagClick: (tag: string) => void;
  handleTabChange: (tab: string) => void;
  handleFilterToggle: () => void;
}

export default function DatingMainContent(props: any) {
  const [datingAds, setDatingAds] = useState<DatingAd[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("browse");
  const [userProfile, setUserProfile] = useState<DatingAd | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<"denmark" | "finland" | "iceland" | "norway" | "sweden">("denmark");
  const [selectedGender, setSelectedGender] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);
  const [selectedVerified, setSelectedVerified] = useState(false);
  const [selectedPremium, setSelectedPremium] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 100]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateAdDialog, setShowCreateAdDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDatingAds();
    
    // Set up real-time subscription for instant updates
    const channel = supabase
      .channel('dating_ads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dating_ads'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          // Refetch data immediately when any change occurs
          fetchDatingAds();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedTab, isFilterApplied]);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchDatingAds = async () => {
    setIsLoading(true);
    try {
      const { data: ads, error } = await supabase
        .from('dating_ads')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      // Transform the data to match the DatingAd interface with better performance
      const transformedAds = ads?.map(ad => ({
        id: ad.id,
        user_id: ad.user_id,
        title: ad.title,
        description: ad.description,
        username: ad.title || `User${ad.user_id?.slice(-4)}`,
        avatarUrl: ad.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(ad.title || 'User')}&backgroundColor=6366f1`,
        videoUrl: ad.video_url,
        video_url: ad.video_url,
        avatar_url: ad.avatar_url,
        isVerified: ad.is_verified || false,
        isPremium: ad.is_premium || false,
        is_verified: ad.is_verified || false,
        is_premium: ad.is_premium || false,
        views: ad.view_count || 0,
        view_count: ad.view_count || 0,
        tags: ad.tags || [],
        location: ad.city,
        age: ad.age_range ? parseInt(ad.age_range.split(',')[0].replace('[', '')) : 25,
        gender: ad.user_type,
        seeking: ad.looking_for || [],
        looking_for: ad.looking_for || [],
        country: ad.country,
        city: ad.city,
        created_at: ad.created_at,
        last_active: ad.last_active,
      })) || [];

      setDatingAds(transformedAds);
    } catch (error) {
      console.error("Failed to fetch dating ads:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dating ads",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      // Simulate fetching user profile from an API
      const profile = await simulateUserProfileApiCall();
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user profile",
        variant: "destructive",
      });
    }
  };

  const handleTagClick = (tag: string) => {
    console.log("Tag clicked:", tag);
    setSelectedTag(selectedTag === tag ? null : tag);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = () => {
    setIsFilterApplied(!isFilterApplied);
    setIsFilterCollapsed(true);
    toast({
      title: "Filters Applied",
      description: "Your search filters have been updated",
    });
  };

  const handleResetFilters = () => {
    setSelectedGender("");
    setMinAge(18);
    setMaxAge(60);
    setSelectedTags([]);
    setSelectedLookingFor([]);
    setIsFilterApplied(false);
    setIsFilterCollapsed(false);
    setSelectedCity(undefined);
    setSelectedVerified(false);
    setSelectedPremium(false);
    setSelectedTag(null);
    setDistanceRange([0, 100]);
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared",
    });
  };

  const handleCreateAd = () => {
    setShowCreateAdDialog(true);
  };

  const handleAdCreationSuccess = () => {
    setShowCreateAdDialog(false);
    // Instant refresh for new ads
    fetchDatingAds();
    toast({
      title: "Success!",
      description: "Your dating ad has been created and is now live!",
    });
  };

  const filteredAds = useMemo(() => {
    return datingAds.filter((ad) => {
      if (selectedGender && ad.gender !== selectedGender) {
        return false;
      }
      if (ad.age < minAge || ad.age > maxAge) {
        return false;
      }
      if (selectedLookingFor.length > 0 && !selectedLookingFor.every((item) => ad.seeking?.includes(item))) {
        return false;
      }
      if (selectedTag && !ad.tags?.includes(selectedTag)) {
        return false;
      }
      if (selectedCity && ad.city !== selectedCity) {
        return false;
      }
      if (selectedVerified && !ad.isVerified) {
        return false;
      }
      if (selectedPremium && !ad.isPremium) {
        return false;
      }
      return true;
    });
  }, [datingAds, selectedGender, minAge, maxAge, selectedLookingFor, selectedTag, selectedCity, selectedVerified, selectedPremium]);


  // Simulate API call for user profile
  const simulateUserProfileApiCall = (): Promise<DatingAd> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile: DatingAd = {
          id: "4",
          user_id: "104",
          title: "Your profile",
          description: "This is your profile. Update it now!",
          username: "YourName",
          avatarUrl: "https://source.unsplash.com/random/53x53",
          videoUrl: "https://sample-videos.com/video123.mp4",
          isVerified: false,
          isPremium: false,
          views: 0,
          tags: [],
          location: "Helsinki",
          age: 22,
          gender: "male",
          seeking: ["female"],
          country: "finland",
          city: "Helsinki",
        };
        resolve(profile);
      }, 300);
    });
  };

  return (
    <div className="container mx-auto py-6">
      {/* Header with tabs and create button */}
      <DatingHeader 
        activeTab={selectedTab}
        onTabChange={setSelectedTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onCreateAd={handleCreateAd}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Section */}
        <div className="lg:col-span-1">
          <DatingFiltersPanel
            isFilterCollapsed={props.isFilterCollapsed || isFilterCollapsed}
            setIsFilterCollapsed={props.setIsFilterCollapsed || setIsFilterCollapsed}
            showFilters={props.showFilters || showFilters}
            selectedCountry={props.selectedCountry || selectedCountry}
            setSelectedCountry={props.setSelectedCountry || setSelectedCountry}
            selectedGender={props.selectedGender || selectedGender}
            setSelectedGender={props.setSelectedGender || setSelectedGender}
            minAge={props.minAge || minAge}
            setMinAge={props.setMinAge || setMinAge}
            maxAge={props.maxAge || maxAge}
            setMaxAge={props.setMaxAge || setMaxAge}
            selectedTag={props.selectedTag || selectedTag}
            setSelectedTag={props.setSelectedTag || setSelectedTag}
            selectedLookingFor={props.selectedLookingFor || selectedLookingFor}
            setSelectedLookingFor={props.setSelectedLookingFor || setSelectedLookingFor}
            isFilterApplied={props.isFilterApplied || isFilterApplied}
            handleApplyFilters={props.handleApplyFilters || handleApplyFilters}
            handleResetFilters={props.handleResetFilters || handleResetFilters}
            selectedCity={props.selectedCity || selectedCity}
            setSelectedCity={props.setSelectedCity || setSelectedCity}
            selectedVerified={props.selectedVerified || selectedVerified}
            setSelectedVerified={props.setSelectedVerified || setSelectedVerified}
            selectedPremium={props.selectedPremium || selectedPremium}
            setSelectedPremium={props.setSelectedPremium || setSelectedPremium}
            distanceRange={props.distanceRange || distanceRange}
            setDistanceRange={props.setDistanceRange || setDistanceRange}
          />
        </div>
        
        {/* Content Section */}
        <div className="lg:col-span-3">
          <DatingContent 
            datingAds={props.datingAds || filteredAds || []}
            isLoading={props.isLoading || isLoading}
            activeTab={props.activeTab || selectedTab}
            userProfile={props.userProfile || userProfile}
            handleAdCreationSuccess={props.handleAdCreationSuccess || handleAdCreationSuccess}
            handleTagClick={props.handleTagClick || handleTagClick}
            handleTabChange={props.setActiveTab || setSelectedTab}
            handleFilterToggle={props.handleFilterToggle || toggleFilters}
          />
        </div>
      </div>

      {/* Create Ad Dialog - NEW FUTURISTIC VERSION */}
      <CreateAdDialog 
        open={showCreateAdDialog}
        onOpenChange={setShowCreateAdDialog}
        onSuccess={handleAdCreationSuccess}
      />
    </div>
  );
}
