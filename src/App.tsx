import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { MainLayout } from "@/components/layout/MainLayout";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Settings from "@/pages/Settings";
import Search from "@/pages/Search";
import Categories from "@/pages/Categories";
import About from "@/pages/About";
import Demo from "@/pages/Demo";

export default function App() {
  const session = useSession();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/landing" element={<Landing />} />
      <Route 
        path="/login" 
        element={!session ? <Login /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!session ? <Register /> : <Navigate to="/" replace />} 
      />

      {/* Protected routes */}
      <Route
        element={
          session ? (
            <MainLayout>
              <Outlet />
            </MainLayout>
          ) : (
            <Navigate to="/landing" replace />
          )
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id?" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<Search />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/demo" element={<Demo />} />
      </Route>

      {/* Catch all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}