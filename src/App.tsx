
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route path="/" element={<MainLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/dating" element={<Dating />} />
          <Route path="/eroboard" element={<Eroboard />} />
          <Route path="/shorts" element={<Shorts />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
