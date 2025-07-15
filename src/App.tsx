import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { ToastProvider } from './hooks/use-toast';
import { MainLayout } from './components/layout/MainLayout';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
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
              
              {/* Main app routes with navigation */}
              <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/profile/:userId" element={<MainLayout><Profile /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              <Route path="/search" element={<MainLayout><Search /></MainLayout>} />
              <Route path="/subscription" element={<MainLayout><Subscription /></MainLayout>} />
              <Route path="/test" element={<MainLayout><PlatformTest /></MainLayout>} />
              <Route path="/premium-success" element={<MainLayout><PremiumSuccessPage /></MainLayout>} />
              <Route path="/premium-cancelled" element={<MainLayout><PremiumCancelledPage /></MainLayout>} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
