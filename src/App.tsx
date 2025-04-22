import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./components/AuthProvider";
import { Toaster } from "./components/ui/toaster";
import { LoadingScreen } from "./components/layout/LoadingScreen";

// Import our custom animations
import "./styles/dating-animations.css";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Messages = lazy(() => import("./pages/Messages"));
const Dating = lazy(() => import("./pages/Dating"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Eroboard = lazy(() => import("./pages/Eroboard"));
const EroboardDashboard = lazy(() => import("./pages/EroboardDashboard"));
const EroboardContent = lazy(() => import("./pages/EroboardContent"));
const EroboardAnalytics = lazy(() => import("./pages/EroboardAnalytics"));
const EroboardMonetization = lazy(() => import("./pages/EroboardMonetization"));
const EroboardSettings = lazy(() => import("./pages/EroboardSettings"));
const Story = lazy(() => import("./pages/Story"));
const CreateStory = lazy(() => import("./pages/CreateStory"));
const WatchStory = lazy(() => import("./pages/WatchStory"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/dating" element={<Dating />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/eroboard" element={<Eroboard />} />
            <Route path="/eroboard/dashboard" element={<EroboardDashboard />} />
            <Route path="/eroboard/content" element={<EroboardContent />} />
            <Route path="/eroboard/analytics" element={<EroboardAnalytics />} />
            <Route path="/eroboard/monetization" element={<EroboardMonetization />} />
            <Route path="/eroboard/settings" element={<EroboardSettings />} />
            <Route path="/story" element={<Story />} />
            <Route path="/story/create" element={<CreateStory />} />
            <Route path="/story/watch/:id" element={<WatchStory />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <Toaster />
      </AuthProvider>
    </Router>
  );
}

export default App;
