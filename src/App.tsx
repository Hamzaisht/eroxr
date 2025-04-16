
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Layout components
import Layout from './components/layout/Layout';
import { AdminRoutes } from './components/admin/routes/AdminRoutes';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Shorts = lazy(() => import('./pages/Shorts'));
const Eros = lazy(() => import('./pages/Eros'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary fallback={<div className="p-8">Something went wrong. Please refresh the page.</div>}>
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <Routes>
              {/* Public routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/shorts" element={<Shorts />} />
                <Route path="/eros" element={<Eros />} />
                <Route path="/profile/:id" element={<Profile />} />
              </Route>
              
              {/* Auth routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={<AdminRoutes />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
