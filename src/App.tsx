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
import Index from '@/pages/Index';

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

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/eroboard" element={<Eroboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/dating" element={<Dating />} />
          <Route path="/search" element={<Search />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;