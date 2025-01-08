import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { SessionContextProvider, useSession } from '@supabase/auth-helpers-react';
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import About from "./pages/About";
import Messages from "./pages/Messages";
import Search from "./pages/Search";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";

// Session timeout wrapper component
const SessionTimeoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const navigate = useNavigate();
  let inactivityTimer: NodeJS.Timeout;

  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    if (session) {
      inactivityTimer = setTimeout(() => {
        supabase.auth.signOut();
        navigate('/login');
      }, 10 * 60 * 1000); // 10 minutes
    }
  };

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    
    events.forEach(event => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      events.forEach(event => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [session]);

  return <>{children}</>;
};

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <SessionTimeoutWrapper>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/about" element={<About />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/search" element={<Search />} />
          </Routes>
          <Toaster />
        </SessionTimeoutWrapper>
      </Router>
    </SessionContextProvider>
  );
}

export default App;