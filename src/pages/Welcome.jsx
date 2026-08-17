import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Apple, Phone } from "lucide-react";
import { base44 } from "@/api/base44Client";
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

export default function Welcome() {
  const navigate = useNavigate();
  const handleGoogle = () => base44.auth.loginWithProvider("google", "/");
  const handleApple = () => base44.auth.loginWithProvider("apple", "/");

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-y-auto px-6"
      style={{
        backgroundColor: "#070708",
        color: "#F3E5AB",
        paddingTop: "calc(2.5rem + env(safe-area-inset-top))",
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
        {/* Emblem badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-6"
        >
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          <div
            className="relative w-40 h-40 rounded-full flex items-center justify-center"
            style={{
              border: "1px solid rgba(212,175,55,0.5)",
              boxShadow: "inset 0 0 18px rgba(212,175,55,0.16), 0 0 26px rgba(212,175,55,0.24)",
              background: "transparent",
            }}
          >
            <img
              src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/4db3d9300_generated_image.png"
              alt="PikaBoo"
              className="w-28 h-28 object-contain animate-float"
              style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 12px rgba(212,175,55,0.5))" }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "34px",
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
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "13px",
            letterSpacing: "2px",
            color: "#D4AF37",
            marginTop: "6px",
          }}
        >
          ♥ find your Boo ♥
        </motion.p>

        {/* Log In */}
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => navigate("/login")}
          className="btn-shimmer w-full h-12 rounded-full font-heading font-bold text-black flex items-center justify-center mt-8 active:scale-95 transition-transform"
          style={{
            background:
              "linear-gradient(110deg, #B8860B 0%, #F3E5AB 45%, #FFFDF5 50%, #F3E5AB 55%, #D4AF37 100%)",
            boxShadow: "0 0 20px rgba(212,175,55,0.45), inset 0 1px 2px rgba(255,255,255,0.35)",
          }}
        >
          Log In
        </motion.button>

        {/* Create Account */}
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          onClick={() => navigate("/register")}
          className="w-full h-12 mt-3 rounded-full font-heading font-semibold flex items-center justify-center active:scale-95 transition-transform"
          style={{
            background: "rgba(20,15,5,0.4)",
            border: "1px solid rgba(212,175,55,0.5)",
            color: "#F3E5AB",
          }}
        >
          Create Account
        </motion.button>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-5 mt-7"
        >
          <button
            onClick={handleGoogle}
            aria-label="Continue with Google"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "rgba(20,15,5,0.4)" }}
          >
            <GoogleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleApple}
            aria-label="Continue with Apple"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "rgba(20,15,5,0.4)" }}
          >
            <Apple className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </button>
          <button
            onClick={() => navigate("/register")}
            aria-label="Continue with Phone"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "rgba(20,15,5,0.4)" }}
          >
            <Phone className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}