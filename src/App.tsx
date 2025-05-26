
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { ToastProvider } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import { MainLayout } from '@/components/layout/MainLayout';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase} initialSession={session}>
        <ToastProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/*" element={<MainLayout />}>
                  <Route path="home" element={<Home />} />
                </Route>
              </Routes>
              <Toaster />
            </ErrorBoundary>
          </Router>
        </ToastProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
