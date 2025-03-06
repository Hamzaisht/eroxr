import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { FilterOptions, SearchCategory } from "@/components/ads/types/dating";
import { AdFilters } from "@/components/ads/AdFilters";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingContent } from "@/components/dating/DatingContent";
import { useUserProfile } from "@/components/dating/hooks/useUserProfile";
import { useViewTracking } from "@/components/dating/hooks/useViewTracking";
import { useLocation, useNavigate } from "react-router-dom";
import { Award, ArrowRight, Clock, CheckCircle, Users, Shield, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minAge: 18,
    maxAge: 99,
    maxDistance: 50
  });
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800);

  const location = useLocation();
  const navigate = useNavigate();

  useViewTracking();

  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  
  const isVerified = userProfile?.id_verification_status === 'verified';
  const isPremium = userProfile?.is_paying_customer;
  const canAccessFullFeatures = isVerified || isPremium;

  const { data: ads, isLoading, refetch } = useAdsQuery({
    skipModeration: true,
    includeMyPendingAds: true,
    filterOptions,
    tagFilter: selectedTag,
    verifiedOnly: selectedSeeker === 'verified',
    premiumOnly: selectedSeeker === 'premium'
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get('tag');
    const seekerParam = params.get('seeker');
    const lookingForParam = params.get('looking_for');
    
    if (tagParam) {
      setSelectedTag(tagParam);
    }
    
    if (seekerParam && lookingForParam) {
      setSelectedSeeker(seekerParam);
      setSelectedLookingFor(lookingForParam);
    } else if (seekerParam && shortcutMap[seekerParam.toUpperCase()]) {
      const { seeker, looking_for } = shortcutMap[seekerParam.toUpperCase()];
      setSelectedSeeker(seeker);
      setSelectedLookingFor(looking_for);
    }
  }, [location.search]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(location.search);
    params.set('tag', tag);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const searchCategories: SearchCategory[] = [
    { seeker: "couple", looking_for: "female" },
    { seeker: "couple", looking_for: "male" },
    { seeker: "couple", looking_for: "couple" },
    { seeker: "couple", looking_for: "trans" },
    { seeker: "couple", looking_for: "any" },
    
    { seeker: "female", looking_for: "male" },
    { seeker: "female", looking_for: "female" },
    { seeker: "female", looking_for: "couple" },
    { seeker: "female", looking_for: "trans" },
    { seeker: "female", looking_for: "any" },
    
    { seeker: "male", looking_for: "female" },
    { seeker: "male", looking_for: "male" },
    { seeker: "male", looking_for: "couple" },
    { seeker: "male", looking_for: "trans" },
    { seeker: "male", looking_for: "any" },
    
    { seeker: "verified", looking_for: "any" },
    { seeker: "premium", looking_for: "any" },
  ];

  const canAccessBodyContact = isVerified || isPremium;

  const handleAdCreationSuccess = () => {
    refetch();
  };

  const handleSubscriptionClick = () => {
    setShowSubscriptionDialog(true);
    setTimeRemaining(1800);
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  const shortcutMap = {
    "MF4A": { seeker: "couple", looking_for: "any" },
    "MF4F": { seeker: "couple", looking_for: "female" },
    "MF4M": { seeker: "couple", looking_for: "male" },
    "MF4MF": { seeker: "couple", looking_for: "couple" },
    "MF4T": { seeker: "couple", looking_for: "trans" },
    
    "F4A": { seeker: "female", looking_for: "any" },
    "F4M": { seeker: "female", looking_for: "male" },
    "F4F": { seeker: "female", looking_for: "female" },
    "F4MF": { seeker: "female", looking_for: "couple" },
    "F4T": { seeker: "female", looking_for: "trans" },
    
    "M4A": { seeker: "male", looking_for: "any" },
    "M4F": { seeker: "male", looking_for: "female" },
    "M4M": { seeker: "male", looking_for: "male" },
    "M4MF": { seeker: "male", looking_for: "couple" },
    "M4T": { seeker: "male", looking_for: "trans" }
  };

  useEffect(() => {
    if (!showSubscriptionDialog) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [showSubscriptionDialog]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          <DatingHeader 
            isNewMessageOpen={isNewMessageOpen}
            setIsNewMessageOpen={setIsNewMessageOpen}
            canAccessBodyContact={!!canAccessBodyContact}
            onAdCreationSuccess={handleAdCreationSuccess}
          />

          {!canAccessFullFeatures && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-gradient-to-r from-purple-500/30 to-purple-700/30 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center shadow-lg border border-purple-500/30"
            >
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <div className="bg-purple-600/20 p-3 rounded-full">
                  <Award className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-white mb-1">Get Access Now – 59 SEK/month</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-luxury-neutral flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-400" /> Cancel anytime, instant access
                    </p>
                    <p className="text-sm text-luxury-neutral flex items-center gap-1">
                      <Users className="h-3 w-3 text-green-400" /> 
                      <span>Over 1,000 users subscribed this week!</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-md text-lg font-medium flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg"
                  onClick={handleSubscriptionClick}
                >
                  Unlock BD Ads <ArrowRight className="h-5 w-5 ml-1" />
                </motion.button>
                <div className="text-xs text-center text-luxury-neutral/70 flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" /> Limited-time offer
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
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
                selectedTag={selectedTag}
                setSelectedTag={setSelectedTag}
              />
            </motion.div>

            <DatingContent 
              ads={ads}
              canAccessBodyContact={!!canAccessBodyContact}
              onAdCreationSuccess={handleAdCreationSuccess}
              onTagClick={handleTagClick}
            />
          </div>
        </motion.div>
      </div>

      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="bg-luxury-darker border-luxury-primary/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Unlock Premium Features</DialogTitle>
            <DialogDescription className="text-center text-luxury-neutral">
              Get full access to BD Ads for only 59 SEK/month
            </DialogDescription>
          </DialogHeader>

          <div className="bg-purple-900/30 rounded-md p-3 mb-3 border border-purple-500/20">
            <p className="text-center text-white font-medium">Limited-Time Offer!</p>
            <div className="flex justify-center items-center gap-2 mt-1">
              <Clock className="h-4 w-4 text-purple-300" />
              <p className="text-purple-300 font-mono text-sm">
                Offer expires in: <span className="font-bold">{formatTime(timeRemaining)}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 py-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-luxury-neutral">Message any BD ad creator</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-luxury-neutral">Create your own BD ads</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-luxury-neutral">Access verified users only</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                <p className="text-luxury-neutral">Cancel anytime with no commitments</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                <p className="text-luxury-neutral">30-day money-back guarantee</p>
              </div>
            </div>

            <div className="bg-luxury-dark/50 p-3 rounded-lg">
              <p className="text-center text-luxury-neutral text-sm">
                <span className="text-green-400 font-medium">95% of members</span> say BD Ads help them connect faster!
              </p>
            </div>

            <div className="pt-2">
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white py-6 rounded-lg text-lg"
                onClick={() => {
                  setShowSubscriptionDialog(false);
                  navigate('/subscription');
                }}
              >
                Get Premium Access Now
              </Button>
              <p className="text-xs text-center text-luxury-neutral/60 mt-2">
                You'll be redirected to our secure payment processor
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
