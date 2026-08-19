import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="h-[100dvh] overflow-hidden flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 mb-4 shadow-md">
            <Icon className="w-7 h-7 text-black" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">{title}</h1>
          {subtitle && <p className="text-slate-200 mt-2">{subtitle}</p>}
        </div>
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-500/30 p-5">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-slate-200 mt-6">{footer}</p>
        )}
      </div>
    </div>
  );
}