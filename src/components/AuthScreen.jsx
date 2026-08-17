import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { safeReturnTo } from "@/lib/authReturnTo";
import GoogleIcon from "@/components/GoogleIcon";

// Ambient gold dust / sparkle
const DUST = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.3 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2.5,
  opacity: Math.random() * 0.5 + 0.25,
}));

export default function AuthScreen({ subtitle = "find your Boo" }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      // Hard redirect to the main discovery route so auth state re-initializes cleanly.
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", safeReturnTo());

  const inputClass =
    "pl-11 h-12 rounded-full bg-white/5 backdrop-blur-md border-gold/30 focus:border-gold/70 focus-visible:ring-gold/25 text-foreground placeholder:text-gold/40 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)]";

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-y-auto px-6"
      style={{
        backgroundColor: "#08080A",
        color: "#F3E5AB",
        paddingTop: "calc(2.5rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
      }}
    >
      {/* Dark gradient + radial gold glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(212,175,55,0.15) 0%, transparent 55%), radial-gradient(ellipse at 50% 88%, rgba(212,175,55,0.05) 0%, transparent 45%), linear-gradient(180deg, #08080A 0%, #0D0D12 100%)",
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
          <div
            className="absolute inset-[6px] rounded-full"
            style={{ border: "1px solid rgba(212,175,55,0.35)" }}
          />
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

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontWeight: 400,
            fontSize: "13px",
            letterSpacing: "1px",
            color: "#D4AF37",
            marginTop: "4px",
          }}
        >
          {subtitle}
        </motion.p>

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

          <div className="mb-3">
            <label className="block text-[11px] tracking-[2px] text-gold/70 font-heading mb-1.5">EMAIL</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/55" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-[11px] tracking-[2px] text-gold/70 font-heading mb-1.5">PASSWORD</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/55" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-shimmer w-full h-12 rounded-full font-heading font-bold text-black flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
            style={{
              background:
                "linear-gradient(110deg, #B8860B 0%, #F3E5AB 45%, #FFFDF5 50%, #F3E5AB 55%, #D4AF37 100%)",
              boxShadow: "0 0 20px rgba(212,175,55,0.45), inset 0 1px 2px rgba(255,255,255,0.35)",
              letterSpacing: "1px",
              fontSize: "14px",
            }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "LOG IN TO PIKABOO"}
          </button>
        </motion.form>

        {/* Continue with Google */}
        <button
          onClick={handleGoogle}
          className="w-full h-12 mt-3 rounded-full flex items-center justify-center gap-2.5 active:scale-95 transition-transform"
          style={{
            background: "rgba(20,15,5,0.4)",
            border: "1px solid rgba(212,175,55,0.45)",
          }}
        >
          <GoogleIcon className="w-4 h-4" />
          <span className="text-sm font-heading font-semibold text-gold/90">Continue with Google</span>
        </button>

        {/* Secondary links */}
        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-5 text-xs text-gold/65 font-body hover:text-gold transition-colors"
        >
          Forgot Password?
        </button>
        <p className="mt-2 text-xs text-gold/65 font-body">
          New to PikaBoo?{" "}
          <Link to="/register" className="font-bold text-gold underline">
            Create Profile
          </Link>
        </p>

        {/* Terms / Privacy */}
        <div className="mt-6 flex items-center gap-4">
          <button type="button" className="text-[11px] text-gold/45 font-body hover:text-gold/70 transition-colors">
            Terms
          </button>
          <span className="text-gold/25 text-xs">·</span>
          <button type="button" className="text-[11px] text-gold/45 font-body hover:text-gold/70 transition-colors">
            Privacy
          </button>
        </div>
      </div>
    </div>
  );
}