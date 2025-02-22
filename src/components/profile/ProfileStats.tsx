import { Users, Heart, Image, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface TipData {
  sender_id: string;
  recipient_id: string;
  amount: number;
  call_id: string;
  sender_name: string | null;
}

const Counter = ({ value }: { value: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {value.toLocaleString()}
    </motion.span>
  );
};

export const ProfileStats = ({ profileId }: { profileId: string }) => {
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [tipAmount, setTipAmount] = useState("5");
  const { toast } = useToast();
  const session = useSession();

  const handleSendTip = async () => {
    if (!session?.user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to send tips",
        variant: "destructive"
      });
      return;
    }

    try {
      const tipData: TipData = {
        sender_id: session.user.id,
        recipient_id: profileId,
        amount: parseFloat(tipAmount),
        call_id: 'profile-tip',
        sender_name: session.user.email
      };

      const { error } = await supabase
        .from('tips')
        .insert(tipData);

      if (error) throw error;

      toast({
        title: "Tip sent!",
        description: `Successfully sent $${tipAmount} tip`,
      });
      setShowTipDialog(false);
    } catch (error) {
      toast({
        title: "Error sending tip",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex gap-6 justify-center relative z-10">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.05 }}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg 
                   transition-colors duration-300 hover:bg-luxury-darker/80 cursor-pointer group"
      >
        <Users className="h-5 w-5 text-luxury-primary animate-pulse" />
        <div className="flex flex-col">
          <span className="text-white font-medium">
            <Counter value={4300} />
          </span>
          <span className="text-xs text-white/60">Followers</span>
        </div>
        <motion.div 
          className="absolute invisible group-hover:visible bg-luxury-darker/90 rounded-lg p-2 -top-12
                     border border-luxury-primary/20 backdrop-blur-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-xs text-white/80">Top supporters</span>
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg 
                   transition-colors duration-300 hover:bg-luxury-darker/80 cursor-pointer"
      >
        <Heart className="h-5 w-5 text-luxury-accent animate-pulse" />
        <div className="flex flex-col">
          <span className="text-white font-medium">
            <Counter value={12800} />
          </span>
          <span className="text-xs text-white/60">Likes</span>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.05 }}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-darker/60 backdrop-blur-lg 
                   transition-colors duration-300 hover:bg-luxury-darker/80 cursor-pointer"
      >
        <Image className="h-5 w-5 text-luxury-neutral animate-pulse" />
        <div className="flex flex-col">
          <span className="text-white font-medium">
            <Counter value={286} />
          </span>
          <span className="text-xs text-white/60">Posts</span>
        </div>
      </motion.div>

      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowTipDialog(true)}
        className="neo-blur rounded-2xl p-4 flex items-center gap-3 bg-luxury-primary/20 backdrop-blur-lg 
                   transition-colors duration-300 hover:bg-luxury-primary/30 cursor-pointer"
      >
        <DollarSign className="h-5 w-5 text-luxury-primary animate-pulse" />
        <span className="text-white font-medium">Send Tip</span>
      </motion.button>

      <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
        <DialogContent className="bg-luxury-darker border-luxury-primary/20">
          <DialogHeader>
            <DialogTitle>Send a Tip</DialogTitle>
            <DialogDescription>Support this creator with a tip</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="flex items-center gap-4">
              {["5", "10", "20", "50", "100"].map((amount) => (
                <Button
                  key={amount}
                  variant={tipAmount === amount ? "default" : "outline"}
                  onClick={() => setTipAmount(amount)}
                  className="flex-1"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <Button 
              onClick={handleSendTip}
              className="w-full bg-luxury-primary hover:bg-luxury-primary/90"
            >
              Send Tip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
