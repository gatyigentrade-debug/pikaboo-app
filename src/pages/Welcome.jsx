import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// CSS-generated starfield positions
const STARS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 3,
}));

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: "#000000",
        backgroundImage: "radial-gradient(circle at center, #1a1a1a 0%, #000000 100%)",
        color: "#F3E5AB",
      }}
    >
      {/* Celestial starfield */}
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-[#F3E5AB] animate-sparkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}

      {/* Gilded Bunny Logo with glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mb-10 z-10"
      >
        <div
          className="relative w-44 h-44 rounded-full flex items-center justify-center animate-float"
          style={{ boxShadow: "0 0 60px 10px rgba(212, 175, 55, 0.5)" }}
        >
          <img
            src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/8b5857139_PikaBoo_logo-removebg-preview.png"
            alt="PikaBoo"
            className="w-full h-full object-contain"
            style={{ filter: "brightness(1.3) hue-rotate(25deg) drop-shadow(0 0 20px rgba(212, 175, 55, 0.6))" }}
          />
        </div>
      </motion.div>

      {/* Brand name + tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col items-center mb-12 relative z-10"
      >
        <h1
          className="text-4xl font-heading font-black tracking-wide"
          style={{ color: "#F3E5AB", textShadow: "0 0 20px rgba(212, 175, 55, 0.5)" }}
        >
          PikaBoo
        </h1>
        <p className="text-sm font-body mt-2 text-center max-w-xs" style={{ color: "rgba(243, 229, 171, 0.6)" }}>
          Find your vibe. Light the spark. Your South African dating adventure starts here.
        </p>
      </motion.div>

      {/* Startup actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full max-w-sm flex flex-col gap-3 relative z-10 px-5"
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
          style={{ color: "#F3E5AB", border: "1px solid #d4af37" }}
        >
          Log In
        </button>
      </motion.div>
    </div>
  );
}