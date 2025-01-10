import { ReactNode } from "react";

interface HomeLayoutProps {
  children: ReactNode;
}

export const HomeLayout = ({ children }: HomeLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-luxury-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-luxury-accent/10 blur-3xl animate-pulse" />
      </div>
      
      <div className="relative min-h-screen w-full backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
};