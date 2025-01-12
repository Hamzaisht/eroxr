import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/layout/MainLayout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Profile from '@/pages/Profile';
import Eroboard from '@/pages/Eroboard';
import Messages from '@/pages/Messages';
import Dating from '@/pages/Dating';
import Search from '@/pages/Search';
import Shorts from '@/pages/Shorts';

const App = () => {
  const session = useSession();
  const supabase = useSupabaseClient();

  useEffect(() => {
    const handleError = (error: any) => {
      console.error('Supabase error:', error);
    };

    supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_OUT') {
        // Clear any cached data or state here
      }
    });

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, [supabase.auth]);

  return (
    <>
      <Routes>
        <Route path="/login" element={!session ? <Login /> : <Navigate to="/home" />} />
        
        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={session ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={session ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/eroboard" element={session ? <Eroboard /> : <Navigate to="/login" />} />
          <Route path="/messages" element={session ? <Messages /> : <Navigate to="/login" />} />
          <Route path="/dating" element={session ? <Dating /> : <Navigate to="/login" />} />
          <Route path="/search" element={session ? <Search /> : <Navigate to="/login" />} />
          <Route path="/shorts" element={session ? <Shorts /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
};

export default App;