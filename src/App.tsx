
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ToastProvider } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import ProfilePage from "@/pages/ProfilePage";
import Home from "@/pages/Home";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from './integrations/supabase/client';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <BrowserRouter>
          <ToastProvider>
            <div className="min-h-screen">
              <Toaster />
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/home" element={<MainLayout />}>
                    <Route index element={<Home />} />
                  </Route>
                  <Route path="/profile/:username" element={<MainLayout />}>
                    <Route index element={<ProfilePage />} />
                  </Route>
                </Routes>
              </ErrorBoundary>
            </div>
          </ToastProvider>
        </BrowserRouter>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
