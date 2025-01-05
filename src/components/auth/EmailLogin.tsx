import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoginFields } from "./form-fields/LoginFields";
import { ForgotPasswordFields } from "./form-fields/ForgotPasswordFields";
import { LoginHeader } from "./LoginHeader";
import { LoginActions } from "./LoginActions";
import { loginSchema, type LoginValues } from "./types";
import { useAuthHandlers } from "./handlers/useAuthHandlers";

interface EmailLoginProps {
  onToggleMode: () => void;
}

export const EmailLogin = ({ onToggleMode }: EmailLoginProps) => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const { isLoading, handleForgotPassword, handleLogin } = useAuthHandlers();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    if (isForgotPassword) {
      const success = await handleForgotPassword(values.email);
      if (success) {
        setIsForgotPassword(false);
      }
      return;
    }

    await handleLogin(values);
  };

  return (
    <div className="space-y-8">
      <LoginHeader isForgotPassword={isForgotPassword} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {isForgotPassword ? (
            <ForgotPasswordFields form={form} isLoading={isLoading} />
          ) : (
            <LoginFields form={form} isLoading={isLoading} isForgotPassword={isForgotPassword} />
          )}

          <Button
            type="submit"
            className="w-full bg-button-gradient hover:bg-hover-gradient transition-all duration-300 h-12 text-lg font-medium"
            disabled={isLoading}
          >
            {isLoading 
              ? (isForgotPassword ? "Sending..." : "Signing in...") 
              : (isForgotPassword ? "Send Reset Link" : "Sign In")}
          </Button>
        </form>
      </Form>

      <LoginActions 
        isLoading={isLoading}
        isForgotPassword={isForgotPassword}
        onToggleForgotPassword={() => setIsForgotPassword(!isForgotPassword)}
        onToggleMode={onToggleMode}
      />
    </div>
  );
};