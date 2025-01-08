import { useState } from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { SignupFormValues } from "../types";

interface PasswordFieldProps {
  form: UseFormReturn<SignupFormValues>;
  name: "password" | "confirmPassword";
  placeholder: string;
  isLoading: boolean;
}

export const PasswordField = ({ form, name, placeholder, isLoading }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="pl-3 pr-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 focus:ring-luxury-primary/30 focus:border-luxury-primary/30"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-luxury-neutral/50" />
                ) : (
                  <Eye className="h-5 w-5 text-luxury-neutral/50" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage className="text-sm text-red-400" />
        </FormItem>
      )}
    />
  );
};