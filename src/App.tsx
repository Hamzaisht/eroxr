
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Dating from "@/pages/Dating";
import Eroboard from "@/pages/Eroboard";
import Shorts from "@/pages/Shorts";
import { useSession } from "@supabase/auth-helpers-react";
import GodmodeDashboard from "./pages/admin/GodmodeDashboard";
import { GodmodeDashboardHome } from "@/components/admin/godmode/GodmodeDashboardHome";
import Surveillance from "./pages/admin/godmode/Surveillance";
import ContentFeed from "./pages/admin/godmode/ContentFeed";
import Moderation from "./pages/admin/godmode/Moderation";
import Verification from "./pages/admin/godmode/Verification";
import Payouts from "./pages/admin/godmode/Payouts";
import PlatformControl from "./pages/admin/godmode/PlatformControl";
import AdminLogs from "./pages/admin/godmode/AdminLogs";

function App() {
  const session = useSession();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<Landing />} 
        />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/home" replace /> : <Register />} 
        />
        
        <Route element={<MainLayout />}>
          <Route 
            path="/home" 
            element={!session ? <Navigate to="/login" replace /> : <Home />} 
          />
          <Route 
            path="/profile/:id?" 
            element={!session ? <Navigate to="/login" replace /> : <Profile />} 
          />
          <Route 
            path="/messages" 
            element={!session ? <Navigate to="/login" replace /> : <Messages />} 
          />
          <Route 
            path="/dating" 
            element={!session ? <Navigate to="/login" replace /> : <Dating />} 
          />
          <Route 
            path="/eroboard" 
            element={!session ? <Navigate to="/login" replace /> : <Eroboard />} 
          />
          <Route 
            path="/shorts" 
            element={!session ? <Navigate to="/login" replace /> : <Shorts />} 
          />
        </Route>

        {/* New Godmode Dashboard */}
        <Route path="/admin/godmode" element={<GodmodeDashboard />}>
          <Route index element={<GodmodeDashboardHome />} />
          <Route path="surveillance" element={<Surveillance />} />
          <Route path="content" element={<ContentFeed />} />
          <Route path="moderation" element={<Moderation />} />
          <Route path="verification" element={<Verification />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="platform" element={<PlatformControl />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>

        {/* Redirect old admin routes to new godmode dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/godmode" replace />} />
        <Route path="/admin/*" element={<Navigate to="/admin/godmode" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
