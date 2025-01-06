import { useState } from "react";
import { AppSidebar } from "./AppSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-luxury-dark flex">
      <motion.div
        initial={false}
        animate={{ width: isSidebarCollapsed ? "64px" : "256px" }}
        className="relative"
      >
        <AppSidebar collapsed={isSidebarCollapsed} />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-8 z-50 bg-luxury-dark/50 backdrop-blur-sm border border-luxury-neutral/10 rounded-full shadow-lg"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
      <div className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`}>
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}