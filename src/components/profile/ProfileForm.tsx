import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UsernameField } from "./form-fields/UsernameField";
import { BioField } from "./form-fields/BioField";
import { LocationField } from "./form-fields/LocationField";
import { InterestsField } from "./form-fields/InterestsField";
import { VisibilityField } from "./form-fields/VisibilityField";
import { profileSchema, type ProfileFormValues } from "./types";

interface ProfileFormProps {
  onSave?: () => void;
}

export const ProfileForm = ({ onSave }: ProfileFormProps) => {
  const { toast } = useToast();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    const loadProfile = async () => {
      if (!session?.user?.id) {
        console.log("No session user ID found");
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please sign in to edit your profile",
        });
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data",
          });
          return;
        }

        if (profile) {
          console.log("Setting form values with profile:", profile);
          setCurrentUsername(profile.username || "");
          form.reset({
            username: profile.username || "",
            bio: profile.bio || "",
            location: profile.location || "",
            interests: profile.interests?.join(", ") || "",
            profile_visibility: profile.profile_visibility ?? true,
          });

          const lastChange = profile.last_username_change;
          setLastUsernameChange(lastChange);
          if (lastChange) {
            const daysSinceChange = Math.floor(
              (Date.now() - new Date(lastChange).getTime()) / (1000 * 60 * 60 * 24)
            );
            setCanChangeUsername(daysSinceChange >= 60);
          }
        }
      } catch (error) {
        console.error("Error in loadProfile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data",
        });
      }
    };

    loadProfile();
  }, [session?.user?.id, form, toast]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Please sign in to update your profile",
      });
      return;
    }

    setIsLoading(true);
    console.log("Submitting form values:", values);

    try {
      const updates = {
        id: session.user.id,
        username: values.username,
        bio: values.bio,
        location: values.location,
        interests: values.interests ? values.interests.split(",").map(i => i.trim()) : [],
        profile_visibility: values.profile_visibility,
        ...(values.username !== currentUsername && {
          last_username_change: new Date().toISOString(),
        }),
        updated_at: new Date().toISOString(),
      };

      console.log("Sending update to Supabase:", updates);

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      
      onSave?.();
    } catch (error) {
      console.error("Error updating profile:", error);
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
        <UsernameField
          form={form}
          isLoading={isLoading}
          canChangeUsername={canChangeUsername}
          currentUsername={currentUsername}
          lastUsernameChange={lastUsernameChange}
        />
        <BioField form={form} />
        <LocationField form={form} />
        <InterestsField form={form} />
        <VisibilityField form={form} />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};