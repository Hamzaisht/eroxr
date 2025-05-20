import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { DatingAd } from "@/components/ads/types/dating";
import { DatingContentController } from "./DatingContentController";
import { DatingFilterSidebar } from "./DatingFilterSidebar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { CreateDatingAdDialog } from "@/components/ads/dating/CreateDatingAdDialog";
import { supabase } from "@/integrations/supabase/client";

export function DatingResults() {
  const [ads, setAds] = useState<DatingAd[]>([]);
  const [filteredAds, setFilteredAds] = useState<DatingAd[] | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<DatingAd | null>(null);
  const [canAccessBodyContact, setCanAccessBodyContact] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");
  const [isCreateAdDialogOpen, setIsCreateAdDialogOpen] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Load ads and user profile on mount
  useEffect(() => {
    loadAds();
    loadUserProfile();
    checkBodyContactAccess();
  }, [session?.user?.id]);

  // Load ads from Supabase
  const loadAds = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('dating_ads')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error("Error loading ads:", error);
        toast({
          title: "Error loading ads",
          description: "Failed to load dating ads. Please try again.",
          variant: "destructive",
        });
      } else {
        setAds(data || []);
        setFilteredAds(data || null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load user profile from Supabase
  const loadUserProfile = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('dating_ads')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error("Error loading user profile:", error);
        toast({
          title: "Error loading profile",
          description: "Failed to load your profile. Please try again.",
          variant: "destructive",
        });
      } else {
        setUserProfile(data || null);
      }
    } catch (error) {
      console.error("Unexpected error loading user profile:", error);
      toast({
        title: "Unexpected error",
        description: "An unexpected error occurred while loading your profile.",
        variant: "destructive",
      });
    }
  };

  // Check if user has access to body contact content
  const checkBodyContactAccess = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('can_access_bodycontact')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error checking body contact access:", error);
      } else {
        setCanAccessBodyContact(data?.can_access_bodycontact || false);
      }
    } catch (error) {
      console.error("Unexpected error checking body contact access:", error);
    }
  };

  // Handle ad creation success
  const handleAdCreationSuccess = useCallback(() => {
    loadAds();
    loadUserProfile();
    setIsCreateAdDialogOpen(false);
    toast({
      title: "Ad created",
      description: "Your dating ad has been created successfully.",
    });
  }, [loadAds, loadUserProfile, toast]);

  // Handle tag click
  const handleTagClick = (tag: string) => {
    setSearchParams({ tag });
  };

  // Handle filter toggle
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Filter Sidebar */}
      <DatingFilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        ads={ads}
        onFilter={setFilteredAds}
      />

      {/* Content Area */}
      <div className="flex-1 p-4 space-y-4">
        {/* Create Ad Button */}
        {session && userProfile === null && (
          <Button
            onClick={() => setIsCreateAdDialogOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Dating Ad
          </Button>
        )}

        {/* Dating Content Controller */}
        {filteredAds && userProfile && (
          <DatingContentController
            ads={filteredAds}
            canAccessBodyContact={canAccessBodyContact}
            onAdCreationSuccess={handleAdCreationSuccess}
            onTagClick={handleTagClick}
            isLoading={isLoading}
            userProfile={userProfile}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onFilterToggle={handleFilterToggle}
          />
        )}
      </div>

      {/* Create Ad Dialog */}
      <CreateDatingAdDialog
        open={isCreateAdDialogOpen}
        onOpenChange={setIsCreateAdDialogOpen}
        onAdCreationSuccess={handleAdCreationSuccess}
      />
    </div>
  );
}
