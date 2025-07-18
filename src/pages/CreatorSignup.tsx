import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { 
  Loader2, 
  ArrowLeft, 
  Upload, 
  FileText, 
  Shield, 
  AlertCircle,
  Star,
  Sparkles,
  Crown,
  Check,
  Camera,
  CreditCard,
  Globe,
  Lock,
  ChevronRight,
  Users,
  TrendingUp,
  Award
} from "lucide-react";

const CreatorSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useCurrentUser();
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    accountType: "",
    // Address fields
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    // ID verification
    governmentIdType: "",
    // Social media (optional)
    instagram: "",
    twitter: "",
    tiktok: "",
    youtube: "",
    onlyfans: "",
    // Legal acceptance
    termsAccepted: false,
    privacyAccepted: false,
    communityGuidelinesAccepted: false,
  });
  
  // File uploads
  const [governmentIdFile, setGovernmentIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // Start with hero screen
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  // File input refs
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);

  // Parallax effect
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('verification-documents')
      .upload(path, file);
    
    if (error) throw error;
    return data.path;
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.dateOfBirth && formData.accountType;
      case 2:
        return formData.street && formData.city && formData.country;
      case 3:
        return formData.governmentIdType && governmentIdFile && selfieFile;
      case 4:
        return formData.termsAccepted && formData.privacyAccepted && formData.communityGuidelinesAccepted;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep === 0) {
      setCurrentStep(1);
    } else if (validateStep(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Complete Required Fields",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive"
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!profile?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your verification request.",
        variant: "destructive"
      });
      return;
    }

    // Validate age
    const birthDate = new Date(formData.dateOfBirth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      toast({
        title: "Age Requirement",
        description: "You must be at least 18 years old to become a creator.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload files
      const timestamp = Date.now();
      const idPath = await uploadFile(
        governmentIdFile!, 
        `${profile.id}/government-id-${timestamp}.${governmentIdFile!.name.split('.').pop()}`
      );
      const selfiePath = await uploadFile(
        selfieFile!, 
        `${profile.id}/selfie-${timestamp}.${selfieFile!.name.split('.').pop()}`
      );

      // Prepare verification request data
      const verificationData = {
        user_id: profile.id,
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        account_type: formData.accountType,
        registered_address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country
        },
        government_id_type: formData.governmentIdType,
        government_id_url: idPath,
        selfie_url: selfiePath,
        social_media_links: {
          instagram: formData.instagram || null,
          twitter: formData.twitter || null,
          tiktok: formData.tiktok || null,
          youtube: formData.youtube || null,
          onlyfans: formData.onlyfans || null,
        },
        terms_accepted: formData.termsAccepted,
        terms_accepted_at: new Date().toISOString(),
        privacy_policy_accepted: formData.privacyAccepted,
        community_guidelines_accepted: formData.communityGuidelinesAccepted,
        status: 'pending'
      };

      const { error } = await supabase
        .from('creator_verification_requests')
        .insert(verificationData);

      if (error) throw error;

      // Move to success step
      setCurrentStep(5);
    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hero Landing Screen
  const renderHero = () => (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(280,100%,70%,0.3),transparent_50%)] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(200,100%,70%,0.3),transparent_50%)] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,hsl(160,100%,70%,0.3),transparent_50%)] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Floating Elements */}
      <motion.div 
        className="absolute top-20 left-20 text-purple-400/30"
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Crown size={40} />
      </motion.div>
      <motion.div 
        className="absolute top-40 right-32 text-blue-400/30"
        animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Sparkles size={32} />
      </motion.div>
      <motion.div 
        className="absolute bottom-32 left-32 text-teal-400/30"
        animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Star size={28} />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative inline-block">
            <Crown className="w-24 h-24 text-primary mx-auto mb-6" />
            <motion.div
              className="absolute -inset-4 bg-primary/20 rounded-full blur-xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Become a
          <span className="block bg-gradient-to-r from-primary via-purple-400 to-teal-400 bg-clip-text text-transparent">
            Creator
          </span>
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Join an exclusive community of verified creators and unlock unlimited earning potential
        </motion.p>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">$2.5M+</div>
            <div className="text-gray-400">Total Creator Earnings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
            <div className="text-gray-400">Active Fans</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-gray-400">Creator Satisfaction</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Button 
            onClick={nextStep}
            size="lg"
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-primary/25"
          >
            Start Your Journey
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/settings')}
        className="absolute top-8 left-8 text-white hover:bg-white/10"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Settings
      </Button>
    </div>
  );

  // Step Progress Indicator
  const ProgressIndicator = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  completedSteps.includes(step) 
                    ? 'bg-primary text-white' 
                    : currentStep === step 
                      ? 'bg-primary/20 text-primary border-2 border-primary' 
                      : 'bg-gray-800 text-gray-400'
                }`}>
                  {completedSteps.includes(step) ? <Check size={16} /> : step}
                </div>
                {step < 4 && (
                  <div className={`w-16 h-1 ml-4 transition-all duration-300 ${
                    completedSteps.includes(step) ? 'bg-primary' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/settings')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </div>
      </div>
    </div>
  );

  // Step 1: Personal Information
  const renderStep1 = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <Users className="w-16 h-16 text-primary mx-auto" />
          <motion.div
            className="absolute -inset-2 bg-primary/20 rounded-full blur-lg"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Tell Us About Yourself</h2>
        <p className="text-xl text-gray-400">Let's start with the basics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          className="glass-effect p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label htmlFor="fullName" className="text-lg font-semibold text-white mb-3 block">
            Full Legal Name *
          </Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full legal name"
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
          />
        </motion.div>
        
        <motion.div 
          className="glass-effect p-6 rounded-2xl"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Label htmlFor="dateOfBirth" className="text-lg font-semibold text-white mb-3 block">
            Date of Birth *
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
          />
          <p className="text-sm text-gray-400 mt-2">Must be 18 or older</p>
        </motion.div>
      </div>
      
      <motion.div 
        className="glass-effect p-8 rounded-2xl"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Label className="text-lg font-semibold text-white mb-6 block">Account Type *</Label>
        <RadioGroup 
          value={formData.accountType} 
          onValueChange={(value) => handleInputChange('accountType', value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <motion.div 
            className="flex items-center space-x-4 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <RadioGroupItem value="private" id="private" className="text-primary" />
            <div>
              <Label htmlFor="private" className="text-white font-medium cursor-pointer">Private Individual</Label>
              <p className="text-sm text-gray-400">Content creator, influencer, artist</p>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-4 p-4 rounded-xl border border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            <RadioGroupItem value="company" id="company" className="text-primary" />
            <div>
              <Label htmlFor="company" className="text-white font-medium cursor-pointer">Business/Company</Label>
              <p className="text-sm text-gray-400">Agency, studio, brand</p>
            </div>
          </motion.div>
        </RadioGroup>
      </motion.div>
    </motion.div>
  );

  // Step 2: Address Information
  const renderStep2 = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <Globe className="w-16 h-16 text-primary mx-auto" />
          <motion.div
            className="absolute -inset-2 bg-primary/20 rounded-full blur-lg"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Your Location</h2>
        <p className="text-xl text-gray-400">We need your registered address for verification</p>
      </div>

      <div className="space-y-6">
        <motion.div 
          className="glass-effect p-6 rounded-2xl"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Label htmlFor="street" className="text-lg font-semibold text-white mb-3 block">
            Street Address *
          </Label>
          <Input
            id="street"
            value={formData.street}
            onChange={(e) => handleInputChange('street', e.target.value)}
            placeholder="Enter your street address"
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
          />
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="glass-effect p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Label htmlFor="city" className="text-lg font-semibold text-white mb-3 block">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="City"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
            />
          </motion.div>
          <motion.div 
            className="glass-effect p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Label htmlFor="state" className="text-lg font-semibold text-white mb-3 block">State/Province</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="State/Province"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            className="glass-effect p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Label htmlFor="postalCode" className="text-lg font-semibold text-white mb-3 block">Postal Code</Label>
            <Input
              id="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleInputChange('postalCode', e.target.value)}
              placeholder="Postal Code"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
            />
          </motion.div>
          <motion.div 
            className="glass-effect p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Label htmlFor="country" className="text-lg font-semibold text-white mb-3 block">Country *</Label>
            <Input
              id="country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="Country"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-primary focus:ring-primary"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  // Step 3: Identity Verification
  const renderStep3 = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <Shield className="w-16 h-16 text-primary mx-auto" />
          <motion.div
            className="absolute -inset-2 bg-primary/20 rounded-full blur-lg"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Identity Verification</h2>
        <p className="text-xl text-gray-400">Secure and encrypted verification process</p>
      </div>

      <div className="space-y-8">
        {/* ID Type Selection */}
        <motion.div 
          className="glass-effect p-8 rounded-2xl"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Label className="text-lg font-semibold text-white mb-6 block">Government ID Type *</Label>
          <RadioGroup 
            value={formData.governmentIdType} 
            onValueChange={(value) => handleInputChange('governmentIdType', value)}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {[
              { value: "passport", label: "Passport", icon: "🛂" },
              { value: "national_id", label: "National ID", icon: "🆔" },
              { value: "drivers_license", label: "Driver's License", icon: "🚗" }
            ].map((option) => (
              <motion.div 
                key={option.value}
                className="flex flex-col items-center p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-3">{option.icon}</div>
                <RadioGroupItem value={option.value} id={option.value} className="text-primary mb-2" />
                <Label htmlFor={option.value} className="text-white font-medium cursor-pointer text-center">
                  {option.label}
                </Label>
              </motion.div>
            ))}
          </RadioGroup>
        </motion.div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            className="glass-effect p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Label className="text-lg font-semibold text-white mb-4 block">Government ID Photo *</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => idFileRef.current?.click()}
              className="w-full h-32 border-dashed border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-white rounded-xl"
            >
              <div className="text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="font-medium">
                  {governmentIdFile ? governmentIdFile.name : "Upload ID Document"}
                </div>
                <div className="text-sm text-gray-400 mt-1">PNG, JPG or PDF</div>
              </div>
            </Button>
            <input
              ref={idFileRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setGovernmentIdFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </motion.div>
          
          <motion.div 
            className="glass-effect p-6 rounded-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Label className="text-lg font-semibold text-white mb-4 block">Selfie with ID *</Label>
            <Button
              type="button"
              variant="outline"
              onClick={() => selfieFileRef.current?.click()}
              className="w-full h-32 border-dashed border-2 border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 text-white rounded-xl"
            >
              <div className="text-center">
                <Camera className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="font-medium">
                  {selfieFile ? selfieFile.name : "Upload Selfie with ID"}
                </div>
                <div className="text-sm text-gray-400 mt-1">Hold ID next to face</div>
              </div>
            </Button>
            <input
              ref={selfieFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
              className="hidden"
            />
          </motion.div>
        </div>
        
        {/* Verification Tips */}
        <motion.div 
          className="glass-effect p-6 rounded-2xl border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-blue-400 mt-1" />
            <div>
              <h4 className="font-semibold text-blue-400 mb-3">ID Verification Tips</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Clear, well-lit photos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>All text must be visible</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>No glare or shadows</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  <span>Face clearly visible in selfie</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Social Media Links */}
        <motion.div 
          className="glass-effect p-8 rounded-2xl"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-6">Social Media Links (Optional)</h3>
          <p className="text-gray-400 mb-6">Help us verify your online presence</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: 'instagram', label: 'Instagram', placeholder: '@username or profile URL' },
              { key: 'twitter', label: 'Twitter/X', placeholder: '@username or profile URL' },
              { key: 'tiktok', label: 'TikTok', placeholder: '@username or profile URL' },
              { key: 'youtube', label: 'YouTube', placeholder: 'Channel URL' }
            ].map((social) => (
              <div key={social.key}>
                <Label htmlFor={social.key} className="text-white font-medium mb-2 block">
                  {social.label}
                </Label>
                <Input
                  id={social.key}
                  value={formData[social.key as keyof typeof formData] as string}
                  onChange={(e) => handleInputChange(social.key, e.target.value)}
                  placeholder={social.placeholder}
                  className="bg-black/20 border-white/10 text-white rounded-xl focus:border-primary focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  // Step 4: Terms and Agreements
  const renderStep4 = () => (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <Lock className="w-16 h-16 text-primary mx-auto" />
          <motion.div
            className="absolute -inset-2 bg-primary/20 rounded-full blur-lg"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">Final Step</h2>
        <p className="text-xl text-gray-400">Review and accept our terms</p>
      </div>

      <div className="space-y-6">
        {[
          {
            key: 'termsAccepted',
            title: 'Terms of Service',
            description: 'I agree to the platform terms and conditions, including creator responsibilities and platform guidelines.',
            required: true
          },
          {
            key: 'privacyAccepted',
            title: 'Privacy Policy',
            description: 'I understand how my personal information will be collected, used, and protected.',
            required: true
          },
          {
            key: 'communityGuidelinesAccepted',
            title: 'Community Guidelines',
            description: 'I will follow all community guidelines and content standards.',
            required: true
          }
        ].map((term, index) => (
          <motion.div 
            key={term.key}
            className="glass-effect p-6 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-start space-x-4">
              <Checkbox 
                id={term.key}
                checked={formData[term.key as keyof typeof formData] as boolean}
                onCheckedChange={(checked) => handleInputChange(term.key, checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={term.key} className="text-white font-semibold text-lg cursor-pointer flex items-center">
                  {term.title}
                  {term.required && <span className="text-red-400 ml-1">*</span>}
                </Label>
                <p className="text-gray-400 mt-2 leading-relaxed">
                  {term.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="glass-effect p-8 rounded-2xl border border-green-500/20 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Award className="w-12 h-12 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Almost Done!</h3>
        <p className="text-gray-400">
          Once submitted, our team will review your application within 48 hours. 
          You'll receive an email notification with the decision.
        </p>
      </motion.div>
    </motion.div>
  );

  // Success Screen
  const renderSuccess = () => (
    <motion.div 
      className="text-center py-20"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div
        className="relative inline-block mb-8"
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, type: "spring" }}
      >
        <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-16 h-16 text-white" />
        </div>
        <motion.div
          className="absolute -inset-4 bg-green-400/30 rounded-full blur-xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h1 
        className="text-5xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        Application Submitted!
      </motion.h1>
      
      <motion.p 
        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        Your creator verification request has been submitted successfully. 
        Our team will review your application and respond within 48 hours.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <Button 
          onClick={() => navigate('/settings')}
          size="lg"
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-4 text-lg font-semibold rounded-full"
        >
          Return to Settings
        </Button>
      </motion.div>
    </motion.div>
  );

  // Navigation Buttons
  const NavigationButtons = () => (
    <motion.div 
      className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-sm border-t border-white/10"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={prevStep}
            disabled={currentStep <= 1}
            className="text-white hover:bg-white/10 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            Step {currentStep} of 4
          </div>
          
          {currentStep < 4 ? (
            <Button 
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-8 py-3 disabled:opacity-50"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application
                  <Check className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(280,100%,70%,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(200,100%,70%,0.1),transparent_70%)]" />
        <motion.div 
          className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -100, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: '20%', left: '10%' }}
        />
        <motion.div 
          className="absolute w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 100, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ bottom: '20%', right: '10%' }}
        />
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div key="hero">
            {renderHero()}
          </motion.div>
        )}
        
        {currentStep >= 1 && currentStep <= 4 && (
          <motion.div key="form" className="relative z-10">
            <ProgressIndicator />
            <div className="pt-24 pb-32 px-6">
              <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && <motion.div key="step1">{renderStep1()}</motion.div>}
                  {currentStep === 2 && <motion.div key="step2">{renderStep2()}</motion.div>}
                  {currentStep === 3 && <motion.div key="step3">{renderStep3()}</motion.div>}
                  {currentStep === 4 && <motion.div key="step4">{renderStep4()}</motion.div>}
                </AnimatePresence>
              </div>
            </div>
            <NavigationButtons />
          </motion.div>
        )}
        
        {currentStep === 5 && (
          <motion.div key="success">
            {renderSuccess()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreatorSignup;