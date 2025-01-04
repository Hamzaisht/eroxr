import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";

interface PasswordFieldsProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const PasswordFields = ({ form, isLoading }: PasswordFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                  disabled={isLoading}
                />
              </div>
            </FormControl>
            <FormMessage className="text-sm text-red-400" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                <Input
                  {...field}
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                  disabled={isLoading}
                />
              </div>
            </FormControl>
            <FormMessage className="text-sm text-red-400" />
          </FormItem>
        )}
      />
    </>
  );
};