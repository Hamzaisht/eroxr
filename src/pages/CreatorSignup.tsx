import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';
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
  Award,
  CheckCircle,
  X,
  Phone,
  User,
  MapPin,
  Zap
} from "lucide-react";
// Real countries data is defined below instead of importing

// Real Nordic countries with actual cities
const COUNTRIES = {
  "Denmark": ["Copenhagen", "Aarhus", "Odense", "Aalborg", "Frederiksberg", "Esbjerg", "Randers"],
  "Finland": ["Helsinki", "Espoo", "Tampere", "Vantaa", "Oulu", "Turku", "Jyväskylä"],
  "Iceland": ["Reykjavik", "Kópavogur", "Hafnarfjörður", "Akureyri", "Reykjanesbær"],
  "Norway": ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Fredrikstad", "Kristiansand"],
  "Sweden": ["Stockholm", "Gothenburg", "Malmö", "Uppsala", "Västerås", "Örebro", "Linköping"]
};

const COUNTRY_CODES = {
  "Denmark": "+45",
  "Finland": "+358", 
  "Iceland": "+354",
  "Norway": "+47",
  "Sweden": "+46"
};

const CreatorSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile } = useCurrentUser();
  
  // Get user from Supabase auth for email
  const [userEmail, setUserEmail] = useState<string>('');
  
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUser();
  }, []);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    accountType: "",
    phoneNumber: "",
    phoneCountryCode: "",
    username: "",
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
  
  // Validation states
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  
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

  // Check username availability with debounce
  useEffect(() => {
    const checkUsername = async () => {
      if (!formData.username || formData.username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      
      setUsernameChecking(true);
      try {
        const { data, error } = await supabase.rpc('check_username_available', {
          username_to_check: formData.username
        });
        
        if (error) throw error;
        setUsernameAvailable(data);
      } catch (error) {
        console.error('Username check error:', error);
        setUsernameAvailable(null);
      } finally {
        setUsernameChecking(false);
      }
    };

    const timeoutId = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // Validate phone number
  useEffect(() => {
    if (!formData.phoneNumber || !formData.phoneCountryCode) {
      setPhoneValid(null);
      return;
    }
    
    try {
      const fullNumber = formData.phoneCountryCode + formData.phoneNumber;
      const isValid = isValidPhoneNumber(fullNumber);
      setPhoneValid(isValid);
    } catch {
      setPhoneValid(false);
    }
  }, [formData.phoneNumber, formData.phoneCountryCode]);

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
        return formData.fullName && 
               formData.dateOfBirth && 
               formData.accountType && 
               formData.username && 
               usernameAvailable === true &&
               formData.phoneNumber &&
               formData.phoneCountryCode &&
               phoneValid === true;
      case 2:
        return formData.street && 
               formData.city && 
               formData.country && 
               COUNTRIES[formData.country as keyof typeof COUNTRIES]?.includes(formData.city);
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

      // Update profile with username
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ username: formData.username })
        .eq('id', profile.id);

      if (profileError) throw profileError;

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

  // Hero Landing Screen with Quantum UI
  const renderHero = () => (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Quantum Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-cyan-900/20"></div>
        {/* Animated RGB border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 via-pink-500/20 to-yellow-400/20 blur-3xl animate-[spin_10s_linear_infinite]"></div>
        
        {/* Neural network pattern */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        {/* Floating quantum particles */}
        <AnimatePresence>
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: `linear-gradient(45deg, ${['#00f5ff', '#8b5cf6', '#f472b6', '#facc15'][i % 4]}, transparent)`,
                left: `${10 + i * 7}%`,
                top: `${15 + (i % 4) * 20}%`,
              }}
              animate={{
                y: [0, -40, 0],
                opacity: [0.2, 1, 0.2],
                scale: [0.5, 1.5, 0.5],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 6 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center max-w-5xl mx-auto px-6"
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
            <Crown className="w-28 h-28 text-primary mx-auto mb-8" />
            <motion.div
              className="absolute -inset-6 bg-primary/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>
        </motion.div>

        <motion.h1 
          className="text-7xl md:text-9xl font-bold text-white mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Become a
          <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Creator
          </span>
        </motion.h1>

        <motion.p 
          className="text-2xl md:text-3xl text-white/80 mb-16 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          Join the quantum revolution of verified creators and unlock unlimited earning potential
        </motion.p>

        {/* Enhanced Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {[
            { value: "$2.5M+", label: "Total Creator Earnings", icon: TrendingUp },
            { value: "50K+", label: "Active Fans", icon: Users },
            { value: "95%", label: "Creator Satisfaction", icon: Award }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              className="relative p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-purple-500/10 to-pink-500/10 rounded-2xl" />
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-white/70">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <Button 
            onClick={nextStep}
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 hover:from-cyan-500 hover:via-purple-600 hover:to-pink-600 text-white px-16 py-8 text-2xl font-bold rounded-2xl shadow-2xl group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              animate={{ x: ["0%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative flex items-center">
              Start Quantum Journey
              <ChevronRight className="ml-3 h-8 w-8 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/settings')}
        className="absolute top-8 left-8 text-white hover:bg-white/10 backdrop-blur-sm"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Settings
      </Button>
    </div>
  );

  // Quantum Progress Indicator
  const QuantumProgress = () => (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <motion.div 
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                    completedSteps.includes(step) 
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white shadow-lg' 
                      : currentStep === step 
                        ? 'bg-gradient-to-r from-cyan-400/20 to-purple-500/20 text-cyan-400 border-2 border-cyan-400 shadow-cyan-400/50 shadow-lg' 
                        : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {completedSteps.includes(step) ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check size={20} />
                    </motion.div>
                  ) : (
                    step
                  )}
                  
                  {/* Glowing effect for current step */}
                  {currentStep === step && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-cyan-400/30 blur-md"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                
                {step < 4 && (
                  <motion.div 
                    className={`w-20 h-1 ml-6 rounded-full transition-all duration-500 ${
                      completedSteps.includes(step) 
                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500' 
                        : 'bg-white/10'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: completedSteps.includes(step) ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            ))}
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/settings')}
            className="text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <X className="h-5 w-5 mr-2" />
            Exit
          </Button>
        </div>
      </div>
    </div>
  );

  // Quantum Input Component
  const QuantumInput = ({ label, icon: Icon, error, success, children, ...props }: any) => (
    <motion.div 
      className="relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Quantum container */}
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-3xl">
        {/* Animated border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r transition-all duration-300 ${
          error 
            ? 'from-red-400/60 via-red-500/60 to-red-400/60' 
            : success 
              ? 'from-green-400/60 via-emerald-500/60 to-green-400/60'
              : 'from-cyan-400/30 via-purple-500/30 to-pink-500/30'
        } blur-sm`}></div>
        <div className="absolute inset-[1px] rounded-2xl bg-black/60 backdrop-blur-3xl"></div>
        
        <div className="relative z-10 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${error ? 'text-red-400' : success ? 'text-green-400' : 'text-cyan-400'}`} />
            <Label className="text-lg font-semibold text-white">{label}</Label>
            {success && <CheckCircle className="w-5 h-5 text-green-400" />}
            {error && <AlertCircle className="w-5 h-5 text-red-400" />}
          </div>
          {children}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}
        </div>
      </div>
    </motion.div>
  );

  // Step 1: Personal Information with Real Validation
  const renderStep1 = () => (
    <motion.div 
      className="space-y-8 pt-24 pb-12"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.div
          className="relative inline-block mb-6"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <User className="w-20 h-20 text-cyan-400 mx-auto" />
          <motion.div
            className="absolute -inset-4 bg-cyan-400/30 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Quantum Identity
        </h2>
        <p className="text-xl text-white/70">Initialize your creator matrix</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <QuantumInput 
          label="Full Legal Name *" 
          icon={User}
        >
          <Input
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your quantum signature"
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-cyan-400 focus:ring-cyan-400"
          />
        </QuantumInput>
        
        <QuantumInput 
          label="Date of Birth *" 
          icon={Shield}
        >
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-cyan-400 focus:ring-cyan-400"
          />
          <p className="text-sm text-cyan-400/60">Must be 18+ for quantum access</p>
        </QuantumInput>

        <QuantumInput 
          label="Username *" 
          icon={User}
          error={usernameAvailable === false ? "Username already exists in the quantum realm" : undefined}
          success={usernameAvailable === true ? "Username available in quantum space" : undefined}
        >
          <div className="relative">
            <Input
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="Choose your quantum handle"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-cyan-400 focus:ring-cyan-400 pr-12"
            />
            {usernameChecking && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
            )}
          </div>
        </QuantumInput>

        <QuantumInput 
          label="Phone Number *" 
          icon={Phone}
          error={phoneValid === false ? "Invalid quantum communication frequency" : undefined}
          success={phoneValid === true ? "Quantum frequency validated" : undefined}
        >
          <div className="flex gap-3">
            <Select 
              value={formData.phoneCountryCode} 
              onValueChange={(value) => handleInputChange('phoneCountryCode', value)}
            >
              <SelectTrigger className="w-32 bg-black/20 border-white/10 text-white focus:border-cyan-400">
                <SelectValue placeholder="Code" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/10">
                {Object.entries(COUNTRY_CODES).map(([country, code]) => (
                  <SelectItem key={country} value={code} className="text-white hover:bg-white/10">
                    {code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Your quantum frequency"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>
        </QuantumInput>
      </div>
      
      <QuantumInput label="Account Type *" icon={Crown}>
        <RadioGroup 
          value={formData.accountType} 
          onValueChange={(value) => handleInputChange('accountType', value)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {[
            { value: "private", label: "Quantum Individual", desc: "Content creator, influencer, artist" },
            { value: "company", label: "Quantum Entity", desc: "Agency, studio, brand collective" }
          ].map((type) => (
            <motion.div 
              key={type.value}
              className="relative overflow-hidden rounded-xl backdrop-blur-xl cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 rounded-xl" />
              <div className="relative p-6 flex items-center space-x-4">
                <RadioGroupItem value={type.value} id={type.value} className="text-cyan-400" />
                <div>
                  <Label htmlFor={type.value} className="text-white font-bold text-lg cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-cyan-400/60">{type.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </RadioGroup>
      </QuantumInput>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Quantum Gate
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!validateStep(1)}
          className="bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-500 hover:to-purple-600 text-white px-8 py-3 rounded-xl"
        >
          Continue Quantum Flow
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 2: Address with Real City Validation
  const renderStep2 = () => (
    <motion.div 
      className="space-y-8 pt-24 pb-12"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.div
          className="relative inline-block mb-6"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <MapPin className="w-20 h-20 text-purple-400 mx-auto" />
          <motion.div
            className="absolute -inset-4 bg-purple-400/30 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Quantum Location
        </h2>
        <p className="text-xl text-white/70">Map your dimensional coordinates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-2">
          <QuantumInput label="Street Address *" icon={MapPin}>
            <Input
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Your quantum street coordinates"
              className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-purple-400 focus:ring-purple-400"
            />
          </QuantumInput>
        </div>

        <QuantumInput label="Country *" icon={Globe}>
          <Select 
            value={formData.country} 
            onValueChange={(value) => {
              handleInputChange('country', value);
              handleInputChange('city', ''); // Reset city when country changes
            }}
          >
            <SelectTrigger className="bg-black/20 border-white/10 text-white h-14 focus:border-purple-400">
              <SelectValue placeholder="Select quantum realm" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {Object.keys(COUNTRIES).map((country) => (
                <SelectItem key={country} value={country} className="text-white hover:bg-white/10">
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </QuantumInput>

        <QuantumInput 
          label="City *" 
          icon={MapPin}
          error={formData.city && formData.country && !COUNTRIES[formData.country as keyof typeof COUNTRIES]?.includes(formData.city) ? "City not found in selected quantum realm" : undefined}
          success={formData.city && formData.country && COUNTRIES[formData.country as keyof typeof COUNTRIES]?.includes(formData.city) ? "Quantum coordinates validated" : undefined}
        >
          <Select 
            value={formData.city} 
            onValueChange={(value) => handleInputChange('city', value)}
            disabled={!formData.country}
          >
            <SelectTrigger className="bg-black/20 border-white/10 text-white h-14 focus:border-purple-400">
              <SelectValue placeholder="Select quantum city" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {formData.country && COUNTRIES[formData.country as keyof typeof COUNTRIES]?.map((city) => (
                <SelectItem key={city} value={city} className="text-white hover:bg-white/10">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </QuantumInput>

        <QuantumInput label="State/Province" icon={MapPin}>
          <Input
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="Quantum state (optional)"
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-purple-400 focus:ring-purple-400"
          />
        </QuantumInput>

        <QuantumInput label="Postal Code" icon={MapPin}>
          <Input
            value={formData.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            placeholder="Quantum postal frequency"
            className="bg-black/20 border-white/10 text-white text-lg h-14 rounded-xl focus:border-purple-400 focus:ring-purple-400"
          />
        </QuantumInput>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Identity
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!validateStep(2)}
          className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600 text-white px-8 py-3 rounded-xl"
        >
          Continue Quantum Flow
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 3: Quantum File Upload
  const renderStep3 = () => (
    <motion.div 
      className="space-y-8 pt-24 pb-12"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.div
          className="relative inline-block mb-6"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Shield className="w-20 h-20 text-pink-400 mx-auto" />
          <motion.div
            className="absolute -inset-4 bg-pink-400/30 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-pink-400 via-yellow-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          Quantum Verification
        </h2>
        <p className="text-xl text-white/70">Upload dimensional proof protocols</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <QuantumInput label="Government ID Type *" icon={FileText}>
          <Select 
            value={formData.governmentIdType} 
            onValueChange={(value) => handleInputChange('governmentIdType', value)}
          >
            <SelectTrigger className="bg-black/20 border-white/10 text-white h-14 focus:border-pink-400">
              <SelectValue placeholder="Select quantum ID protocol" />
            </SelectTrigger>
            <SelectContent className="bg-black border-white/10">
              {["passport", "driver_license", "national_id"].map((type) => (
                <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                  {type.replace('_', ' ').toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </QuantumInput>

        <div></div>

        {/* File Upload Areas */}
        <QuantumInput 
          label="Government ID Upload *" 
          icon={Upload}
          success={governmentIdFile ? `Quantum ID uploaded: ${governmentIdFile.name}` : undefined}
        >
          <div 
            className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400/50 transition-all duration-300"
            onClick={() => idFileRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <p className="text-white mb-2">
              {governmentIdFile ? governmentIdFile.name : "Click to upload quantum ID"}
            </p>
            <p className="text-sm text-white/50">JPG, PNG, PDF up to 10MB</p>
            <input 
              ref={idFileRef}
              type="file" 
              accept="image/*,.pdf" 
              className="hidden"
              onChange={(e) => setGovernmentIdFile(e.target.files?.[0] || null)}
            />
          </div>
        </QuantumInput>

        <QuantumInput 
          label="Selfie Upload *" 
          icon={Camera}
          success={selfieFile ? `Quantum selfie uploaded: ${selfieFile.name}` : undefined}
        >
          <div 
            className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400/50 transition-all duration-300"
            onClick={() => selfieFileRef.current?.click()}
          >
            <Camera className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <p className="text-white mb-2">
              {selfieFile ? selfieFile.name : "Click to upload quantum selfie"}
            </p>
            <p className="text-sm text-white/50">Clear face photo, JPG/PNG up to 5MB</p>
            <input 
              ref={selfieFileRef}
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
            />
          </div>
        </QuantumInput>
      </div>

      {/* Social Media Links */}
      <QuantumInput label="Social Media Quantum Links (Optional)" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: 'instagram', label: 'Instagram', placeholder: '@username' },
            { key: 'twitter', label: 'X/Twitter', placeholder: '@username' },
            { key: 'tiktok', label: 'TikTok', placeholder: '@username' },
            { key: 'youtube', label: 'YouTube', placeholder: 'Channel URL' },
            { key: 'onlyfans', label: 'OnlyFans', placeholder: 'Profile URL' }
          ].map((social) => (
            <Input
              key={social.key}
              value={formData[social.key as keyof typeof formData] as string}
              onChange={(e) => handleInputChange(social.key, e.target.value)}
              placeholder={`${social.label} ${social.placeholder}`}
              className="bg-black/20 border-white/10 text-white h-12 rounded-xl focus:border-pink-400 focus:ring-pink-400"
            />
          ))}
        </div>
      </QuantumInput>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Location
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!validateStep(3)}
          className="bg-gradient-to-r from-pink-400 to-yellow-500 hover:from-pink-500 hover:to-yellow-600 text-white px-8 py-3 rounded-xl"
        >
          Continue Quantum Flow
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </motion.div>
  );

  // Step 4: Legal Acceptance
  const renderStep4 = () => (
    <motion.div 
      className="space-y-8 pt-24 pb-12"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.div
          className="relative inline-block mb-6"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Lock className="w-20 h-20 text-yellow-400 mx-auto" />
          <motion.div
            className="absolute -inset-4 bg-yellow-400/30 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </motion.div>
        <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
          Quantum Agreements
        </h2>
        <p className="text-xl text-white/70">Accept dimensional protocols</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {[
          { 
            key: 'termsAccepted', 
            label: 'Terms of Service', 
            desc: 'I agree to the quantum platform terms and creator guidelines'
          },
          { 
            key: 'privacyAccepted', 
            label: 'Privacy Policy', 
            desc: 'I understand how my dimensional data will be processed and stored'
          },
          { 
            key: 'communityGuidelinesAccepted', 
            label: 'Community Guidelines', 
            desc: 'I will maintain quantum harmony and respect all dimensional beings'
          }
        ].map((agreement, i) => (
          <QuantumInput key={agreement.key} label="" icon={Lock}>
            <div className="flex items-start space-x-4 p-4">
              <Checkbox 
                id={agreement.key}
                checked={formData[agreement.key as keyof typeof formData] as boolean}
                onCheckedChange={(checked) => handleInputChange(agreement.key, checked)}
                className="mt-1 data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
              />
              <div>
                <Label htmlFor={agreement.key} className="text-lg font-semibold text-white cursor-pointer">
                  {agreement.label} *
                </Label>
                <p className="text-yellow-400/60 mt-1">{agreement.desc}</p>
              </div>
            </div>
          </QuantumInput>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button 
          variant="ghost" 
          onClick={prevStep}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Verification
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!validateStep(4) || isSubmitting}
          className="bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 text-white px-12 py-4 rounded-xl text-lg font-bold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Initiating Quantum Protocol...
            </>
          ) : (
            <>
              Launch Quantum Creator
              <Zap className="ml-2 h-6 w-6" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );

  // Success Screen
  const renderSuccess = () => (
    <motion.div 
      className="min-h-screen flex items-center justify-center text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CheckCircle className="w-32 h-32 text-green-400 mx-auto" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Quantum Creator Initialized!
        </motion.h1>
        
        <motion.p 
          className="text-2xl text-white/80 max-w-2xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Your application has been submitted to the quantum verification matrix. 
          You'll receive a dimensional transmission at {userEmail || 'your registered quantum frequency'} within 24-48 hours.
        </motion.p>

        <motion.div 
          className="pt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button 
            onClick={() => navigate('/settings')}
            className="bg-gradient-to-r from-green-400 to-cyan-500 hover:from-green-500 hover:to-cyan-600 text-white px-12 py-4 rounded-xl text-lg font-bold"
          >
            Return to Quantum Base
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Quantum Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900/10 to-cyan-900/10" />
      
      {currentStep > 0 && currentStep < 5 && <QuantumProgress />}
      
      <div className="relative z-10 container mx-auto px-6">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="hero">
              {renderHero()}
            </motion.div>
          )}
          {currentStep === 1 && (
            <motion.div key="step1">
              {renderStep1()}
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div key="step2">
              {renderStep2()}
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div key="step3">
              {renderStep3()}
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div key="step4">
              {renderStep4()}
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div key="success">
              {renderSuccess()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreatorSignup;