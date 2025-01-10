import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Eroboard from "@/pages/Eroboard";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  // Set up session refresh handling
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed successfully');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:id?" element={<Profile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/eroboard" element={<Eroboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;