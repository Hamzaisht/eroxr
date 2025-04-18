
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Messages from "@/pages/Messages";
import Eroboard from "@/pages/Eroboard";
import Dating from "@/pages/Dating";
import Eros from "@/pages/Eros";
import ErosUpload from "@/pages/ErosUpload";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import Shorts from "@/pages/Shorts";
import ShortsUpload from "@/pages/ShortsUpload";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Index from "@/pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            {/* Landing route */}
            <Route path="/" element={<Index />} />
            
            {/* Auth routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            
            {/* Public routes */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/shorts" element={<Shorts />} />
              <Route path="/shorts/:videoId" element={<Shorts />} />
              <Route path="/eros" element={<Eros />} />
              <Route path="/eros/:videoId" element={<Eros />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/eroboard" element={<Eroboard />} />
                <Route path="/dating" element={<Dating />} />
                <Route path="/shorts/upload" element={<ShortsUpload />} />
                <Route path="/eros/upload" element={<ErosUpload />} />
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
