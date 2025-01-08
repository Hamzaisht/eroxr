import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, LogIn } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (values: LoginValues) => Promise<void>;
  isLoading: boolean;
}

export const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-luxury-neutral">
                Email or Username <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                  <Input
                    {...field}
                    placeholder="Enter your email or username"
                    className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 focus:ring-luxury-primary/30 focus:border-luxury-primary/30"
                    disabled={isLoading}
                    required
                  />
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-luxury-neutral">
                Password <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-luxury-neutral/50" />
                  <Input
                    {...field}
                    type="password"
                    placeholder="Password"
                    className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50 focus:ring-luxury-primary/30 focus:border-luxury-primary/30"
                    disabled={isLoading}
                    required
                  />
                </div>
              </FormControl>
              <FormMessage className="text-sm text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-luxury-primary"
                />
              </FormControl>
              <FormLabel className="text-sm text-luxury-neutral cursor-pointer">
                Keep me signed in
              </FormLabel>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium group relative overflow-hidden"
          disabled={isLoading}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? "Signing in..." : "Sign in"}
            <LogIn className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-luxury-primary/20 to-luxury-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </form>
    </Form>
  );
};