
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoPlayerProvider } from '@/components/video/VideoPlayerContext';

// Public pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';

// Auth protected pages
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';

function App() {
  return (
    <AuthProvider>
      <VideoPlayerProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            <Route element={<AuthLayout requireAuth={false} />}>
              <Route path="/login" element={<Login />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={<AuthLayout requireAuth={true} />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/profile/:id" element={<Profile />} />
                {/* Add other protected routes here */}
              </Route>
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </VideoPlayerProvider>
    </AuthProvider>
  );
}

export default App;
