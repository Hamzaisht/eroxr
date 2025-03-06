
import { useState, useEffect } from "react";
import { VideoProfileCarousel } from "@/components/ads/VideoProfileCarousel";
import { AdFilters } from "@/components/ads/AdFilters";
import { useAdsQuery } from "@/components/ads/useAdsQuery";
import { FilterOptions, SearchCategory } from "@/components/ads/types/dating";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import { CreateBodyContactDialog } from "@/components/ads/CreateBodyContactDialog";
import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const { data: ads, isLoading, refetch } = useAdsQuery();

  // Handle view count tracking
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Track view for analytics
        if (session?.user) {
          await supabase.from('user_analytics').insert({
            user_id: session.user.id,
            page: 'dating',
            timestamp: new Date().toISOString(),
          }).select();
        }
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };
    
    trackPageView();
  }, [session]);

  const searchCategories: SearchCategory[] = [
    { seeker: "couple", looking_for: "female" },
    { seeker: "couple", looking_for: "male" },
    { seeker: "couple", looking_for: "couple" },
    { seeker: "female", looking_for: "male" },
    { seeker: "female", looking_for: "female" },
    { seeker: "female", looking_for: "couple" },
    { seeker: "male", looking_for: "female" },
    { seeker: "male", looking_for: "male" },
    { seeker: "male", looking_for: "couple" },
    { seeker: "any", looking_for: "any" }, // A4A - Anyone for Anyone
    { seeker: "couple", looking_for: "couple" }, // MF4MF - Couple for Couple
  ];

  // Check user verification/subscription status
  const { data: userProfile, isLoading: isProfileLoading } = 
    session?.user ? 
      // @ts-ignore - We know this might be undefined
      useQuery({
        queryKey: ['user-profile', session?.user?.id],
        queryFn: async () => {
          if (!session?.user?.id) return null;
          
          const { data, error } = await supabase
            .from('profiles')
            .select('is_paying_customer, id_verification_status')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          return data;
        },
        enabled: !!session?.user?.id,
      }) : { data: null, isLoading: false };

  const canAccessBodyContact = userProfile?.is_paying_customer || userProfile?.id_verification_status === 'verified';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  // Handler to refresh ads after creating a new one
  const handleAdCreationSuccess = () => {
    refetch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to">
      <div className="container-fluid px-4 py-8 max-w-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-neon-glow opacity-20 blur-xl"></div>
            <div className="relative glass-effect p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                    Discover Connections
                  </h1>
                  <p className="text-luxury-neutral text-lg">
                    Find your perfect match through authentic video profiles
                  </p>
                </div>
                <div className="flex gap-3">
                  {!session?.user ? (
                    <Button 
                      onClick={() => navigate('/login')}
                      className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
                    >
                      Login to Create
                    </Button>
                  ) : !canAccessBodyContact ? (
                    <Button 
                      onClick={() => navigate('/subscription')}
                      className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
                    >
                      Upgrade to Create
                    </Button>
                  ) : (
                    <CreateBodyContactDialog onSuccess={handleAdCreationSuccess} />
                  )}
                  <NewMessageDialog 
                    open={isNewMessageOpen} 
                    onOpenChange={setIsNewMessageOpen} 
                    onSelectUser={() => {}} 
                  />
                </div>
              </div>
            </div>
          </div>

          {!session?.user && (
            <Alert className="bg-luxury-dark/70 backdrop-blur-sm border-luxury-primary/20">
              <Info className="h-4 w-4 text-luxury-primary" />
              <AlertDescription className="text-luxury-neutral">
                Sign in to create your own profile and connect with others
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-80 flex-shrink-0"
            >
              <AdFilters
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedSeeker={selectedSeeker}
                selectedLookingFor={selectedLookingFor}
                setSelectedSeeker={setSelectedSeeker}
                setSelectedLookingFor={setSelectedLookingFor}
                searchCategories={searchCategories}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                countries={["denmark", "finland", "iceland", "norway", "sweden"]}
              />
            </motion.div>

            {/* Main Content - Video Profile Carousel */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1"
            >
              {ads && ads.length > 0 ? (
                <VideoProfileCarousel ads={ads} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] glass-effect rounded-2xl p-8 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-luxury-primary animate-pulse" />
                  <h3 className="text-2xl font-semibold text-white">No Profiles Found</h3>
                  <p className="text-luxury-neutral max-w-md">
                    {session?.user 
                      ? canAccessBodyContact 
                        ? "Be the first to create a profile in this category and start connecting with others" 
                        : "Upgrade to a paying account to create your profile and connect with others"
                      : "Sign in to see more profiles or create your own"
                    }
                  </p>
                  {session?.user ? (
                    canAccessBodyContact ? (
                      <CreateBodyContactDialog onSuccess={handleAdCreationSuccess} />
                    ) : (
                      <Button 
                        onClick={() => navigate('/subscription')}
                        className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
                      >
                        Upgrade Now
                      </Button>
                    )
                  ) : (
                    <Button 
                      onClick={() => navigate('/login')}
                      className="bg-gradient-to-r from-luxury-primary to-luxury-accent text-white"
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
