
import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useSession } from "@supabase/auth-helpers-react";
import { LoadingScreen } from './LoadingScreen';

export const AuthLayout = () => {
  const session = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (session && location.pathname !== '/demo') {
      const returnPath = location.state?.from || '/home';
      navigate(returnPath, { replace: true });
    }
  }, [session, navigate, location]);

  if (location.pathname === '/demo') {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen w-full bg-luxury-dark flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_80%)] opacity-5" />
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-24">
        <Outlet />
      </div>
    </div>
  );
};
