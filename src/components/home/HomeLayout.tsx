
import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen bg-luxury-gradient relative overflow-x-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(155,135,245,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(155,135,245,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-luxury-primary/3 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-80 h-80 bg-luxury-accent/3 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main content with mobile-first responsive design */}
      <div className="relative z-10 w-full max-w-full mx-auto px-2 sm:px-4 lg:px-8 py-2 sm:py-6">
        <div className="w-full max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
