import React from "react";
import useKeyboardInset from "@/hooks/useKeyboardInset";

const LOGO_URL = "https://media.base44.com/images/public/6a1ae3ef77b040df5f5f2e2c/eb969a81b_App_Icon-removebg-preview.png";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  const keyboardInset = useKeyboardInset();

  return (
    <div className="h-[100dvh] overflow-y-auto overscroll-y-contain relative">
      <div
        className="relative z-10 min-h-full flex flex-col items-center justify-center px-4 pt-6"
        style={{ paddingBottom: `calc(4.5rem + env(safe-area-inset-bottom) + ${keyboardInset}px)` }}
      >
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center mb-5">
            <img
              src={LOGO_URL}
              alt="PikaBoo"
              className="w-16 h-16 object-contain mb-3"
              style={{ filter: "drop-shadow(0 0 14px rgba(212,165,74,0.45))" }}
            />
            {Icon && (
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gold/15 border border-gold/30 mb-3">
                <Icon className="w-6 h-6 text-gold" aria-hidden="true" />
              </div>
            )}
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">{subtitle}</p>}
          </div>
          <div className="glass-panel rounded-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] p-5">
            {children}
          </div>
          {footer && <p className="text-center text-sm text-muted-foreground mt-5">{footer}</p>}
        </div>
      </div>
    </div>
  );
}