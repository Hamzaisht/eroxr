import { SidebarProvider } from "@/components/ui/sidebar";
import { MainNav } from "@/components/MainNav";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-luxury-dark">
        <AppSidebar />
        <div className="flex-1">
          <MainNav />
          <main className="container mx-auto px-4 py-20">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}