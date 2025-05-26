
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { GhostModeProvider } from '@/hooks/useGhostMode';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <QueryClientProvider client={new QueryClient()}>
      <SessionContextProvider supabaseClient={supabase} initialSession={session}>
        <GhostModeProvider>
          <Router>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<>Home</>} />
              </Routes>
            </ErrorBoundary>
            <Toaster />
          </Router>
        </GhostModeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;
