import { BrowserRouter, Routes, Route } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - accessible to everyone */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - require authentication */}
        <Route element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/dating" element={<Dating />} />
          <Route path="/eroboard" element={<Eroboard />} />
          <Route path="/shorts" element={<Shorts />} />
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
          <Route path="features" element={<div>Platform Features</div>} />
          <Route path="verifications" element={<div>User Verifications</div>} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
