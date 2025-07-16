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
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/test" element={<PlatformTest />} />
              <Route path="/premium-success" element={<PremiumSuccessPage />} />
              <Route path="/premium-cancelled" element={<PremiumCancelledPage />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
