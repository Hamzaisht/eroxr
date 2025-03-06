
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CheckCircle, Shield, Calendar, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SubscriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubscriptionDialog = ({ open, onOpenChange }: SubscriptionDialogProps) => {
  const navigate = useNavigate();
  const [timeRemaining, setTimeRemaining] = useState(1800);

  useEffect(() => {
    if (!open) return;
    
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
  }, [open]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onOpenChange(false);
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
  );
};
