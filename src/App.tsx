
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/hooks/use-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Discover from "@/pages/Discover";
import CreatorSignup from "@/pages/CreatorSignup";
import Features from "@/pages/Features";
import About from "@/pages/About";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Contact from "@/pages/Contact";
import Support from "@/pages/Support";
import Eroboard from "@/pages/Eroboard";
import Settings from "@/pages/Settings";
import Subscription from "@/pages/Subscription";
import Trending from "@/pages/Trending";
import Notifications from "@/pages/Notifications";
import Dating from "@/pages/Dating";
import DatingFavorites from "@/pages/DatingFavorites";
import Eros from "@/pages/Eros";
import Shorts from "@/pages/Shorts";
import ShortsUpload from "@/pages/ShortsUpload";
import ShortsEdit from "@/pages/ShortsEdit";
import { Godmode } from "@/pages/Godmode";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <AuthProvider>
          <ToastProvider>
            <TooltipProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<Settings />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/creator-signup" element={<CreatorSignup />} />
                <Route path="/features" element={<Features />} />
                <Route path="/about" element={<About />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/support" element={<Support />} />
                <Route path="/eroboard" element={<Eroboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/dating" element={<Dating />} />
                <Route path="/dating/favorites" element={<DatingFavorites />} />
                <Route path="/eros" element={<Eros />} />
                <Route path="/shorts" element={<Shorts />} />
                <Route path="/shorts/upload" element={<ShortsUpload />} />
                <Route path="/shorts/:id/edit" element={<ShortsEdit />} />
                <Route path="/admin" element={<Godmode />} />
              </Routes>
              <Toaster />
            </Router>
            <Sonner />
            </TooltipProvider>
          </ToastProvider>
        </AuthProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
