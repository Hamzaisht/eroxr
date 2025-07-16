import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";

interface LastNameFieldProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const LastNameField = ({ form, isLoading }: LastNameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="lastName"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-luxury-neutral">
            Last Name <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
              <Input
                {...field}
                placeholder="Last Name"
                className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                disabled={isLoading}
                required
              />
            </div>
          </FormControl>
          <FormMessage className="text-sm text-red-400" />
        </FormItem>
      )}
    />
  );
};