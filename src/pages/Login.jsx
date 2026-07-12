import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowRight, Mail, Lock, Loader2, Apple, Phone } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

const LOGO_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/c376ec1bd_AppIcon.png";

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative floating hearts & sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { t: "8%", l: "10%", s: "text-gold/8", sz: "text-5xl", rot: "-15deg" },
          { t: "15%", l: "85%", s: "text-gold/6", sz: "text-3xl", rot: "20deg" },
          { t: "70%", l: "5%", s: "text-gold/5", sz: "text-4xl", rot: "-25deg" },
          { t: "80%", l: "90%", s: "text-gold/7", sz: "text-6xl", rot: "15deg" },
          { t: "45%", l: "92%", s: "text-gold/4", sz: "text-2xl", rot: "10deg" },
          { t: "35%", l: "3%", s: "text-gold/6", sz: "text-3xl", rot: "-10deg" },
        ].map((h, i) => (
          <Heart
            key={i}
            className={`absolute ${h.s} ${h.sz} animate-float`}
            style={{ top: h.t, left: h.l, transform: h.rot, animationDelay: `${i * 0.5}s` }}
            fill="currentColor"
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`sp-${i}`}
            className="absolute w-1 h-1 rounded-full bg-gold/30 animate-sparkle"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        {/* Gold emblem */}
        <div className="relative mb-6">
          <img
            src={LOGO_URL}
            alt="PikaBoo"
            className="w-36 h-36 object-contain glow-gold animate-float"
          />
        </div>

        {/* Brand name */}
        <h1 className="text-4xl font-heading font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-gold to-yellow-500 mb-1">
          PikaBoo
        </h1>
        <p className="text-sm font-body text-gold/70 flex items-center gap-2 mb-8">
          <Heart className="w-3 h-3 text-gold/60" fill="currentColor" />
          find your Boo
          <Heart className="w-3 h-3 text-gold/60" fill="currentColor" />
        </p>

        {/* Copy */}
        <div className="text-center mb-6">
          <p className="text-lg font-heading font-bold text-foreground">
            Real people. <span className="text-gold">Real connections.</span>
          </p>
          <p className="text-sm text-muted-foreground font-body mt-1">Find your perfect Boo today.</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-12 h-px bg-gold/30" />
            <Heart className="w-3 h-3 text-gold/50" fill="currentColor" />
            <div className="w-12 h-px bg-gold/30" />
          </div>
        </div>

        {/* Form (toggle) */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4 mb-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground font-body">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email" type="email" autoFocus
                  placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-gold/20 rounded-full"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password" type="password"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-secondary border-gold/20 rounded-full"
                  required
                />
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full h-12 rounded-full bg-gradient-to-r from-yellow-400 to-gold text-black font-heading font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="w-full text-xs text-muted-foreground font-body">
              ← Back
            </button>
          </form>
        ) : (
          <>
            {/* Get Started */}
            <Link
              to="/register"
              className="w-full h-12 rounded-full bg-gradient-to-r from-yellow-400 to-gold text-black font-heading font-bold flex items-center justify-center gap-2 glow-gold mb-5"
            >
              <Heart className="w-4 h-4" fill="currentColor" />
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Divider */}
            <div className="w-full flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-gold/20" />
              <span className="text-xs text-gold/50 font-body">or continue with</span>
              <div className="flex-1 h-px bg-gold/20" />
            </div>

            {/* Social auth */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <button
                onClick={handleGoogle}
                className="w-12 h-12 rounded-full border border-gold/30 bg-secondary flex items-center justify-center hover:bg-gold/10 transition-colors"
              >
                <GoogleIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleApple}
                className="w-12 h-12 rounded-full border border-gold/30 bg-secondary flex items-center justify-center hover:bg-gold/10 transition-colors"
              >
                <Apple className="w-5 h-5 text-foreground" />
              </button>
              <Link
                to="/register"
                className="w-12 h-12 rounded-full border border-gold/30 bg-secondary flex items-center justify-center hover:bg-gold/10 transition-colors"
              >
                <Phone className="w-5 h-5 text-foreground" />
              </Link>
            </div>
          </>
        )}

        {/* Footer */}
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="text-sm text-muted-foreground font-body">
            Already have an account? <span className="text-gold font-semibold">Sign In →</span>
          </button>
        )}
      </div>
    </div>
  );
}