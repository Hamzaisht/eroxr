import { UseFormReturn } from "react-hook-form";
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

interface InterestsFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const InterestsField = ({ form }: InterestsFieldProps) => {
  return (
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
  );
};