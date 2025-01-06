import { MainNav } from "@/components/MainNav";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-luxury-dark">
      <AppSidebar />
      <div className="pl-64">
        <MainNav />
        <main className="container mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}