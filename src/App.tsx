import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Shorts from "@/pages/Shorts";
import Dating from "@/pages/Dating";
import Messages from "@/pages/Messages";
import Eroboard from "@/pages/Eroboard";
import Login from "@/pages/Login";

function App() {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated and not on landing or login page,
    // redirect to login
    const path = window.location.pathname;
    if (!session && path !== "/" && path !== "/login") {
      navigate("/login");
    }
  }, [session, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/home" 
          element={
            session ? <Home /> : <Login />
          } 
        />
        <Route 
          path="/shorts" 
          element={
            session ? <Shorts /> : <Login />
          } 
        />
        <Route 
          path="/dating" 
          element={
            session ? <Dating /> : <Login />
          } 
        />
        <Route 
          path="/messages" 
          element={
            session ? <Messages /> : <Login />
          } 
        />
        <Route 
          path="/eroboard" 
          element={
            session ? <Eroboard /> : <Login />
          } 
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;