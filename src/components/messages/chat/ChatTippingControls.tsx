
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Heart, Plus, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

export interface ChatTippingControlsProps {
  recipientId: string;
}

export function ChatTippingControls({ recipientId }: ChatTippingControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customAmount, setCustomAmount] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  
  const tipAmounts = [20, 50, 100, 200, 500];
  
  const handleSendTip = async (amount: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Not logged in",
        description: "Please log in to send tips",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Save the tip in the database
      const { error } = await supabase.from('tips').insert({
        sender_id: session.user.id,
        recipient_id: recipientId,
        amount: amount,
        call_id: 'chat-tip', // Using 'chat-tip' for non-call tips
      });

      if (error) throw error;
      
      toast({
        title: "Tip sent!",
        description: `You sent a ${amount} SEK tip!`,
        variant: "default"
      });
      
      setIsExpanded(false);
    } catch (error: any) {
      console.error("Error sending tip:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send tip",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const increaseAmount = () => setCustomAmount(prev => Math.min(prev + 10, 1000));
  const decreaseAmount = () => setCustomAmount(prev => Math.max(prev - 10, 10));
  
  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold flex items-center gap-2">
        <Gift className="h-4 w-4" /> Send a Tip
      </h3>
      
      <Button
        variant="default"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
        disabled={isLoading}
      >
        <Heart className="h-4 w-4 mr-2" />
        {isExpanded ? "Hide Tipping" : "Show Tipping Options"}
      </Button>
      
      {isExpanded && (
        <div className="space-y-3 p-3 bg-luxury-neutral/5 rounded-md border border-luxury-neutral/10">
          <div className="grid grid-cols-3 gap-2">
            {tipAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => handleSendTip(amount)}
                disabled={isLoading}
                className="bg-luxury-primary/10 border-luxury-primary/20 hover:bg-luxury-primary/20"
              >
                {amount} SEK
              </Button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2 mt-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={decreaseAmount}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <div className="flex-1 text-center bg-luxury-neutral/10 rounded-md py-2">
              {customAmount} SEK
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={increaseAmount}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <Button
            variant="default"
            size="sm"
            onClick={() => handleSendTip(customAmount)}
            disabled={isLoading}
            className="w-full bg-luxury-primary/80 hover:bg-luxury-primary"
          >
            Send Custom Tip
          </Button>
        </div>
      )}
    </div>
  );
}
