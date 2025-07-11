
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminSessionProvider } from "@/contexts/AdminSessionContext";
import { ToastProvider } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Dating from "./pages/Dating";
import Messages from "./pages/Messages";
import Shorts from "./pages/Shorts";
import ShortsUpload from "./pages/ShortsUpload";
import Eroboard from "./pages/Eroboard";
import { Godmode } from "./pages/Godmode";
import { GodmodeDashboard } from "@/components/godmode/dashboard/GodmodeDashboard";
import { GodmodeUsers } from "@/components/godmode/users/GodmodeUsers";
import { GodmodeContent } from "@/components/godmode/content/GodmodeContent";
import { GodmodeMessages } from "@/components/godmode/messages/GodmodeMessages";
import { MainLayout } from "@/components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <AdminSessionProvider>
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
                    <Route path="/godmode" element={<Godmode />}>
                      <Route index element={<GodmodeDashboard />} />
                      <Route path="users" element={<GodmodeUsers />} />
                      <Route path="content" element={<GodmodeContent />} />
                      <Route path="messages" element={<GodmodeMessages />} />
                      <Route path="streams" element={<div className="text-white">Streams Management - Coming Soon</div>} />
                      <Route path="verification" element={<div className="text-white">Verification Management - Coming Soon</div>} />
                      <Route path="payouts" element={<div className="text-white">Payout Management - Coming Soon</div>} />
                      <Route path="flagged" element={<div className="text-white">Flagged Content - Coming Soon</div>} />
                      <Route path="search" element={<div className="text-white">Search Management - Coming Soon</div>} />
                      <Route path="logs" element={<div className="text-white">System Logs - Coming Soon</div>} />
                      <Route path="settings" element={<div className="text-white">Settings - Coming Soon</div>} />
                    </Route>
                    <Route element={<MainLayout />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/dating" element={<Dating />} />
                      <Route path="/messages" element={<Messages />} />
                      <Route path="/shorts" element={<Shorts />} />
                      <Route path="/shorts/upload" element={<ShortsUpload />} />
                      <Route path="/eroboard" element={<Eroboard />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/profile/:userId" element={<Profile />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </ErrorBoundary>
            </TooltipProvider>
          </ToastProvider>
        </AdminSessionProvider>
      </AuthProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
