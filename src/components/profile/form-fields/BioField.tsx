import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { ProfileFormValues } from "../types";

interface BioFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export const BioField = ({ form }: BioFieldProps) => {
  return (
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
  );
};