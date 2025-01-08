import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";

interface NameFieldsProps {
  form: UseFormReturn<SignupFormValues>;
  isLoading: boolean;
}

export const NameFields = ({ form, isLoading }: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                <Input
                  {...field}
                  placeholder="First Name"
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
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                <Input
                  {...field}
                  placeholder="Last Name"
                  className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                  disabled={isLoading}
                />
              </div>
            </FormControl>
            <FormMessage className="text-sm text-red-400" />
          </FormItem>
        )}
      />
    </div>
  );
};