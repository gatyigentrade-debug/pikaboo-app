import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Apple, Phone, ArrowLeft } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

const EMBLEM_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/eb969a81b_App_Icon-removebg-preview.png";

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
        className="h-[100dvh] overflow-hidden w-full flex flex-col items-center justify-center px-6 box-border relative"
        style={{
          paddingTop: "calc(2.5rem + env(safe-area-inset-top))",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="w-full max-w-sm relative z-10">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="flex items-center gap-1 text-xs font-body mb-3 text-gold/80"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <form
            onSubmit={handleSubmit}
            className="w-full space-y-4 rounded-2xl p-5 glass-panel shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)]"
          >
            <h2 className="text-xl font-heading font-bold text-center text-foreground">Welcome back</h2>
            {error && (
              <div className="p-3 rounded-lg text-sm text-center bg-destructive/15 text-red-300">{error}</div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-body text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                <Input
                  id="email" type="email" autoFocus placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/70 focus:border-gold/60 focus:bg-white/[0.07]"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-body text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/70" />
                <Input
                  id="password" type="password" placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground/70 focus:border-gold/60 focus:bg-white/[0.07]"
                  required
                />
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full h-12 rounded-[14px] font-heading font-bold text-[#171717] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 transition-transform"
              style={{ background: "linear-gradient(110deg, #D4A54A 0%, #F3E5AB 50%, #D4A54A 100%)", boxShadow: "0 10px 30px -10px rgba(212,165,74,0.5)" }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main entry layout
  return (
    <div
      className="h-[100dvh] overflow-hidden w-full flex flex-col items-center justify-center px-6 box-border relative gap-5"
      style={{
        paddingTop: "calc(3rem + env(safe-area-inset-top))",
        paddingBottom: "calc(2.5rem + env(safe-area-inset-bottom))",
      }}
    >
      <img
        src={EMBLEM_URL}
        alt="PikaBoo"
        className="relative z-10 w-40 h-40 object-contain mb-1 animate-float"
        style={{ filter: "drop-shadow(0 0 18px rgba(212,165,74,0.4))" }}
      />

      <div className="text-center max-w-xs relative z-10">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">
          Find Your <span className="text-gradient-gold">Boo.</span>
        </h1>
        <p className="text-sm font-body mt-2 text-muted-foreground">
          Real people. <span className="text-gold font-semibold">Real connections.</span>
          <br />
          Find your perfect Boo today.
        </p>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <Link
          to="/register"
          className="w-full h-12 rounded-[14px] bg-gradient-to-r from-[#E8C56A] to-[#D4A54A] text-[#171717] font-heading font-bold flex items-center justify-center active:scale-95 transition-transform shadow-[0_10px_30px_-10px_rgba(212,165,74,0.5)]"
        >
          Create Account
        </Link>
        <button
          onClick={() => setShowForm(true)}
          className="w-full h-12 rounded-[14px] border border-gold/40 text-gold font-semibold mt-3 active:scale-95 transition-transform hover:bg-gold/10"
        >
          Log In
        </button>

        <p className="text-xs text-muted-foreground my-3 text-center">or continue with</p>
        <div className="flex justify-center gap-4">
          <button onClick={handleGoogle} aria-label="Continue with Google" className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform bg-white/5 border border-gold/25 hover:border-gold/50">
            <GoogleIcon className="w-5 h-5" />
          </button>
          <button onClick={handleApple} aria-label="Continue with Apple" className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform bg-white/5 border border-gold/25 hover:border-gold/50">
            <Apple className="w-5 h-5 text-foreground" />
          </button>
          <Link to="/register" aria-label="Continue with Phone" className="w-12 h-12 rounded-full flex items-center justify-center active:scale-95 transition-transform bg-white/5 border border-gold/25 hover:border-gold/50">
            <Phone className="w-5 h-5 text-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}