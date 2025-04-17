import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Messages from "@/pages/Messages";
import Conversation from "@/pages/Conversation";
import Eroboard from "@/pages/Eroboard";
import Dating from "@/pages/Dating";
import Eros from "@/pages/Eros";
import ErosUpload from "@/pages/ErosUpload";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ModalProvider } from "@/components/providers/ModalProvider";
import { AudioProvider } from "@/components/providers/AudioProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AudioProvider>
              <ModalProvider />
              <Routes>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/profile/:username" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/messages/:conversationId" element={<Conversation />} />
                  <Route path="/eroboard" element={<Eroboard />} />
                  <Route path="/dating" element={<Dating />} />
                  <Route path="/shorts" element={<Eros />} />
                  <Route path="/shorts/:videoId" element={<Eros />} />
                  <Route path="/shorts/upload" element={<ErosUpload />} />
                </Route>
              </Routes>
              <Toaster />
              <ReactQueryDevtools initialIsOpen={false} />
            </AudioProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
