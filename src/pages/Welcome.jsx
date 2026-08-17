import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Apple, Phone, Heart, ArrowRight } from "lucide-react";
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
        backgroundColor: "#08080A",
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
        {/* Emblem badge - double gold ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-4"
        >
          <div
            className="absolute -inset-3 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          {/* Outer ring */}
          <div
            className="relative w-44 h-44 rounded-full flex items-center justify-center"
            style={{
              border: "1px solid rgba(212,175,55,0.55)",
              boxShadow: "0 0 26px rgba(212,175,55,0.24)",
            }}
          >
            {/* Inner ring */}
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(212,175,55,0.4)",
                boxShadow: "inset 0 0 18px rgba(212,175,55,0.16)",
              }}
            >
              <img
                src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/a65636dde_AppIcon.PNG"
                alt="PikaBoo"
                className="w-28 h-28 object-contain animate-float"
                style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 12px rgba(212,175,55,0.5))" }}
              />
            </div>
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

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center mt-6"
        >
          <p className="text-sm font-body">
            <span style={{ color: "#F3E5AB" }}>Real people. </span>
            <span style={{ color: "#D4AF37", fontWeight: 700 }}>Real connections.</span>
          </p>
          <p className="text-xs font-body mt-1" style={{ color: "rgba(212,175,55,0.75)" }}>
            Find your perfect Boo today.
          </p>
        </motion.div>

        {/* Get Started */}
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          onClick={() => navigate("/login")}
          className="btn-shimmer w-full h-12 rounded-full font-heading font-bold text-black flex items-center justify-between px-5 mt-7 active:scale-95 transition-transform"
          style={{
            background:
              "linear-gradient(110deg, #B8860B 0%, #F3E5AB 45%, #FFFDF5 50%, #F3E5AB 55%, #D4AF37 100%)",
            boxShadow: "0 0 20px rgba(212,175,55,0.45), inset 0 1px 2px rgba(255,255,255,0.35)",
            border: "1px solid rgba(212,175,55,0.6)",
          }}
        >
          <Heart className="w-4 h-4 fill-black" />
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center gap-3 w-full mt-6"
        >
          <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.35)" }} />
          <span className="text-xs font-body whitespace-nowrap" style={{ color: "rgba(212,175,55,0.65)" }}>
            or continue with
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(212,175,55,0.35)" }} />
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex gap-5 mt-5"
        >
          <button
            onClick={handleGoogle}
            aria-label="Continue with Google"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "#0F0F10" }}
          >
            <GoogleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleApple}
            aria-label="Continue with Apple"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "#0F0F10" }}
          >
            <Apple className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </button>
          <button
            onClick={() => navigate("/register")}
            aria-label="Continue with Phone"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform"
            style={{ border: "1px solid rgba(212,175,55,0.5)", background: "#0F0F10" }}
          >
            <Phone className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </button>
        </motion.div>

        {/* Footer link */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          onClick={() => navigate("/login")}
          className="mt-6 text-sm font-body flex items-center gap-1.5 active:scale-95 transition-transform"
          style={{ color: "rgba(212,175,55,0.85)" }}
        >
          Already have an account? <span className="font-bold">Sign In</span> <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </div>
  );
}