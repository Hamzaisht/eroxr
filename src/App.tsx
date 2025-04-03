import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Toaster } from "@/components/ui/toaster";

import { MainLayout } from "@/components/layout/MainLayout";
import GodmodeLayout from "@/components/admin/godmode/GodmodeLayout";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Dating from "@/pages/Dating";
import Eroboard from "@/pages/Eroboard";
import Shorts from "@/pages/Shorts";
import Eros from "@/pages/Eros";

// Admin platform pages
import { GodmodeDashboardHome } from "@/components/admin/godmode/GodmodeDashboardHome";
import Surveillance from "@/pages/admin/godmode/Surveillance";
import ContentFeed from "@/pages/admin/godmode/ContentFeed";
import Moderation from "@/pages/admin/godmode/Moderation";
import Verification from "@/pages/admin/godmode/Verification";
import Payouts from "@/pages/admin/godmode/Payouts";
import PlatformControl from "@/pages/admin/godmode/PlatformControl";
import AdminLogs from "@/pages/admin/godmode/AdminLogs";
import FlaggedContentPage from "@/pages/admin/platform/Flagged";

function App() {
  const session = useSession();
  
  // Add debug logging
  console.log("App rendering, session:", session ? "exists" : "null");
  console.log("User role:", session?.user?.user_metadata?.role || "not set");

  // Check for admin role in user metadata
  const role = session?.user?.user_metadata?.role;
  const isSuperAdmin = role === "super_admin";

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={session ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/register" element={session ? <Navigate to="/home" replace /> : <Register />} />

        {/* User */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={!session ? <Navigate to="/login" replace /> : <Home />} />
          <Route path="/profile/:id?" element={!session ? <Navigate to="/login" replace /> : <Profile />} />
          <Route path="/messages" element={!session ? <Navigate to="/login" replace /> : <Messages />} />
          <Route path="/dating" element={!session ? <Navigate to="/login" replace /> : <Dating />} />
          <Route path="/eroboard" element={!session ? <Navigate to="/login" replace /> : <Eroboard />} />
          <Route path="/shorts" element={!session ? <Navigate to="/login" replace /> : <Shorts />} />
          <Route path="/eros" element={!session ? <Navigate to="/login" replace /> : <Eros />} />
        </Route>

        {/* Admin Platform */}
        <Route path="/admin/godmode" element={<GodmodeLayout />}>
          <Route index element={<GodmodeDashboardHome />} />
          <Route path="*" element={<Navigate to="/admin/platform/surveillance" replace />} />
        </Route>

        {/* Consolidated Platform Routes */}
        <Route path="/admin/platform" element={<GodmodeLayout />}>
          <Route path="surveillance" element={<Surveillance />} />
          <Route path="content-feed" element={<ContentFeed />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="verification" element={<Verification />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="control" element={<PlatformControl />} />
          <Route path="logs" element={<AdminLogs />} />
          <Route path="flagged" element={<FlaggedContentPage />} />
          <Route index element={<Navigate to="/admin/platform/surveillance" replace />} />
        </Route>

        {/* Legacy admin routes - redirect to platform */}
        <Route path="/admin" element={<Navigate to="/admin/platform/surveillance" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin/platform/surveillance" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
