
import { useEffect, useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from "@supabase/auth-helpers-react";
import { LoadingScreen } from './LoadingScreen';
import { BackgroundVideo } from "@/components/video/BackgroundVideo";

export const AuthLayout = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  console.log("AuthLayout - session:", session ? "exists" : "null"); // Debug logging

  useEffect(() => {
    // Only redirect if we have a session AND we're on auth pages (login or register)
    const authPages = ['/login', '/register'];
    
    if (session && authPages.includes(location.pathname) && !isRedirecting) {
      // Set flag to prevent multiple redirects
      setIsRedirecting(true);
      
      // Check if there's a redirect path from previous navigation
      const returnPath = location.state?.from || '/home';
      console.log(`User is authenticated, redirecting to: ${returnPath}`);
      navigate(returnPath, { replace: true });
    }
  }, [session, navigate, location.pathname, location.state, isRedirecting]);

  // Show loading while session is being determined
  if (session === undefined) {
    return <LoadingScreen />;
  }

  // Demo page is accessible regardless of authentication status
  if (location.pathname === '/demo') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center">
      {/* Background Video */}
      <BackgroundVideo 
        videoUrl="/background-video.mp4"
        overlayOpacity={60}
      />
      
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-24">
        <Outlet />
      </div>
    </div>
  );
};
