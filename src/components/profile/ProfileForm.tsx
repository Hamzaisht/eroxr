import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
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
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useDebounce } from "@/hooks/use-debounce";
import { Check, X, Loader2 } from "lucide-react";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  location: z.string().optional(),
  interests: z.string().optional(),
  profile_visibility: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  onSave?: () => void;
}

export const ProfileForm = ({ onSave }: ProfileFormProps) => {
  const { toast } = useToast();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [lastUsernameChange, setLastUsernameChange] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      bio: "",
      location: "",
      interests: "",
      profile_visibility: true,
    },
  });

  const debouncedUsername = useDebounce(form.watch("username"), 500);

  // Check username availability and change restrictions
  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername || debouncedUsername === currentUsername) return;
      
      setIsCheckingUsername(true);
      try {
        const { data: existingUser, error } = await supabase
          .from("profiles")
          .select("username")
          .eq("username", debouncedUsername)
          .single();

        if (error && error.code !== "PGRST116") {
          toast({
            title: "Error",
            description: "Failed to check username availability",
            variant: "destructive",
          });
        }

        if (existingUser) {
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

  // Load initial profile data and username change timestamp
  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        return;
      }

      if (profile) {
        setCurrentUsername(profile.username || "");
        form.reset({
          username: profile.username || "",
          bio: profile.bio || "",
          location: profile.location || "",
          interests: profile.interests?.join(", ") || "",
          profile_visibility: profile.profile_visibility ?? true,
        });

        // Check if username can be changed
        const lastChange = profile.last_username_change;
        setLastUsernameChange(lastChange);
        if (lastChange) {
          const daysSinceChange = Math.floor((Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24));
          setCanChangeUsername(daysSinceChange >= 60);
        }
      }
    };

    loadProfile();
  }, [session?.user?.id]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    try {
      const updates = {
        username: values.username,
        bio: values.bio,
        location: values.location,
        interests: values.interests ? values.interests.split(",").map(i => i.trim()) : [],
        profile_visibility: values.profile_visibility,
        ...(values.username !== currentUsername && {
          last_username_change: new Date().toISOString(),
        }),
      };

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      onSave?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    Username can be changed once every 60 days. Next change available in{" "}
                    {60 - Math.floor((Date.now() - new Date(lastUsernameChange).getTime()) / (1000 * 60 * 60 * 24))} days.
                  </span>
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Tell others about yourself (max 500 characters)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interests</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. photography, travel, music" />
              </FormControl>
              <FormDescription>
                Separate interests with commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profile_visibility"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Profile Visibility</FormLabel>
                <FormDescription>
                  Make your profile visible to other users
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};
