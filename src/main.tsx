
import React from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

import "./index.css";
import "./App.css";
import "./styles/animations.css";
import "./styles/dating-animations.css";

import App from "./App";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || "",
  import.meta.env.VITE_SUPABASE_ANON_KEY || ""
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
