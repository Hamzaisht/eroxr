
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoPlayerProvider } from '@/components/video/VideoPlayerContext';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';

function App() {
  return (
    <AuthProvider>
      <VideoPlayerProvider>
        <BrowserRouter>
          <Routes>
            {/* Public landing page */}
            <Route element={<AuthLayout requireAuth={false} redirectAuthenticatedTo="/home" />}>
              <Route path="/" element={<Landing />} />
            </Route>
            
            {/* Public auth routes */}
            <Route element={<AuthLayout requireAuth={false} redirectAuthenticatedTo="/home" />}>
              <Route path="/login" element={<Login />} />
            </Route>
            
            {/* Protected routes */}
            <Route element={<AuthLayout requireAuth={true} redirectUnauthenticatedTo="/login" />}>
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/profile/:id" element={<Profile />} />
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
