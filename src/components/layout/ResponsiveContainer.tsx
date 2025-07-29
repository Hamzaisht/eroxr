import { ReactNode } from "react";
import { useIsMobile, useBreakpoint } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
  padding?: boolean;
  fullWidth?: boolean;
}

export const ResponsiveContainer = ({
  children,
  className = "",
  mobileClassName = "",
  tabletClassName = "",
  desktopClassName = "",
  padding = true,
  fullWidth = false
}: ResponsiveContainerProps) => {
  const isMobile = useIsMobile();
  const { isTablet, isDesktop } = useBreakpoint();

  const containerClasses = cn(
    // Base classes
    "w-full",
    !fullWidth && "max-w-7xl mx-auto",
    
    // Responsive padding
    padding && [
      isMobile && "px-3 py-2",
      isTablet && "px-6 py-4", 
      isDesktop && "px-8 py-6"
    ],
    
    // Custom classes
    className,
    isMobile && mobileClassName,
    isTablet && tabletClassName,
    isDesktop && desktopClassName
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};