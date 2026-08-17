import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Apple, Phone, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { safeReturnTo } from "@/lib/authReturnTo";
import GoogleIcon from "@/components/GoogleIcon";

const DUST = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.2 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2.5,
  opacity: Math.random() * 0.5 + 0.25,
}));

export default function Login() {
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
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", safeReturnTo());
  const handleApple = () => base44.auth.loginWithProvider("apple", safeReturnTo());

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-y-auto px-6"
      style={{
        backgroundColor: "#070708",
        color: "#F3E5AB",
        paddingTop: "calc(2rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
      }}
    >
      {/* Deep dark gradient + radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.14) 0%, transparent 55%), linear-gradient(180deg, #0A0A0C 0%, #050506 100%)",
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
        {/* Compact emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative mb-4"
        >
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.32) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />
          <div
            className="relative w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              border: "1px solid rgba(212,175,55,0.5)",
              boxShadow: "inset 0 0 18px rgba(212,175,55,0.16), 0 0 26px rgba(212,175,55,0.24)",
              background: "transparent",
            }}
          >
            <img
              src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/4db3d9300_generated_image.png"
              alt="PikaBoo"
              className="w-16 h-16 object-contain animate-float"
              style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 10px rgba(212,175,55,0.5))" }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "28px",
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
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "11px",
            letterSpacing: "3px",
            color: "#D4AF37",
            marginTop: "4px",
            textTransform: "uppercase",
          }}
        >
          Welcome Back
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full mt-6 space-y-3"
        >
          {error && (
            <div className="p-2.5 rounded-xl bg-destructive/15 border border-destructive/30 text-destructive text-xs text-center font-body">
              {error}
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/55" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 rounded-full bg-white/5 backdrop-blur-md border-gold/25 focus:border-gold/70 focus-visible:ring-gold/25 text-foreground placeholder:text-muted-foreground/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)]"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/55" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-11 h-12 rounded-full bg-white/5 backdrop-blur-md border-gold/25 focus:border-gold/70 focus-visible:ring-gold/25 text-foreground placeholder:text-muted-foreground/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.45)]"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-shimmer w-full h-12 rounded-full font-heading font-bold text-black flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
            style={{
              background:
                "linear-gradient(110deg, #B8860B 0%, #F3E5AB 45%, #FFFDF5 50%, #F3E5AB 55%, #D4AF37 100%)",
              boxShadow: "0 0 20px rgba(212,175,55,0.45), inset 0 1px 2px rgba(255,255,255,0.35)",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.form>

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-3 text-xs text-gold/65 font-body hover:text-gold transition-colors"
        >
          Forgot password?
        </button>

        {/* Divider */}
        <div className="w-full mt-6 mb-4 relative text-center">
          <span
            className="relative z-10 px-3"
            style={{ color: "rgba(243,229,171,0.55)", fontSize: "12px", fontFamily: "'Nunito', sans-serif", backgroundColor: "#070708" }}
          >
            or continue with
          </span>
          <div
            className="absolute top-1/2 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent)" }}
          />
        </div>

        {/* Social */}
        <div className="flex gap-5">
          <button
            onClick={handleGoogle}
            aria-label="Continue with Google"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "rgba(20,15,5,0.4)", boxShadow: "0 0 10px rgba(212,175,55,0.15)" }}
          >
            <GoogleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleApple}
            aria-label="Continue with Apple"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "rgba(20,15,5,0.4)", boxShadow: "0 0 10px rgba(212,175,55,0.15)" }}
          >
            <Apple className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </button>
          <Link
            to="/register"
            aria-label="Continue with Phone"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "rgba(20,15,5,0.4)", boxShadow: "0 0 10px rgba(212,175,55,0.15)" }}
          >
            <Phone className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </Link>
        </div>

        <p className="mt-6 text-sm text-gold/80 font-body">
          New here?{" "}
          <Link to="/register" className="font-bold underline text-gold">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}