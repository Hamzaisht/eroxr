
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ProfilePage from "@/pages/ProfilePage";

function App() {
  return (
    <div className="min-h-screen">
      <Toaster />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<div>Home Page</div>} />
          </Route>
          <Route path="/profile/:username" element={<MainLayout />}>
            <Route index element={<ProfilePage />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
