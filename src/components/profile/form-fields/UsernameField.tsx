import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Check, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { supabase } from "@/integrations/supabase/client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileFormValues } from "../types";

interface UsernameFieldProps {
  form: UseFormReturn<ProfileFormValues>;
  isLoading: boolean;
  canChangeUsername: boolean;
  currentUsername: string;
  lastUsernameChange: string | null;
}

export const UsernameField = ({
  form,
  isLoading,
  canChangeUsername,
  currentUsername,
  lastUsernameChange,
}: UsernameFieldProps) => {
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const debouncedUsername = useDebounce(form.watch("username"), 500);

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername || debouncedUsername === currentUsername) return;
      
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
  }, [debouncedUsername, currentUsername, form]);

  const daysUntilChange = lastUsernameChange
    ? 60 - Math.floor((Date.now() - new Date(lastUsernameChange).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <div className="relative">
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-muted-foreground">@</span>
                <Input
                  {...field}
                  className="pl-8"
                  disabled={isLoading || !canChangeUsername}
                />
              </div>
            </FormControl>
            {isCheckingUsername ? (
              <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-muted-foreground" />
            ) : field.value && !form.formState.errors.username ? (
              <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
            ) : field.value && form.formState.errors.username ? (
              <X className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
            ) : null}
          </div>
          <FormDescription>
            {!canChangeUsername && lastUsernameChange && (
              <span className="text-yellow-500">
                Username can be changed once every 60 days. Next change available in {daysUntilChange} days.
              </span>
            )}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};