import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { SignupForm } from "@/components/auth/signup/SignupForm";

export default function Register() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}