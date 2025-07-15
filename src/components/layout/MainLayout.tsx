import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from './AppSidebar';
import { MainNav } from '../MainNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-luxury-darker via-luxury-dark to-luxury-darker">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <MainNav />
          <main className="flex-1 pt-16"> {/* pt-16 to account for fixed nav height */}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};