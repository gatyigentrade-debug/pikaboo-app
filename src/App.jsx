import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
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
import Privacy from '@/pages/Privacy';

const ROOT_TABS = ["/explore", "/matches", "/chat", "/profile"];

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onBackButton = (e) => {
      // If an overlay is open via URL search params (match/gold/shop/filters/etc.),
      // back should dismiss it rather than exit the app or switch tabs.
      if (window.location.search) {
        if (e && e.preventDefault) e.preventDefault();
        navigate(-1);
        return;
      }
      if (location.pathname === "/") {
        if (window.navigator?.app?.exitApp) window.navigator.app.exitApp();
      } else if (ROOT_TABS.includes(location.pathname)) {
        if (e && e.preventDefault) e.preventDefault();
        navigate("/");
      } else {
        if (e && e.preventDefault) e.preventDefault();
        navigate(-1);
      }
    };
    document.addEventListener("backbutton", onBackButton, false);
    return () => document.removeEventListener("backbutton", onBackButton);
  }, [location.pathname, navigate]);

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-6" style={{ backgroundColor: "#0A0A0C" }}>
        <div className="relative flex items-center justify-center">
          {/* Lime-green glowing aura */}
          <div
            className="absolute rounded-full animate-pulse"
            style={{
              width: "180px",
              height: "180px",
              background: "radial-gradient(circle, rgba(191,255,0,0.45) 0%, rgba(191,255,0,0.18) 45%, transparent 75%)",
              filter: "blur(8px)"
            }}
          />
          <img
            src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/eb969a81b_App_Icon-removebg-preview.png"
            alt="PikaBoo"
            className="relative w-32 h-32 object-contain animate-float"
            style={{ filter: "drop-shadow(0 0 18px rgba(191,255,0,0.7)) brightness(1.15)" }}
          />
        </div>
        <p className="font-body text-sm" style={{ color: "rgba(200,200,200,0.85)" }}>Finding your vibes...</p>
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
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/welcome" replace />} />}>
        <Route path="/" element={<AppLayout />} />
        <Route path="/explore" element={<AppLayout />} />
        <Route path="/discover" element={<AppLayout />} />
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <div
            className="fixed inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/19e2302af_Gemini_Generated_Image_gpdoukgpdoukgpdo.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(1px)",
              opacity: 0.85,
              transform: "scale(1.03)",
              zIndex: 0
            }}
          />
          <div
            className="fixed inset-0 pointer-events-none"
            style={{ background: "rgba(5,3,0,0.25)", zIndex: 0 }}
          />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App