import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ToastProvider } from './hooks/use-toast';

import Landing from './pages/Landing';
import Home from './pages/Home';
import Dating from './pages/Dating';
import Messages from './pages/Messages';
import Eroboard from './pages/Eroboard';
import Shorts from './pages/Shorts';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Settings from './pages/Settings';
import Search from './pages/Search';
import Subscription from './pages/Subscription';
import PlatformTest from './pages/PlatformTest';
import PremiumSuccessPage from "./pages/PremiumSuccessPage";
import PremiumCancelledPage from "./pages/PremiumCancelledPage";
import CreatorSignup from './pages/CreatorSignup';
import { Godmode } from './pages/Godmode';
import { AdminSessionProvider } from './contexts/AdminSessionContext';
import { GodmodeDashboard } from './components/godmode/dashboard/GodmodeDashboard';
import { GodmodeVerification } from './components/godmode/verification/GodmodeVerification';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Landing page without main layout */}
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Main app routes */}
              <Route path="/home" element={<Home />} />
              <Route path="/dating" element={<Dating />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/eroboard" element={<Eroboard />} />
              <Route path="/shorts" element={<Shorts />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/new-profile" element={<Profile />} />
              <Route path="/new-profile/:userId" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/creator-signup" element={<CreatorSignup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/test" element={<PlatformTest />} />
              <Route path="/premium-success" element={<PremiumSuccessPage />} />
              <Route path="/premium-cancelled" element={<PremiumCancelledPage />} />
              
              {/* Admin routes */}
              <Route path="/godmode" element={
                <AdminSessionProvider>
                  <Godmode />
                </AdminSessionProvider>
              } />
              <Route path="/godmode/verification" element={
                <AdminSessionProvider>
                  <GodmodeVerification />
                </AdminSessionProvider>
              } />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
