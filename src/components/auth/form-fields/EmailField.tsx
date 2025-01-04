import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";

interface EmailFieldProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const EmailField = ({ form, isLoading }: EmailFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
              <Input
                {...field}
                type="email"
                placeholder="Email"
                className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                disabled={isLoading}
              />
            </div>
          </FormControl>
          <FormMessage className="text-sm text-red-400" />
        </FormItem>
      )}
    />
  );
};