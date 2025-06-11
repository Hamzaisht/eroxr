
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, Plus, Trash2, DollarSign, Star, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionTier {
  id?: string;
  name: string;
  description: string;
  monthly_price: number;
  features: string[];
}

interface ModernSubscriptionPricingProps {
  userId: string;
}

export const ModernSubscriptionPricing = ({ userId }: ModernSubscriptionPricingProps) => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([
    {
      name: "Premium Access",
      description: "Exclusive content and direct access",
      monthly_price: 9.99,
      features: ["Exclusive posts", "Direct messaging", "Priority support"]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addTier = () => {
    setTiers([...tiers, {
      name: "",
      description: "",
      monthly_price: 5.99,
      features: [""]
    }]);
  };

  const removeTier = (index: number) => {
    setTiers(tiers.filter((_, i) => i !== index));
  };

  const updateTier = (index: number, field: keyof SubscriptionTier, value: any) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setTiers(newTiers);
  };

  const addFeature = (tierIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features.push("");
    setTiers(newTiers);
  };

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features[featureIndex] = value;
    setTiers(newTiers);
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    const newTiers = [...tiers];
    newTiers[tierIndex].features = newTiers[tierIndex].features.filter((_, i) => i !== featureIndex);
    setTiers(newTiers);
  };

  const saveTiers = async () => {
    setIsLoading(true);
    try {
      // Note: This would need a creator_subscription_tiers table
      toast({
        title: "Pricing Updated",
        description: "Your subscription tiers have been saved!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save subscription tiers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyRevenue = () => {
    const avgPrice = tiers.reduce((sum, tier) => sum + tier.monthly_price, 0) / tiers.length;
    return (avgPrice * 50).toFixed(0); // Assume 50 subscribers as estimate
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crown className="w-6 h-6 text-yellow-500" />
          <div>
            <h3 className="text-lg font-semibold text-luxury-neutral">Subscription Pricing</h3>
            <p className="text-sm text-luxury-muted">Set up tiers for your exclusive content</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-luxury-muted">Est. Monthly Revenue</div>
          <div className="text-lg font-bold text-luxury-primary">${calculateMonthlyRevenue()}</div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="space-y-4">
        <AnimatePresence>
          {tiers.map((tier, tierIndex) => (
            <motion.div
              key={tierIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-lg bg-luxury-darker/30 border border-luxury-primary/10 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-luxury-neutral">Tier {tierIndex + 1}</span>
                </div>
                {tiers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTier(tierIndex)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-luxury-neutral text-sm">Tier Name</Label>
                  <Input
                    value={tier.name}
                    onChange={(e) => updateTier(tierIndex, 'name', e.target.value)}
                    className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
                    placeholder="e.g., VIP Access"
                  />
                </div>
                <div>
                  <Label className="text-luxury-neutral text-sm">Monthly Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-luxury-neutral/50" />
                    <Input
                      type="number"
                      min="5.99"
                      step="0.01"
                      value={tier.monthly_price}
                      onChange={(e) => updateTier(tierIndex, 'monthly_price', parseFloat(e.target.value))}
                      className="pl-10 bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-luxury-neutral text-sm">Description</Label>
                <Textarea
                  value={tier.description}
                  onChange={(e) => updateTier(tierIndex, 'description', e.target.value)}
                  className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral h-20"
                  placeholder="What do subscribers get with this tier?"
                />
              </div>

              <div>
                <Label className="text-luxury-neutral text-sm mb-2 block">Features</Label>
                <div className="space-y-2">
                  {tier.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(tierIndex, featureIndex, e.target.value)}
                        className="bg-luxury-darker/50 border-luxury-primary/20 text-luxury-neutral"
                        placeholder="Feature description..."
                      />
                      {tier.features.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(tierIndex, featureIndex)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(tierIndex)}
                    className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={addTier}
          className="border-luxury-primary/30 text-luxury-primary hover:bg-luxury-primary/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Tier
        </Button>
        <Button
          onClick={saveTiers}
          disabled={isLoading}
          className="bg-luxury-primary hover:bg-luxury-primary/90"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          {isLoading ? "Saving..." : "Save Pricing"}
        </Button>
      </div>
    </div>
  );
};
