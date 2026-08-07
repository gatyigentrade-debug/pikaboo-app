import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Apple, Phone } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

// Glittering gold dust stars
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 4,
  duration: Math.random() * 3 + 2,
  opacity: Math.random() * 0.5 + 0.3,
}));

// Heart constellation points (normalized 0-100)
const HEART_CONSTELLATION = [
  { x: 50, y: 30 }, { x: 38, y: 22 }, { x: 28, y: 28 }, { x: 25, y: 40 },
  { x: 30, y: 52 }, { x: 50, y: 72 }, { x: 70, y: 52 }, { x: 75, y: 40 },
  { x: 72, y: 28 }, { x: 62, y: 22 },
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div
      className="w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#000000", color: "#F3E5AB" }}
    >
      {/* Radial golden ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, rgba(212, 175, 55, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 40%)",
        }}
      />

      {/* Heart constellation line art */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.08 }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon
          points={HEART_CONSTELLATION.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="0.15"
        />
        {HEART_CONSTELLATION.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="0.3" fill="#F3E5AB" />
        ))}
      </svg>

      {/* Glittering gold dust stars */}
      {STARS.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-sparkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: "radial-gradient(circle, #F3E5AB 0%, #D4AF37 50%, transparent 100%)",
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.opacity,
            boxShadow: "0 0 4px rgba(212, 175, 55, 0.6)",
          }}
        />
      ))}

      {/* Gilded circular logo badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative mb-7 z-10"
      >
        <div
          className="relative w-36 h-36 rounded-full flex items-center justify-center animate-float"
          style={{
            background: "radial-gradient(circle, rgba(0,0,0,0.9) 40%, rgba(20,15,5,0.95) 100%)",
            border: "3px solid #D4AF37",
            boxShadow:
              "0 0 50px 8px rgba(212, 175, 55, 0.5), 0 0 100px 20px rgba(212, 175, 55, 0.2), inset 0 0 30px rgba(212, 175, 55, 0.15)",
          }}
        >
          {/* Inner metallic ring */}
          <div
            className="absolute inset-1.5 rounded-full pointer-events-none"
            style={{
              border: "1px solid rgba(243, 229, 171, 0.4)",
              boxShadow: "inset 0 0 20px rgba(212, 175, 55, 0.1)",
            }}
          />
          <img
            src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/a6b6bd9f8_AppIcon.png"
            alt="PikaBoo"
            className="w-[92%] h-[92%] object-contain"
            style={{
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 12px rgba(212, 175, 55, 0.6))",
            }}
          />
        </div>
      </motion.div>

      {/* Brand name + subtitle + tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col items-center mb-8 relative z-10 px-6"
      >
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "38px",
            letterSpacing: "2px",
            background: "linear-gradient(135deg, #B8860B 0%, #F3E5AB 50%, #D4AF37 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
            margin: 0,
          }}
        >
          PikaBoo
        </h1>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 400,
            fontSize: "15px",
            color: "#D4AF37",
            marginTop: "6px",
            textShadow: "0 0 8px rgba(212, 175, 55, 0.3)",
          }}
        >
          ♥ find your Boo ♥
        </p>
        <p
          style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: "13px",
            color: "rgba(243, 229, 171, 0.65)",
            marginTop: "10px",
            textAlign: "center",
            maxWidth: "280px",
            lineHeight: "1.5",
          }}
        >
          Real people. Real connections. Find your perfect Boo today.
        </p>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="w-full max-w-sm flex flex-col gap-4 relative z-10 px-6"
      >
        <button
          onClick={() => navigate("/register")}
          className="w-full font-heading font-bold text-black transition-all active:scale-95"
          style={{
            padding: "15px",
            borderRadius: "30px",
            fontSize: "17px",
            background: "linear-gradient(135deg, #B8860B 0%, #F3E5AB 50%, #D4AF37 100%)",
            boxShadow:
              "0 0 20px 3px rgba(212, 175, 55, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 30px 6px rgba(212, 175, 55, 0.7), inset 0 1px 2px rgba(255, 255, 255, 0.3)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 20px 3px rgba(212, 175, 55, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.3)")
          }
        >
          Create Account
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full font-heading font-bold transition-all active:scale-95"
          style={{
            padding: "15px",
            borderRadius: "30px",
            fontSize: "17px",
            color: "#F3E5AB",
            background: "rgba(20, 15, 5, 0.6)",
            border: "2px solid #D4AF37",
            boxShadow: "0 0 15px 1px rgba(212, 175, 55, 0.3), inset 0 0 15px rgba(212, 175, 55, 0.05)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 25px 3px rgba(212, 175, 55, 0.5), inset 0 0 15px rgba(212, 175, 55, 0.08)")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 0 15px 1px rgba(212, 175, 55, 0.3), inset 0 0 15px rgba(212, 175, 55, 0.05)")
          }
        >
          Log In
        </button>
      </motion.div>

      {/* "or continue with" divider */}
      <div
        style={{
          margin: "30px 0 18px",
          width: "100%",
          padding: "0 40px",
          textAlign: "center",
          position: "relative",
        }}
        className="relative z-10"
      >
        <span style={{ color: "rgba(243, 229, 171, 0.6)", fontSize: "13px", fontFamily: "'Nunito', sans-serif" }}>
          or continue with
        </span>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "40px",
            width: "calc(50% - 100px)",
            height: "1px",
            background: "linear-gradient(90deg, transparent, #D4AF37)",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "40px",
            width: "calc(50% - 100px)",
            height: "1px",
            background: "linear-gradient(90deg, #D4AF37, transparent)",
            opacity: 0.4,
          }}
        />
      </div>

      {/* Social icons */}
      <div className="flex gap-5 mb-10 relative z-10">
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{
            border: "1px solid rgba(212, 175, 55, 0.5)",
            background: "rgba(20, 15, 5, 0.4)",
            boxShadow: "0 0 10px rgba(212, 175, 55, 0.15)",
          }}
        >
          <GoogleIcon className="w-5 h-5" />
        </button>
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{
            border: "1px solid rgba(212, 175, 55, 0.5)",
            background: "rgba(20, 15, 5, 0.4)",
            boxShadow: "0 0 10px rgba(212, 175, 55, 0.15)",
          }}
        >
          <Apple className="w-5 h-5" style={{ color: "#F3E5AB" }} />
        </button>
        <button
          className="w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-95"
          style={{
            border: "1px solid rgba(212, 175, 55, 0.5)",
            background: "rgba(20, 15, 5, 0.4)",
            boxShadow: "0 0 10px rgba(212, 175, 55, 0.15)",
          }}
        >
          <Phone className="w-5 h-5" style={{ color: "#F3E5AB" }} />
        </button>
      </div>
    </div>
  );
}