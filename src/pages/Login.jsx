import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Apple, Phone, ArrowLeft } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

const EMBLEM_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/4db3d9300_generated_image.png";

export default function Login() {
  const [showForm, setShowForm] = useState(false);
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
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", "/");
  const handleApple = () => base44.auth.loginWithProvider("apple", "/");

  // Sign-in form view
  if (showForm) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0C] flex flex-col items-center justify-center px-6 box-border">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl p-6" style={{ background: "rgba(15,12,5,0.6)", border: "1px solid rgba(212,175,55,0.25)" }}>
          <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-1 text-xs font-body mb-1" style={{ color: "rgba(212,175,55,0.8)" }}>
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <h2 className="text-xl font-heading font-bold text-center" style={{ color: "#F3E5AB" }}>Welcome back</h2>
          {error &&
          <div className="p-3 rounded-lg text-sm text-center" style={{ background: "rgba(220,38,38,0.12)", color: "#fca5a5" }}>{error}</div>
          }
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-body" style={{ color: "rgba(212,175,55,0.8)" }}>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
              <Input
                id="email" type="email" autoFocus placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 rounded-full text-foreground placeholder:text-muted-foreground/60"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(212,175,55,0.25)" }}
                required />
              
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-body" style={{ color: "rgba(212,175,55,0.8)" }}>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
              <Input
                id="password" type="password" placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 rounded-full text-foreground placeholder:text-muted-foreground/60"
                style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(212,175,55,0.25)" }}
                required />
              
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full h-12 rounded-full font-heading font-bold text-black flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
            style={{ background: "linear-gradient(110deg, #B8860B 0%, #F3E5AB 50%, #D4AF37 100%)", boxShadow: "0 0 18px rgba(212,175,55,0.4)" }}>
            
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </div>);

  }

  // Main entry layout
  return (
    <div className="min-h-screen w-full bg-[#0A0A0C] flex flex-col items-center justify-between pt-[calc(2.5rem+env(safe-area-inset-top))] pb-[calc(2.5rem+env(safe-area-inset-bottom))] px-6 box-border">
      {/* Section 1 — Logo Header */}
      <div className="flex flex-col items-center">
        <img src="https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/357b1f071_Gemini_Generated_Image_lele2vlele2vlele.png" alt="PikaBoo" className="w-44 h-44 object-contain rounded-full animate-float" style={{ mixBlendMode: "screen", filter: "drop-shadow(0 0 12px rgba(212,175,55,0.5))" }} />
        <h1 style={{ fontFamily: "'Cinzel', serif", fontWeight: 700, fontSize: "30px", letterSpacing: "2px", background: "linear-gradient(135deg, #B8860B 0%, #F3E5AB 50%, #D4AF37 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          PikaBoo
        </h1>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "12px", letterSpacing: "2px", color: "#D4AF37", marginTop: "4px" }}>
          find your Boo
        </p>
      </div>

      {/* Section 2 — Body Text */}
      <p className="text-gray-300 text-center text-sm font-medium my-4 max-w-xs">
        Real people. Real connections. Find your perfect Boo today.
      </p>

      {/* Section 3 — Primary Buttons */}
      <div className="w-full max-w-sm">
        <Link
          to="/register"
          className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold rounded-full text-center shadow-lg flex items-center justify-center active:scale-95 transition-transform">
          
          Create Account
        </Link>
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3.5 border border-[#D4AF37] text-[#D4AF37] font-semibold rounded-full text-center mt-3 active:scale-95 transition-transform">
          
          Log In
        </button>

        {/* Section 4 — Social Login */}
        <p className="text-xs text-amber-200/60 my-3 text-center">or continue with</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleGoogle} aria-label="Continue with Google" className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: "#141416", border: "1px solid rgba(212,175,55,0.35)" }}>
            <GoogleIcon className="w-5 h-5" />
          </button>
          <button onClick={handleApple} aria-label="Continue with Apple" className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: "#141416", border: "1px solid rgba(212,175,55,0.35)" }}>
            <Apple className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </button>
          <Link to="/register" aria-label="Continue with Phone" className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: "#141416", border: "1px solid rgba(212,175,55,0.35)" }}>
            <Phone className="w-5 h-5" style={{ color: "#F3E5AB" }} />
          </Link>
        </div>

        <p className="text-sm font-body mt-4 text-center" style={{ color: "rgba(243,229,171,0.85)" }}>
          Already have an account?{" "}
          <button onClick={() => setShowForm(true)} className="font-bold underline" style={{ color: "#F3E5AB" }}>
            Sign In
          </button>
        </p>
      </div>
    </div>);

}