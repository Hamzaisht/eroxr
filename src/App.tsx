import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Shorts from "@/pages/Shorts";
import Dating from "@/pages/Dating";
import Messages from "@/pages/Messages";
import Eroboard from "@/pages/Eroboard";
import Login from "@/pages/Login";

function App() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up session refresh handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    // Check session on mount
    const checkSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error || !currentSession) {
        const path = window.location.pathname;
        if (path !== "/" && path !== "/login") {
          navigate('/login');
        }
      }
    };
    
    checkSession();
    return () => subscription.unsubscribe();
  }, [navigate]);

  // Protect routes that require authentication
  useEffect(() => {
    const path = window.location.pathname;
    if (!session && path !== "/" && path !== "/login") {
      navigate("/login");
    }
  }, [session, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/home" 
          element={
            session ? <Home /> : <Login />
          } 
        />
        <Route 
          path="/shorts" 
          element={
            session ? <Shorts /> : <Login />
          } 
        />
        <Route 
          path="/dating" 
          element={
            session ? <Dating /> : <Login />
          } 
        />
        <Route 
          path="/messages" 
          element={
            session ? <Messages /> : <Login />
          } 
        />
        <Route 
          path="/eroboard" 
          element={
            session ? <Eroboard /> : <Login />
          } 
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;