
import { ReactNode } from "react";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center p-4 overflow-auto">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundEffects />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-md mx-auto py-8">
        {children}
      </div>
    </div>
  );
};
