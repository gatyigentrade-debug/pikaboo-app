import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import GoogleIcon from "@/components/GoogleIcon";

const DUST = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.3 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2.5,
  opacity: Math.random() * 0.5 + 0.25,
}));

const DISCOVER = "/discover";

export default function AuthScreen({ subtitle = "find your Boo" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Signed-in users bypass the login screen → straight to Discover.
  useEffect(() => {
    let active = true;
    base44.auth
      .isAuthenticated()
      .then((ok) => {
        if (active && ok) navigate(DISCOVER, { replace: true });
      })
      .catch(() => {})
      .finally(() => active && setChecking(false));
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = DISCOVER;
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", DISCOVER);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "#0A0A0C" }}>
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const fieldStyle = {
    backgroundColor: "rgba(20,20,25,0.8)",
    border: "1px solid #D4AF37",
    color: "#F3E5AB",
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-y-auto px-6"
      style={{
        backgroundColor: "#0A0A0C",
        color: "#F3E5AB",
        paddingTop: "calc(2.5rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
      }}
    >
      {/* Radial ambient gold gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 26%, rgba(212,175,55,0.16) 0%, transparent 55%), radial-gradient(ellipse at 50% 88%, rgba(212,175,55,0.06) 0%, transparent 45%)",
        }}
      />

      {/* Gold particle dust */}
      {DUST.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full animate-sparkle pointer-events-none"
          style={{
            top: `${d.top}%`,
            left: `${d.left}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            background: "radial-gradient(circle, #F3E5AB 0%, #D4AF37 50%, transparent 100%)",
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
            boxShadow: "0 0 4px rgba(212,175,55,0.6)",
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Double gold ring emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-32 h-32 mb-5"
        >
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.32) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(212,175,55,0.6)",
              boxShadow: "0 0 28px rgba(212,175,55,0.25), inset 0 0 14px rgba(212,175,55,0.1)",
            }}
          />
          <div className="absolute inset-[6px] rounded-full" style={{ border: "1px solid rgba(212,175,55,0.35)" }} />
          <div className="absolute inset-[10px] rounded-full flex items-center justify-center">
            <img
              src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/4db3d9300_generated_image.png"
              alt="PikaBoo"
              className="w-20 h-20 object-contain animate-float"
              style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 12px rgba(212,175,55,0.55))" }}
            />
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "32px",
            letterSpacing: "2px",
            background: "linear-gradient(135deg, #B8860B 0%, #F3E5AB 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
          }}
        >
          PikaBoo
        </motion.h1>

        {/* Subtitle + sparkle */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex items-center gap-1.5 mt-1"
        >
          <span
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 400,
              fontSize: "13px",
              letterSpacing: "1px",
              color: "#D4AF37",
            }}
          >
            {subtitle}
          </span>
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#F3E5AB" }} />
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="w-full mt-7"
        >
          {error && (
            <div className="mb-3 p-2.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs text-center font-body">
              {error}
            </div>
          )}

          <div className="relative mb-3">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 pl-11 pr-4 rounded-full outline-none focus:border-gold placeholder:text-gold/50 font-body text-sm"
              style={fieldStyle}
            />
          </div>

          <div className="relative mb-5">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 pl-11 pr-4 rounded-full outline-none focus:border-gold placeholder:text-gold/50 font-body text-sm"
              style={fieldStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full font-heading font-bold flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
            style={{
              background: "linear-gradient(90deg, #D4AF37 0%, #F3E5AB 100%)",
              color: "#1a1205",
              boxShadow: "0 0 20px rgba(212,175,55,0.4)",
              letterSpacing: "1px",
              fontSize: "14px",
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log In"}
          </button>
        </motion.form>

        {/* Create Account */}
        <button
          onClick={() => navigate("/register")}
          className="w-full h-12 mt-3 rounded-full font-heading font-semibold flex items-center justify-center active:scale-95 transition-transform"
          style={{
            background: "rgba(20,20,25,0.5)",
            border: "1px solid rgba(212,175,55,0.5)",
            color: "#F3E5AB",
            fontSize: "14px",
          }}
        >
          Create Account
        </button>

        {/* Continue with Google */}
        <button
          onClick={handleGoogle}
          className="w-full h-12 mt-3 rounded-full flex items-center justify-center gap-2.5 active:scale-95 transition-transform"
          style={{
            background: "rgba(20,20,25,0.5)",
            border: "1px solid rgba(212,175,55,0.45)",
          }}
        >
          <GoogleIcon className="w-4 h-4" />
          <span className="text-sm font-heading font-semibold" style={{ color: "#F3E5AB" }}>
            Continue with Google
          </span>
        </button>

        {/* Links */}
        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-5 text-xs font-body hover:text-gold transition-colors"
          style={{ color: "rgba(212,175,55,0.7)" }}
        >
          Forgot Password?
        </button>

        {/* Terms / Privacy */}
        <div className="mt-6 flex items-center gap-4">
          <button type="button" className="text-[11px] font-body hover:text-gold transition-colors" style={{ color: "rgba(243,229,171,0.5)" }}>
            Terms
          </button>
          <span style={{ color: "rgba(212,175,55,0.3)" }}>·</span>
          <button type="button" className="text-[11px] font-body hover:text-gold transition-colors" style={{ color: "rgba(243,229,171,0.5)" }}>
            Privacy
          </button>
        </div>
      </div>
    </div>
  );
}