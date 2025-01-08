import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";
import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Loader2 } from "lucide-react";

interface UsernameFieldProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const UsernameField = ({ form, isLoading }: UsernameFieldProps) => {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debouncedUsername = useDebounce(form.watch("username"), 500);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername) return;
      
      setIsCheckingUsername(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username")
          .ilike("username", debouncedUsername)
          .limit(1);

        if (error) {
          console.error("Error checking username:", error);
          form.setError("username", {
            type: "manual",
            message: "Failed to check username availability",
          });
        } else if (data && data.length > 0) {
          form.setError("username", {
            type: "manual",
            message: "Username is already taken",
          });
        } else {
          form.clearErrors("username");
        }
      } catch (error) {
        console.error("Error checking username:", error);
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername, form]);

  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-luxury-neutral">
            Username <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
              <Input
                {...field}
                placeholder="Username"
                className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                disabled={isLoading}
                required
              />
              {isCheckingUsername ? (
                <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-luxury-neutral/50" />
              ) : field.value && !form.formState.errors.username ? (
                <Check className="absolute right-3 top-3.5 h-5 w-5 text-green-500" />
              ) : field.value && form.formState.errors.username ? (
                <X className="absolute right-3 top-3.5 h-5 w-5 text-red-500" />
              ) : null}
            </div>
          </FormControl>
          <FormMessage className="text-sm text-red-400" />
        </FormItem>
      )}
    />
  );
};