import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-luxury-dark to-luxury-dark/95">
      <div className="container max-w-[2000px] mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
};