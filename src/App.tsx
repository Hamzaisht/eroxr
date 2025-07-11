
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { GodmodeStreams } from "@/components/godmode/streams/GodmodeStreams";
import { GodmodeVerification } from "@/components/godmode/verification/GodmodeVerification";
import { GodmodePayouts } from "@/components/godmode/payouts/GodmodePayouts";
import { GodmodeFlagged } from "@/components/godmode/flagged/GodmodeFlagged";
import { GodmodeSearch } from "@/components/godmode/search/GodmodeSearch";
// import { GodmodeLogs } from "@/components/godmode/logs/GodmodeLogs"; // Temporarily disabled due to build issues
import { GodmodeSettings } from "@/components/godmode/settings/GodmodeSettings";
import { MainLayout } from "@/components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
                        <Route path="streams" element={<GodmodeStreams />} />
                        <Route path="verification" element={<GodmodeVerification />} />
                        <Route path="payouts" element={<GodmodePayouts />} />
                        <Route path="flagged" element={<GodmodeFlagged />} />
                        <Route path="search" element={<GodmodeSearch />} />
                        {/* <Route path="logs" element={<GodmodeLogs />} /> */}
                        <Route path="settings" element={<GodmodeSettings />} />
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
  </QueryClientProvider>
);

export default App;
