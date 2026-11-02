import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Apple, Phone, Heart, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import GoogleIcon from "@/components/GoogleIcon";

const LOGO_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/eb969a81b_App_Icon-removebg-preview.png";

export default function Welcome() {
  const navigate = useNavigate();
  const handleGoogle = () => base44.auth.loginWithProvider("google", "/");
  const handleApple = () => base44.auth.loginWithProvider("apple", "/");

  return (
    <div
      className="w-full min-h-[100dvh] flex flex-col items-center justify-center relative overflow-y-auto px-6"
      style={{
        paddingTop: "calc(3rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
      }}
    >
      {/* Logo + glowing metallic ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative flex items-center justify-center mb-8"
      >
        <div
          className="absolute rounded-full"
          style={{ width: 230, height: 230, background: "radial-gradient(circle, rgba(212,165,74,0.22) 0%, transparent 70%)" }}
        />
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 172,
            height: 172,
            border: "1px solid rgba(212,165,74,0.45)",
            boxShadow: "0 0 32px rgba(212,165,74,0.25), inset 0 0 24px rgba(42,10,59,0.45)",
            background: "radial-gradient(circle, rgba(42,10,59,0.5) 0%, rgba(23,23,23,0.25) 100%)",
          }}
        >
          <img
            src={LOGO_URL}
            alt="PikaBoo"
            className="w-28 h-28 object-contain animate-float"
            style={{ filter: "drop-shadow(0 0 16px rgba(212,165,74,0.55))" }}
          />
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="text-center mb-8"
      >
        <h1 className="font-heading text-3xl font-extrabold text-foreground">
          Find Your <span className="text-gradient-gold">Boo.</span>
        </h1>
        <p className="text-sm font-body mt-2 text-muted-foreground">
          Real people. <span className="text-gold font-semibold">Real connections.</span>
        </p>
        <p className="text-xs font-body mt-1 text-muted-foreground/80">Find your perfect Boo today.</p>
      </motion.div>

      {/* CTA */}
      <div className="w-full max-w-sm flex flex-col items-center">
        <motion.button
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={() => navigate("/login")}
          className="btn-shimmer w-full h-12 rounded-full font-heading font-bold text-[#171717] flex items-center justify-between px-5 active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(110deg, #D4A54A 0%, #F3E5AB 50%, #D4A54A 100%)",
            boxShadow: "0 10px 30px -10px rgba(212,165,74,0.55)",
            border: "1px solid rgba(212,165,74,0.5)",
          }}
        >
          <Heart className="w-4 h-4 fill-[#171717]" />
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex items-center gap-3 w-full mt-6"
        >
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs font-body whitespace-nowrap text-muted-foreground">or continue with</span>
          <div className="flex-1 h-px bg-white/10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex gap-4 mt-5"
        >
          <button
            onClick={handleGoogle}
            aria-label="Continue with Google"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform bg-white/5 border border-gold/25 hover:border-gold/50"
          >
            <GoogleIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleApple}
            aria-label="Continue with Apple"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform bg-white/5 border border-gold/25 hover:border-gold/50"
          >
            <Apple className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => navigate("/register")}
            aria-label="Continue with Phone"
            className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform bg-white/5 border border-gold/25 hover:border-gold/50"
          >
            <Phone className="w-5 h-5 text-foreground" />
          </button>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          onClick={() => navigate("/login")}
          className="mt-6 text-sm font-body flex items-center gap-1.5 active:scale-95 transition-transform text-muted-foreground"
        >
          Already have an account? <span className="font-bold text-gold">Sign In</span> <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          onClick={() => navigate("/privacy")}
          className="mt-4 text-xs font-body active:scale-95 transition-transform text-muted-foreground/70"
        >
          Privacy Policy
        </motion.button>
      </div>
    </div>
  );
}