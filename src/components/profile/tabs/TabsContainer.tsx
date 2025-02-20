
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VerificationForm } from "@/components/profile/VerificationForm";
import { PricingForm } from "@/components/profile/PricingForm";
import { ProfileTabContent } from "./ProfileTabContent";
import type { Profile } from "@/integrations/supabase/types/profile";

interface TabsContainerProps {
  profile: Profile;
  onSuccess: () => void;
}

export const TabsContainer = ({ profile, onSuccess }: TabsContainerProps) => {
  return (
    <Tabs defaultValue="profile" className="space-y-6">
      <TabsList className="bg-luxury-dark/50 backdrop-blur-lg">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="verification">Verification</TabsTrigger>
        <TabsTrigger value="pricing">Pricing</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileTabContent 
          profile={profile} 
          onSuccess={onSuccess}
        />
      </TabsContent>
      
      <TabsContent value="verification">
        <VerificationForm />
      </TabsContent>
      
      <TabsContent value="pricing">
        <PricingForm />
      </TabsContent>
    </Tabs>
  );
};
