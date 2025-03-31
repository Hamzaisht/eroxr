
import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { UploadVideoDialog } from "./UploadVideoDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const UploadVideoButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  // Check if user is verified or premium
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!session?.user) {
        setCanUpload(false);
        return;
      }

      setIsCheckingPermission(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_paying_customer, id_verification_status')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        const isVerified = data.id_verification_status === 'verified';
        const isPremium = data.is_paying_customer === true;
        
        setCanUpload(isVerified || isPremium);
      } catch (error) {
        console.error('Error checking user status:', error);
        setCanUpload(false);
      } finally {
        setIsCheckingPermission(false);
      }
    };

    if (session?.user) {
      checkUserStatus();
    }
  }, [session]);

  const handleButtonClick = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload videos",
        variant: "destructive",
      });
      return;
    }

    if (canUpload) {
      setIsDialogOpen(true);
    } else {
      setIsPaywallOpen(true);
    }
  };

  // Handler for subscription checkout
  const handleSubscribeClick = async () => {
    try {
      // This would be replaced with your actual Stripe integration code
      toast({
        title: "Redirecting to checkout",
        description: "You'll be redirected to complete your subscription",
      });
      
      // Redirect to Stripe checkout would go here
      // For now, we'll just close the dialog
      setIsPaywallOpen(false);
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      toast({
        title: "Checkout error",
        description: "Failed to open checkout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleButtonClick}
          className="rounded-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary shadow-lg z-50 px-6 py-6 flex items-center gap-2"
          id="upload-video-button"
          disabled={isCheckingPermission}
        >
          {isCheckingPermission ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Plus className="h-5 w-5" />
          )}
          <span>Upload</span>
        </Button>
      </motion.div>

      {/* Upload Dialog */}
      <UploadVideoDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />

      {/* Paywall Dialog */}
      <Dialog open={isPaywallOpen} onOpenChange={setIsPaywallOpen}>
        <DialogContent className="sm:max-w-md bg-black text-white border-luxury-primary/20">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">Premium Feature</DialogTitle>
            <DialogDescription className="text-center text-luxury-neutral">
              This feature is exclusively available to premium subscribers and verified members.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="bg-gradient-to-r from-luxury-primary/10 to-luxury-accent/10 p-4 rounded-lg border border-luxury-primary/20">
              <h3 className="font-semibold text-luxury-primary mb-2">Subscribe for premium benefits:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-primary mr-2"></div>
                  Upload unlimited Eros videos
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-primary mr-2"></div>
                  Message creators directly
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-primary mr-2"></div>
                  Access exclusive content
                </li>
                <li className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-luxury-primary mr-2"></div>
                  No ads or restrictions
                </li>
              </ul>
            </div>
            
            <div className="text-center font-semibold">
              59 SEK/month. Cancel anytime. No refunds.
            </div>
            
            <Button 
              onClick={handleSubscribeClick}
              className="w-full bg-gradient-to-r from-luxury-primary to-luxury-accent hover:from-luxury-accent hover:to-luxury-primary"
            >
              Subscribe Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
