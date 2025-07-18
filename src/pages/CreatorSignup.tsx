import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowLeft, Upload, FileText, Shield, AlertCircle } from "lucide-react";

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
  const [currentStep, setCurrentStep] = useState(1);
  
  // File input refs
  const idFileRef = useRef<HTMLInputElement>(null);
  const selfieFileRef = useRef<HTMLInputElement>(null);

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

      toast({
        title: "Application Submitted Successfully",
        description: "Your creator verification request has been submitted. You'll receive a response within 48 hours."
      });

      navigate('/settings');
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

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Legal Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Enter your full legal name"
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">Must be 18 or older</p>
          </div>
          
          <div>
            <Label>Account Type *</Label>
            <RadioGroup 
              value={formData.accountType} 
              onValueChange={(value) => handleInputChange('accountType', value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="private" />
                <Label htmlFor="private" className="text-white">Private Individual</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="company" id="company" />
                <Label htmlFor="company" className="text-white">Business/Company</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Registered Address</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="Enter your street address"
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="City"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="State/Province"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                placeholder="Postal Code"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
            </div>
            <div>
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="Country"
                className="bg-luxury-dark border-luxury-neutral/20 text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Identity Verification</h2>
        <div className="space-y-6">
          <div>
            <Label>Government ID Type *</Label>
            <RadioGroup 
              value={formData.governmentIdType} 
              onValueChange={(value) => handleInputChange('governmentIdType', value)}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passport" id="passport" />
                <Label htmlFor="passport" className="text-white">Passport</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="national_id" id="national_id" />
                <Label htmlFor="national_id" className="text-white">National ID Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="drivers_license" id="drivers_license" />
                <Label htmlFor="drivers_license" className="text-white">Driver's License</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Government ID Photo *</Label>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => idFileRef.current?.click()}
                className="w-full border-luxury-neutral/20 text-white hover:bg-luxury-dark"
              >
                <Upload className="h-4 w-4 mr-2" />
                {governmentIdFile ? governmentIdFile.name : "Upload ID Document"}
              </Button>
              <input
                ref={idFileRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setGovernmentIdFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Upload a clear photo of your government-issued ID</p>
          </div>
          
          <div>
            <Label>Selfie with ID *</Label>
            <div className="mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => selfieFileRef.current?.click()}
                className="w-full border-luxury-neutral/20 text-white hover:bg-luxury-dark"
              >
                <Upload className="h-4 w-4 mr-2" />
                {selfieFile ? selfieFile.name : "Upload Selfie with ID"}
              </Button>
              <input
                ref={selfieFileRef}
                type="file"
                accept="image/*"
                onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Take a selfie holding your ID next to your face</p>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-400">ID Verification Tips</h4>
                <ul className="text-sm text-gray-300 mt-1 space-y-1">
                  <li>• Ensure all text on your ID is clearly visible</li>
                  <li>• Use good lighting and avoid glare</li>
                  <li>• In your selfie, hold the ID next to your face</li>
                  <li>• Make sure your face is clearly visible in the selfie</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Social Media Links (Optional)</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              value={formData.instagram}
              onChange={(e) => handleInputChange('instagram', e.target.value)}
              placeholder="@username or profile URL"
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="twitter">Twitter/X</Label>
            <Input
              id="twitter"
              value={formData.twitter}
              onChange={(e) => handleInputChange('twitter', e.target.value)}
              placeholder="@username or profile URL"
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              value={formData.tiktok}
              onChange={(e) => handleInputChange('tiktok', e.target.value)}
              placeholder="@username or profile URL"
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
          </div>
          <div>
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              value={formData.youtube}
              onChange={(e) => handleInputChange('youtube', e.target.value)}
              placeholder="Channel URL"
              className="bg-luxury-dark border-luxury-neutral/20 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Terms and Agreements</h2>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
              />
              <div>
                <Label htmlFor="terms" className="text-white cursor-pointer">
                  I have read and agree to the Terms of Service *
                </Label>
                <p className="text-sm text-gray-400">
                  By checking this box, you agree to our platform's terms and conditions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="privacy"
                checked={formData.privacyAccepted}
                onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked)}
              />
              <div>
                <Label htmlFor="privacy" className="text-white cursor-pointer">
                  I have read and agree to the Privacy Policy *
                </Label>
                <p className="text-sm text-gray-400">
                  Understanding how we collect, use, and protect your personal information.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="guidelines"
                checked={formData.communityGuidelinesAccepted}
                onCheckedChange={(checked) => handleInputChange('communityGuidelinesAccepted', checked)}
              />
              <div>
                <Label htmlFor="guidelines" className="text-white cursor-pointer">
                  I have read and agree to the Community Guidelines *
                </Label>
                <p className="text-sm text-gray-400">
                  Commitment to maintaining a safe and respectful community.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-400">What happens next?</h4>
                <ul className="text-sm text-gray-300 mt-1 space-y-1">
                  <li>• Your application will be reviewed within 48 hours</li>
                  <li>• You'll receive an email notification about the status</li>
                  <li>• Once approved, you can start earning through subscriptions and tips</li>
                  <li>• You'll have access to creator analytics and tools</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/settings')}
          className="mb-4 text-white hover:bg-white/10 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Creator Verification</h1>
        <p className="text-gray-400">Complete your verification to start earning as a content creator</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep >= step 
                  ? 'bg-luxury-primary text-white' 
                  : 'bg-luxury-dark text-gray-400 border border-luxury-neutral/20'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-16 h-0.5 ml-2 ${
                  currentStep > step ? 'bg-luxury-primary' : 'bg-luxury-neutral/20'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>Personal Info</span>
          <span>Address</span>
          <span>ID Verification</span>
          <span>Terms</span>
        </div>
      </div>

      <Card className="bg-luxury-darker border-luxury-neutral/10">
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="border-luxury-neutral/20 text-white hover:bg-luxury-dark"
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={!validateStep(currentStep)}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!validateStep(4) || isSubmitting}
            className="bg-luxury-primary hover:bg-luxury-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Submit Application
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreatorSignup;