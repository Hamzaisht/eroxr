import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import About from "./pages/About";
import { Toaster } from "@/components/ui/toaster";
import { MainNav } from "./components/MainNav";

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const session = useSession();

  // If user is authenticated and tries to access login or landing, redirect to home
  if (session && (window.location.pathname === '/login' || window.location.pathname === '/')) {
    return <Navigate to="/home" replace />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-luxury-dark">
        {session && <MainNav />}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;