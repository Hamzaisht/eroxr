import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const pricingSchema = z.object({
  tier_type: z.enum(["single", "multiple"]),
  monthly_price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Price must be a valid number",
  }),
  description: z.string().min(1, "Description is required"),
  features: z.string().min(1, "Features are required"),
  tier_name: z.string().optional(),
  tier_level: z.string().optional(),
});

type PricingFormValues = z.infer<typeof pricingSchema>;

export const PricingForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const form = useForm<PricingFormValues>({
    resolver: zodResolver(pricingSchema),
    defaultValues: {
      tier_type: "single",
      monthly_price: "",
      description: "",
      features: "",
      tier_name: "",
      tier_level: "basic",
    },
  });

  const tierType = form.watch("tier_type");

  const onSubmit = async (values: PricingFormValues) => {
    if (!session?.user) return;
    
    setIsSubmitting(true);
    try {
      if (values.tier_type === "single") {
        const { error } = await supabase
          .from('creator_content_prices')
          .upsert({
            creator_id: session.user.id,
            monthly_price: Number(values.monthly_price),
            description: values.description,
            features: values.features.split('\n').map(f => f.trim()),
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscription_tiers')
          .insert({
            name: values.tier_name || values.tier_level,
            price: Number(values.monthly_price),
            features: {
              description: values.description,
              items: values.features.split('\n').map(f => f.trim()),
            },
          });

        if (error) throw error;
      }

      toast({
        title: "Pricing updated",
        description: "Your subscription pricing has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update pricing. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Subscription Pricing</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="tier_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="single" id="single" />
                      <label htmlFor="single">Single Tier</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiple" id="multiple" />
                      <label htmlFor="multiple">Multiple Tiers</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {tierType === "multiple" && (
            <FormField
              control={form.control}
              name="tier_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tier Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="pro">Pro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {tierType === "multiple" && (
            <FormField
              control={form.control}
              name="tier_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tier Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="monthly_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe what subscribers will get"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Features</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="List features (one per line)"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter each feature on a new line
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Pricing"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};