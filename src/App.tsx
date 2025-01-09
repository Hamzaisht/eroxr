import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Profile from "@/pages/Profile";

const queryClient = new QueryClient();

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/profile/:id?" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </SessionContextProvider>
  );
}

export default App;