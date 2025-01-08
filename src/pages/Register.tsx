import { AuthLayout } from "@/components/auth/layout/AuthLayout";
import { SignupForm } from "@/components/auth/signup/SignupForm";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const handleToggleMode = () => {
    navigate("/login");
  };

  return (
    <AuthLayout>
      <SignupForm onToggleMode={handleToggleMode} />
    </AuthLayout>
  );
}