import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Apple, Phone, ArrowLeft } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

const EMBLEM_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/eb969a81b_App_Icon-removebg-preview.png";
const FADE = "linear-gradient(180deg, rgba(5,3,0,0) 0%, rgba(5,3,0,0) 30%, rgba(5,3,0,0.85) 62%, #050300 100%)";

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
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center px-6 box-border relative"
        style={{
          backgroundColor: "#050300",
          paddingTop: "calc(2.5rem + env(safe-area-inset-top))",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
          backgroundImage: `url('${EMBLEM_URL}')`,
          backgroundSize: "contain",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat"
        }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: FADE }} />
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-2xl p-6 relative z-10" style={{ background: "rgba(15,12,5,0.6)", border: "1px solid rgba(212,175,55,0.25)" }}>
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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 box-border relative gap-6"
      style={{
        backgroundColor: "#050300",
        paddingTop: "calc(2.5rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))"
      }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: FADE }} />

      {/* Emblem */}
      <img
        src={EMBLEM_URL}
        alt="PikaBoo"
        className="relative z-10 w-72 h-72 object-contain py-3 mb-1 mr-2"
        style={{ filter: "drop-shadow(0 0 18px rgba(212,175,55,0.35))" }} />

      {/* Body Text */}
      <p className="text-center text-sm max-w-xs relative z-10 -mt-4 [font-family:'Merriweather',_serif]" style={{ color: "#F3E5AB" }}>
        <span style={{ color: "#FFFFFF" }}>Real people. </span>
        <span style={{ color: "#D4AF37", fontWeight: 700 }}>Real connections.</span>
        <br />
        <span style={{ color: "rgba(212,175,55,0.85)" }}>Find your perfect Boo today.</span>
      </p>

      {/* Primary Buttons */}
      <div className="w-full max-w-sm relative z-10">
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

        {/* Social Login */}
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
      </div>
    </div>);

}