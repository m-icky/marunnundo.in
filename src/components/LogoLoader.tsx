'use client';

import { useEffect, useState } from 'react';

interface LogoLoaderProps {
  /** 'fullscreen' – fixed overlay covering the whole viewport (initial load / route change)
   *  'inline'     – centered block inside a container (API wait states) */
  variant?: 'fullscreen' | 'inline';
  /** Only for fullscreen: auto-hides after this many ms (0 = never auto-hide) */
  autoDismissMs?: number;
  label?: string;
}

export default function LogoLoader({
  variant = 'fullscreen',
  autoDismissMs = 0,
  label,
}: LogoLoaderProps) {
  const [fadingOut, setFadingOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (autoDismissMs > 0) {
      const fadeTimer = setTimeout(() => setFadingOut(true), autoDismissMs);
      const hideTimer = setTimeout(() => setHidden(true), autoDismissMs + 420);
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [autoDismissMs]);

  if (hidden) return null;

  /* ── Full-Screen Overlay ── */
  if (variant === 'fullscreen') {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(135% 135% at top left, #f0fdf4 0%, #f8fafc 55%, #eff6ff 100%)',
          animation: fadingOut ? 'loader-fade-out 0.4s ease forwards' : 'loader-fade-in 0.2s ease forwards',
        }}
      >
        {/* Decorative ping rings */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            className="absolute rounded-full border border-emerald-200/60 animate-ping"
            style={{ width: 160, height: 160, animationDuration: '2.4s' }}
          />
          <div
            className="absolute rounded-full border border-emerald-300/40 animate-ping"
            style={{ width: 112, height: 112, animationDuration: '1.8s', animationDelay: '0.3s' }}
          />

          {/* Logo */}
          <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl shadow-emerald-500/20 border border-slate-100 flex items-center justify-center p-2.5 logo-pop">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Marunnundo Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Brand name */}
        <div className="mt-8 flex flex-col items-center gap-1.5">
          <span className="text-2xl font-black text-emerald-800 tracking-tight">
            മരുന്നുണ്ടോ<span className="text-blue-600">.in</span>
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {label ?? 'PHARMACY DISCOVERY'}
          </span>
        </div>

        {/* Staggered bouncing dots */}
        <div className="mt-6 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-500"
              style={{
                animation: 'logo-pop 1.2s cubic-bezier(0.4,0,0.6,1) infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  /* ── Inline / Compact Loader ── */
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: 200,
        gap: 16,
      }}
    >
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div
          className="absolute rounded-full border border-emerald-200/60 animate-ping"
          style={{ width: 80, height: 80, animationDuration: '2s' }}
        />
        <div className="w-14 h-14 rounded-2xl bg-white shadow-lg shadow-emerald-500/15 border border-slate-100 flex items-center justify-center p-1.5 logo-pop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Loading…" className="w-full h-full object-contain" />
        </div>
      </div>
      {label && (
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}

