
import { ReactNode } from "react";

interface AuthContainerProps {
  children: ReactNode;
}

export const AuthContainer = ({ children }: AuthContainerProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-luxury-primary/10 via-luxury-accent/5 to-transparent rounded-2xl" />
      <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl p-8 shadow-2xl border border-luxury-primary/20">
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};
