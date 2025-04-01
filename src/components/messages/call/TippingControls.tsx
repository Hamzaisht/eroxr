
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

export interface TippingControlsProps {
  recipientId: string;
  onTip: (amount: number) => void;
}

export const TippingControls = ({ recipientId, onTip }: TippingControlsProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const tipAmounts = [10, 20, 50, 100, 500];
  
  const handleSendTip = (amount: number) => {
    // Here you would integrate with payment system
    // For now, we'll just call the callback
    onTip(amount);
    setIsExpanded(false);
  };
  
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-white bg-pink-600/70 hover:bg-pink-600"
      >
        <Gift className="h-4 w-4 mr-2" />
        Send Tip
      </Button>
      
      {isExpanded && (
        <div className="flex gap-2 ml-4">
          {tipAmounts.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              size="sm"
              onClick={() => handleSendTip(amount)}
              className="bg-white/10 hover:bg-white/20 text-white"
            >
              {amount} SEK
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
