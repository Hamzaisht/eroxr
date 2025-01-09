import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Categories from "@/pages/Categories";
import Eroboard from "@/pages/Eroboard";
import Settings from "@/pages/Settings";

function App() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking session:', error);
        navigate('/login');
        return;
      }

      if (!currentSession && window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/landing') {
        navigate('/login');
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/landing') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/landing" element={<Landing />} />
        <Route 
          path="/login" 
          element={!session ? <Login /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/register" 
          element={!session ? <Register /> : <Navigate to="/" replace />} 
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={session ? <Home /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/profile"
          element={session ? <Profile /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/messages"
          element={session ? <Messages /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/categories"
          element={session ? <Categories /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/eroboard"
          element={session ? <Eroboard /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/settings"
          element={session ? <Settings /> : <Navigate to="/landing" replace />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;