import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import SettingsPage from './pages/SettingsPage';
import PostDetailsPage from './pages/PostDetailsPage';
import TrendingPage from './pages/TrendingPage';
import SearchPage from './pages/SearchPage';
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
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-luxury-darker via-luxury-dark to-luxury-darker">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/post/:id" element={<PostDetailsPage />} />
              <Route path="/trending" element={<TrendingPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/premium-success" element={<PremiumSuccessPage />} />
              <Route path="/premium-cancelled" element={<PremiumCancelledPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
