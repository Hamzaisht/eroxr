
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Share2, Facebook, Twitter, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SuccessStepProps {
  onClose: () => void;
}

export const SuccessStep = ({ onClose }: SuccessStepProps) => {
  // Remove countdown since we don't need to show approval timeline anymore
  
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="max-w-lg p-8 rounded-xl glass-morph border border-luxury-primary/20 backdrop-blur-lg
        bg-gradient-to-b from-black/70 to-luxury-primary/10 text-center"
    >
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.2 
        }}
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center
          bg-gradient-to-r from-luxury-primary to-luxury-secondary text-white"
      >
        <Check className="h-10 w-10" />
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold mb-2 bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent"
      >
        Ad Created Successfully!
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-luxury-neutral mb-6"
      >
        Your ad has been published and is now live!
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="mb-8"
      >
        <h3 className="text-sm font-medium mb-3 flex items-center justify-center gap-2">
          <Share2 className="h-4 w-4" />
          Share your ad
        </h3>
        <div className="flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full bg-black/20 border-luxury-primary/20 
              hover:bg-luxury-primary/10 hover:border-luxury-primary/40 transition-all duration-300"
            onClick={() => toast.success("Facebook sharing would open here")}
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full bg-black/20 border-luxury-primary/20 
              hover:bg-luxury-primary/10 hover:border-luxury-primary/40 transition-all duration-300"
            onClick={() => toast.success("Twitter sharing would open here")}
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className="rounded-full bg-black/20 border-luxury-primary/20 
              hover:bg-luxury-primary/10 hover:border-luxury-primary/40 transition-all duration-300"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-4"
      >
        <Button 
          className="w-full py-6 rounded-full bg-gradient-to-r from-luxury-primary to-luxury-secondary 
            hover:from-luxury-secondary hover:to-luxury-primary transition-all duration-500
            hover:shadow-[0_0_20px_rgba(155,135,245,0.6)]"
          onClick={() => toast.success("This would boost your ad visibility")}
        >
          Boost My Ad 🚀
        </Button>
        
        <Button 
          variant="ghost" 
          className="text-muted-foreground hover:text-luxury-neutral"
          onClick={onClose}
        >
          Close
        </Button>
      </motion.div>
    </motion.div>
  );
};
