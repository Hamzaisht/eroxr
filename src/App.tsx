
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ToastProvider } from "@/hooks/use-toast";
import { GhostModeProvider } from "@/hooks/useGhostMode";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import Index from "./pages/Index";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ensureStorageBuckets } from "./utils/upload/ensureBuckets";

function App() {
  useEffect(() => {
    // Ensure all required storage buckets exist
    ensureStorageBuckets().catch(err => 
      console.error("Error initializing storage buckets:", err)
    );
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ToastProvider>
          <GhostModeProvider>
            <BrowserRouter>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes with MainLayout */}
                <Route path="/*" element={<MainLayout />}>
                  <Route path="home" element={<Home />} />
                  {/* Add other protected routes here as needed */}
                </Route>
                
                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
          </GhostModeProvider>
        </ToastProvider>
      </ThemeProvider>
    </SessionContextProvider>
  );
}

export default App;
