import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import { useToast } from "@/hooks/use-toast";

const App = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else if (event === 'SIGNED_IN') {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, toast]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <Landing />}
        />
        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <MainLayout>
              <Messages />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <Profile />
            </MainLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
};

export default App;