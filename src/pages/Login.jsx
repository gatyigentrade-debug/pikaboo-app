import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Apple, Phone } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";

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
    <div
      className="min-h-screen relative flex flex-col justify-end overflow-hidden"
      style={{
        backgroundImage: `url("https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/1a713f8a0_LogginScreen.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Transparent overlay for interactive elements at bottom */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] flex flex-col items-center">
        {/* Form (toggle) */}
        {showForm ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4 mb-4 bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-gold/20">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">{error}</div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-gold/80 font-body">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <Input
                  id="email" type="email" autoFocus
                  placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-black/40 border-gold/20 rounded-full text-foreground placeholder:text-muted-foreground/60"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-gold/80 font-body">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/60" />
                <Input
                  id="password" type="password"
                  placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-black/40 border-gold/20 rounded-full text-foreground placeholder:text-muted-foreground/60"
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
            <button type="button" onClick={() => setShowForm(false)} className="w-full text-xs text-gold/70 font-body">
              ← Back
            </button>
          </form>
        ) : (
          <>
            {/* Get Started */}
            <Link
              to="/register"
              aria-label="Get Started"
              className="w-full h-12 rounded-full mb-5 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-gold text-black font-heading font-bold shadow-lg active:scale-95 transition-transform"
            >
              Get Started
            </Link>

            {/* Social icons */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <button onClick={handleGoogle} aria-label="Continue with Google" className="w-12 h-12 rounded-full border border-gold/40 bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
                <GoogleIcon className="w-5 h-5" />
              </button>
              <button onClick={handleApple} aria-label="Continue with Apple" className="w-12 h-12 rounded-full border border-gold/40 bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
                <Apple className="w-5 h-5 text-gold" />
              </button>
              <Link to="/register" aria-label="Continue with Phone" className="w-12 h-12 rounded-full border border-gold/40 bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform">
                <Phone className="w-5 h-5 text-gold" />
              </Link>
            </div>

            {/* Sign In */}
            <button onClick={() => setShowForm(true)} className="w-full text-sm text-gold/90 font-body active:scale-95 transition-transform">
              Already have an account? <span className="font-bold underline">Sign In</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}