import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { ProfileFormValues } from "../types";

interface VisibilityFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const VisibilityField = ({ form }: VisibilityFieldProps) => {
  return (
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
  );
};