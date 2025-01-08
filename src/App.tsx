import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useSession } from "@supabase/auth-helpers-react";
import Home from "@/pages/Home";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Categories from "@/pages/Categories";
import Eroboard from "@/pages/Eroboard";
import Settings from "@/pages/Settings";

function App() {
  const session = useSession();

  return (
    <>
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
          path="/"
          element={session ? <Home /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/profile"
          element={session ? <Profile /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/messages"
          element={session ? <Messages /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/categories"
          element={session ? <Categories /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/eroboard"
          element={session ? <Eroboard /> : <Navigate to="/landing" replace />}
        />
        <Route
          path="/settings"
          element={session ? <Settings /> : <Navigate to="/landing" replace />}
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;