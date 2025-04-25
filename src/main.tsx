
import React from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "./index.css";
import "./App.css";
import "./styles/animations.css";
import "./styles/dating-animations.css";

import App from "./App";

// Use the same hardcoded values as in src/integrations/supabase/client.ts
const supabaseUrl = 'https://ysqbdaeohlupucdmivkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzcWJkYWVvaGx1cHVjZG1pdmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NDM5NzMsImV4cCI6MjA1MTUxOTk3M30.Prjer9goZnkniotLSw4wQF3HXbfjm95jr4W7zvNK2PQ';

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
