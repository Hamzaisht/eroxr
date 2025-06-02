import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { GodMode } from "@/pages/GodMode";
import { BD } from "@/pages/BD";
import { ErrorBoundary } from "react-error-boundary";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <div className="min-h-screen">
      <Toaster />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/godmode" element={<GodMode />} />
          <Route path="/bd" element={<BD />} />
          <Route path="/profile/:username" element={<MainLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
