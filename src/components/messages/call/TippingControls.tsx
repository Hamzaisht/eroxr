
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign } from "lucide-react";

interface TippingControlsProps {
  recipientId: string;
  channelName: string;
}

export function TippingControls({ recipientId, channelName }: TippingControlsProps) {
  const [tipAmount, setTipAmount] = useState("");
  const [showTipInput, setShowTipInput] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get total tips for this call using a properly typed query
  const { data: tipsTotal = 0 } = useQuery({
    queryKey: ['tips_total', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tips')
        .select('sum:amount')
        .eq('recipient_id', recipientId)
        .eq('call_id', channelName)
        .single();

      if (error) throw error;
      return data?.sum || 0;
    },
  });

  const handleSendTip = async () => {
    if (!tipAmount || !session?.user?.id) return;

    try {
      const amount = parseFloat(tipAmount);
      const { error } = await supabase
        .from('tips')
        .insert({
          sender_id: session.user.id,
          recipient_id: recipientId,
          amount,
          call_id: channelName,
          sender_name: session.user.email,
        });

      if (error) throw error;

      setTipAmount("");
      setShowTipInput(false);
      toast({
        title: "Tip Sent!",
        description: `Successfully sent ${amount} credits`,
      });

      // Show floating heart animation
      showHeartAnimation();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const showHeartAnimation = () => {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    document.querySelector('.video-container')?.appendChild(heart);
    
    setTimeout(() => heart.remove(), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      {showTipInput ? (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={tipAmount}
            onChange={(e) => setTipAmount(e.target.value)}
            className="w-24 bg-white/10"
            placeholder="Amount"
          />
          <Button onClick={handleSendTip} variant="secondary">
            Send Tip
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowTipInput(true)}
        >
          <DollarSign className="h-5 w-5" />
        </Button>
      )}
      
      <div className="text-white/80">
        Total Tips: {tipsTotal} credits
      </div>
    </div>
  );
}
