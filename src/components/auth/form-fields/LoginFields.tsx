import { Mail, Lock } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { LoginValues } from "../types";
import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LoginFieldsProps {
  form: UseFormReturn<LoginValues>;
  isLoading: boolean;
  isForgotPassword: boolean;
}

export const LoginFields = ({ form, isLoading, isForgotPassword }: LoginFieldsProps) => {
  return (
    <>
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
                  autoComplete="email"
                />
              </div>
            </FormControl>
            <FormMessage className="text-sm text-red-400" />
          </FormItem>
        )}
      />

      {!isForgotPassword && (
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
                    autoComplete="current-password"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-400" />
            </FormItem>
          )}
        />
      )}
    </>
  );
};