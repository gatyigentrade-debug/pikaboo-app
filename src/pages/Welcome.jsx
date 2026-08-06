import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 campfire-glow pointer-events-none" />

      {/* Logo + tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-12 relative z-10"
      >
        <img
          src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/8b5857139_PikaBoo_logo-removebg-preview.png"
          alt="PikaBoo"
          className="w-24 h-24 object-contain animate-float mb-4"
          style={{ filter: "drop-shadow(0 0 12px rgba(251, 191, 36, 0.8)) brightness(1.2) hue-rotate(25deg)" }}
        />
        <h1 className="text-4xl font-heading font-black text-foreground glow-text-orange">PikaBoo</h1>
        <p className="text-sm text-muted-foreground font-body mt-2 text-center max-w-xs">
          Find your vibe. Light the spark. Your South African dating adventure starts here.
        </p>
      </motion.div>

      {/* Startup actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-sm flex flex-col gap-3 relative z-10"
      >
        <button
          onClick={() => navigate("/register")}
          className="w-full h-14 rounded-full font-heading font-bold text-black transition-transform active:scale-95"
          style={{ background: "linear-gradient(135deg, #d4af37, #f3e5ab)" }}
        >
          Create Account
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full h-14 rounded-full font-heading font-bold bg-transparent transition-transform active:scale-95"
          style={{ color: "#f3e5ab", border: "1px solid #d4af37" }}
        >
          Log In
        </button>
      </motion.div>
    </div>
  );
}