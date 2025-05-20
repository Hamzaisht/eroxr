// Import the existing components and hooks
import { useEffect } from 'react';
import { supabase, setUserIdForRls } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

function App({ Component, pageProps }) {
  const session = useSession();
  
  // Set user ID for RLS optimization when the session changes
  useEffect(() => {
    if (session?.user?.id) {
      setUserIdForRls(session.user.id);
    }
  }, [session?.user?.id]);
  
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default App;
