
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import { MainLayout } from "@/components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <ToastProvider>
          <TooltipProvider>
            <ErrorBoundary>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/" element={<MainLayout />}>
                    <Route path="home" element={<Home />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/:userId" element={<Profile />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </ErrorBoundary>
          </TooltipProvider>
        </ToastProvider>
      </AuthProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
