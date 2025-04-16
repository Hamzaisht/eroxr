
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import LoadingScreen from '@/components/layout/LoadingScreen';

// Layout components
import Layout from './components/layout/Layout';
import { AdminRoutes } from './components/admin/routes/AdminRoutes';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Index = lazy(() => import('./pages/Index'));
const Shorts = lazy(() => import('./pages/Shorts'));
const Eros = lazy(() => import('./pages/Eros'));
const Categories = lazy(() => import('./pages/Categories'));
const Dating = lazy(() => import('./pages/Dating'));
const Messages = lazy(() => import('./pages/Messages'));
const Eroboard = lazy(() => import('./pages/Eroboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ErrorBoundary fallback={<div className="p-8">Something went wrong. Please refresh the page.</div>}>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Index route */}
              <Route path="/" element={<Index />} />
              
              {/* Main app routes */}
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/shorts" element={<Shorts />} />
                <Route path="/eros" element={<Eros />} />
                <Route path="/dating" element={<Dating />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/eroboard" element={<Eroboard />} />
                <Route path="/categories" element={<Categories />} />
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
