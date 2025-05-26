
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
    console.log("App - Initializing application");
    
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
                  <Route path="messages" element={<div className="p-8 text-white">Messages Page - Coming Soon</div>} />
                  <Route path="dating" element={<div className="p-8 text-white">Dating Page - Coming Soon</div>} />
                  <Route path="shorts" element={<div className="p-8 text-white">Shorts Page - Coming Soon</div>} />
                  <Route path="stories" element={<div className="p-8 text-white">Stories Page - Coming Soon</div>} />
                  <Route path="profile" element={<div className="p-8 text-white">Profile Page - Coming Soon</div>} />
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
