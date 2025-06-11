
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Crown, Plus, Trash2, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionTier {
  id?: string;
  name: string;
  description: string;
  monthly_price: number;
  features: string[];
}

interface SubscriptionPricingFormProps {
  userId: string;
  isVisible: boolean;
}

export const SubscriptionPricingForm = ({ userId, isVisible }: SubscriptionPricingFormProps) => {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([
    {
      name: "Premium Access",
      description: "Exclusive content and perks",
      monthly_price: 5.99,
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
      for (const tier of tiers) {
        if (tier.name && tier.monthly_price >= 5.99) {
          const { error } = await supabase
            .from('creator_subscription_tiers')
            .upsert({
              creator_id: userId,
              name: tier.name,
              description: tier.description,
              monthly_price: tier.monthly_price,
              features: tier.features.filter(f => f.trim() !== ''),
              is_active: true
            });

          if (error) throw error;
        }
      }

      toast({
        title: "Success",
        description: "Subscription tiers saved successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save subscription tiers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-6 border-t border-luxury-primary/20 pt-6 mt-6"
    >
      <div className="flex items-center gap-3">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-luxury-neutral">Subscription Pricing</h3>
      </div>

      <p className="text-luxury-muted text-sm">
        Set up subscription tiers for your fans. Minimum price is $5.99/month.
      </p>

      <AnimatePresence>
        {tiers.map((tier, tierIndex) => (
          <motion.div
            key={tierIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl bg-luxury-darker/30 border border-luxury-primary/10 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-luxury-neutral">
                Tier {tierIndex + 1}
              </h4>
              {tiers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTier(tierIndex)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`tier-name-${tierIndex}`} className="text-luxury-neutral">
                  Tier Name
                </Label>
                <Input
                  id={`tier-name-${tierIndex}`}
                  value={tier.name}
                  onChange={(e) => updateTier(tierIndex, 'name', e.target.value)}
                  className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
                  placeholder="e.g., Premium Access"
                />
              </div>

              <div>
                <Label htmlFor={`tier-price-${tierIndex}`} className="text-luxury-neutral">
                  Monthly Price (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-luxury-neutral/50" />
                  <Input
                    id={`tier-price-${tierIndex}`}
                    type="number"
                    min="5.99"
                    step="0.01"
                    value={tier.monthly_price}
                    onChange={(e) => updateTier(tierIndex, 'monthly_price', parseFloat(e.target.value))}
                    className="pl-10 bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
                    placeholder="5.99"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor={`tier-description-${tierIndex}`} className="text-luxury-neutral">
                Description
              </Label>
              <Textarea
                id={`tier-description-${tierIndex}`}
                value={tier.description}
                onChange={(e) => updateTier(tierIndex, 'description', e.target.value)}
                className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral min-h-[80px]"
                placeholder="Describe what subscribers get with this tier..."
              />
            </div>

            <div>
              <Label className="text-luxury-neutral mb-2 block">Features</Label>
              <div className="space-y-2">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(tierIndex, featureIndex, e.target.value)}
                      className="bg-luxury-darker border-luxury-primary/20 text-luxury-neutral"
                      placeholder="Feature description..."
                    />
                    {tier.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(tierIndex, featureIndex)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
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

      <div className="flex gap-3">
        <Button
          type="button"
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
          className="bg-luxury-primary hover:bg-luxury-primary/90 text-white"
        >
          {isLoading ? "Saving..." : "Save Pricing"}
        </Button>
      </div>
    </motion.div>
  );
};
