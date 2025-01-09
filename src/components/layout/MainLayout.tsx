import { useState } from "react";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <div className={`
        fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity
        ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
      `} onClick={() => setIsMobileMenuOpen(false)} />
      
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background border-r border-border
        transform transition-transform duration-200 ease-in-out lg:transform-none
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <AppSidebar onClose={() => setIsMobileMenuOpen(false)} />
      </div>

      <main className="flex-1 overflow-auto">
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-accent rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <div className="container mx-auto p-4">
          {children}
        </div>
      </main>
    </div>
  );
};