
import { ReactNode } from "react";
import { BackgroundVideo } from "@/components/video/BackgroundVideo";
import { BackgroundEffects } from "@/components/layout/BackgroundEffects";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center overflow-auto">
      {/* Background Video */}
      <BackgroundVideo 
        videoUrl="/background-video.mp4"
        fallbackImage="/bg-fallback.jpg"
        overlayOpacity={60}
      />
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundEffects />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-24">
        {children}
      </div>
    </div>
  );
};
