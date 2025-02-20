
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
import { AdminLayout } from "./components/admin/AdminLayout";
import { Dashboard } from "./components/admin/Dashboard";
import { ErosMode } from "./components/admin/ErosMode";
import { useSession } from "@supabase/auth-helpers-react";

function App() {
  const session = useSession();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route 
          path="/" 
          element={session ? <Navigate to="/home" replace /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={session ? <Navigate to="/home" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={session ? <Navigate to="/home" replace /> : <Register />} 
        />
        
        {/* Protected routes - require authentication */}
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

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<div>Users Management</div>} />
          <Route path="messages" element={<div>Messages Overview</div>} />
          <Route path="photos" element={<div>Photos Moderation</div>} />
          <Route path="videos" element={<div>Videos Moderation</div>} />
          <Route path="saved" element={<div>Saved Content</div>} />
          <Route path="dating" element={<div>Dating Ads</div>} />
          <Route path="reports" element={<div>User Reports</div>} />
          <Route path="violations" element={<div>Security Violations</div>} />
          <Route path="features" element={<ErosMode />} />
          <Route path="verifications" element={<div>User Verifications</div>} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
