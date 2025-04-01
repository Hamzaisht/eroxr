
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/integrations/supabase/client'
import { GhostModeProvider } from './context/GhostModeContext'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <SessionContextProvider supabaseClient={supabase}>
    <QueryClientProvider client={queryClient}>
      <GhostModeProvider>
        <App />
      </GhostModeProvider>
    </QueryClientProvider>
  </SessionContextProvider>
);
