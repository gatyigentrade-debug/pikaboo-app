import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AppLayout from '@/components/layout/AppLayout';
import Chat from '@/pages/Chat';
import Likes from '@/pages/Likes';
import Welcome from '@/pages/Welcome';
import ProfileDetail from '@/pages/ProfileDetail';
import Subscriptions from '@/pages/Subscriptions';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onBackButton = (e) => {
      if (location.pathname !== "/") {
        if (e && e.preventDefault) e.preventDefault();
        navigate(-1);
      } else if (window.navigator?.app?.exitApp) {
        window.navigator.app.exitApp();
      }
    };
    document.addEventListener("backbutton", onBackButton, false);
    return () => document.removeEventListener("backbutton", onBackButton);
  }, [location.pathname, navigate]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background gap-4">
        <img
          src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/b0eb3dd4a_AppIcon.png"
          alt="PikaBoo"
          className="w-16 h-16 object-contain animate-float"
          style={{ filter: "drop-shadow(0 0 12px rgba(251, 191, 36, 0.8)) brightness(1.2) hue-rotate(25deg)" }}
        />
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-body text-sm">Finding your vibes...</p>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/welcome" replace />} />}>
        <Route path="/" element={<AppLayout />} />
        <Route path="/explore" element={<AppLayout />} />
        <Route path="/matches" element={<AppLayout />} />
        <Route path="/profile" element={<AppLayout />} />
        <Route path="/chat" element={<AppLayout />} />
        <Route path="/chat/:id" element={<AppLayout />} />
        <Route path="/likes" element={<AppLayout />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App