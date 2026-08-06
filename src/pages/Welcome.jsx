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
          style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "36px", color: "#F3E5AB", textShadow: "0 0 10px #D4AF37", margin: "10px 0" }}
        >
          PikaBoo
        </h1>
        <p style={{ color: "#F3E5AB", textAlign: "center", padding: "0 30px", fontSize: "18px", marginBottom: "60px" }}>
          find your vibe...
        </p>
      </motion.div>

      {/* Startup actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full max-w-sm flex flex-col gap-5 relative z-10 px-5"
      >
        <button
          onClick={() => navigate("/register")}
          className="w-full rounded-full font-heading font-bold text-black transition-all active:scale-95"
          style={{
            padding: "16px",
            borderRadius: "30px",
            fontSize: "18px",
            background: "linear-gradient(135deg, #d4af37 0%, #f3e5ab 50%, #d4af37 100%)",
            boxShadow: "0 0 15px 2px rgba(212, 175, 55, 0.6)",
          }}
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 0 25px 5px rgba(212, 175, 55, 0.8)")}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 0 15px 2px rgba(212, 175, 55, 0.6)")}
        >
          Create Account
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full rounded-full font-heading font-bold transition-all active:scale-95"
          style={{
            padding: "16px",
            borderRadius: "30px",
            fontSize: "18px",
            color: "#D4AF37",
            border: "2px solid transparent",
            background: "linear-gradient(#000, #000) padding-box, linear-gradient(135deg, #d4af37, #f3e5ab) border-box",
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = "linear-gradient(rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.08)) padding-box, linear-gradient(135deg, #d4af37, #f3e5ab) border-box")}
          onMouseOut={(e) => (e.currentTarget.style.background = "linear-gradient(#000, #000) padding-box, linear-gradient(135deg, #d4af37, #f3e5ab) border-box")}
        >
          Log In
        </button>
      </motion.div>
    </div>
  );
}