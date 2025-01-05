import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordValues } from "./types";

export const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Your password has been updated. Please sign in with your new password.",
        });
        navigate("/login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-secondary bg-clip-text text-transparent">
            Reset Password
          </h1>
          <p className="text-luxury-neutral/80">
            Enter your new password below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                        placeholder="New Password"
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
                        placeholder="Confirm New Password"
                        className="pl-10 h-12 bg-white/5 border-luxury-primary/20 text-white placeholder:text-white/50"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-red-400" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Updating Password..." : "Update Password"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};