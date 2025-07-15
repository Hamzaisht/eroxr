import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Search from './pages/Search';
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
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/auth" element={<Login />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/search" element={<Search />} />
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
