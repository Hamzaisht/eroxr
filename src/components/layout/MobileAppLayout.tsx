import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MobileBottomNav } from "./MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileAppLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
  className?: string;
}

export const MobileAppLayout = ({ 
  children, 
  hideBottomNav = false, 
  className = "" 
}: MobileAppLayoutProps) => {
  const isMobile = useIsMobile();
  const location = useLocation();

  // Add app-like behavior on mobile
  useEffect(() => {
    if (isMobile) {
      // Prevent bounce/overscroll on iOS
      document.body.style.overscrollBehavior = 'none';
      document.body.style.position = 'relative';
      
      // Add safe area support
      document.documentElement.style.setProperty('--safe-area-inset-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--safe-area-inset-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--safe-area-inset-left', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--safe-area-inset-right', 'env(safe-area-inset-right)');
      
      return () => {
        document.body.style.overscrollBehavior = '';
        document.body.style.position = '';
      };
    }
  }, [isMobile]);

  // Determine if we should show bottom nav based on route
  const shouldHideBottomNav = hideBottomNav || 
    location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/register' ||
    location.pathname.startsWith('/auth');

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={cn(
      "min-h-screen-mobile bg-luxury-gradient relative overflow-x-hidden",
      "mobile-app-container gpu-accelerate touch-optimized app-container",
      className
    )}>
      {/* Mobile viewport meta optimization */}
      <style>{`
        @viewport {
          width: device-width;
          initial-scale: 1.0;
          maximum-scale: 1.0;
          user-scalable: no;
        }
      `}</style>

      {/* Background effects - optimized for mobile */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(155,135,245,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(155,135,245,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-10 left-10 w-48 h-48 bg-luxury-primary/3 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-16 w-40 h-40 bg-luxury-accent/3 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Main content area with proper spacing */}
      <main className={cn(
        "relative z-10 min-h-screen-mobile smooth-mobile-scroll",
        "safe-area-pt safe-area-pl safe-area-pr critical-render",
        !shouldHideBottomNav && "pb-20 safe-area-pb"
      )}>
        {children}
      </main>

      {/* Mobile bottom navigation */}
      {!shouldHideBottomNav && <MobileBottomNav />}

      {/* Touch feedback overlay */}
      <div className="pointer-events-none fixed inset-0 z-50" id="touch-feedback-overlay" />
    </div>
  );
};