import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface PPVSettingsProps {
  isPPV: boolean;
  setIsPPV: (value: boolean) => void;
  ppvAmount: number | null;
  setPpvAmount: (value: number | null) => void;
}

export const PPVSettings = ({ isPPV, setIsPPV, ppvAmount, setPpvAmount }: PPVSettingsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2 p-4 rounded-lg border border-luxury-neutral/10 bg-luxury-dark/20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-luxury-primary" />
          <Label htmlFor="ppv-toggle">Pay-Per-View Content</Label>
        </div>
        <Switch
          id="ppv-toggle"
          checked={isPPV}
          onCheckedChange={setIsPPV}
        />
      </div>
      
      {isPPV && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-2 pt-2"
        >
          <Label htmlFor="ppv-amount">Amount ($)</Label>
          <Input
            id="ppv-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={ppvAmount || ''}
            onChange={(e) => setPpvAmount(parseFloat(e.target.value))}
            placeholder="Enter amount"
            className="bg-luxury-dark/30 border-luxury-neutral/10"
          />
          <p className="text-sm text-muted-foreground">
            Content will be locked until payment is made
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};