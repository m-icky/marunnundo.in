'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { JWTPayload } from '@/lib/jwt';
import { Menu, X, LogOut, Shield, LayoutDashboard, PlusCircle, MapPin, HeartPulse } from 'lucide-react';

interface HeaderProps {
  session: JWTPayload | null;
}

export default function Header({ session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.refresh();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight font-sans leading-none flex items-center gap-1">
                മരുന്നുണ്ടോ<span className="text-blue-600">.in</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                Pharmacy Discovery
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-slate-600 hover:text-emerald-700 font-bold text-sm tracking-wide transition-colors"
            >
              ഹോം (Home)
            </Link>

            {session?.role === 'USER' && (
              <span className="text-slate-600 text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full">
                Patient: <span className="font-bold text-slate-800">{session.name}</span>
              </span>
            )}

            {session?.role === 'OWNER' && (
              <>
                <Link
                  href="/owner"
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm tracking-wide transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  ഡാഷ്‌ബോർഡ് (Dashboard)
                </Link>
                <Link
                  href="/owner/medicines"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-bold text-sm tracking-wide transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  മരുന്നുകൾ (Medicines)
                </Link>
              </>
            )}

            {session?.role === 'SUPERADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-sm tracking-wide transition-colors"
              >
                <Shield className="w-4 h-4" />
                അഡ്മിൻ പാനൽ (Admin Panel)
              </Link>
            )}

            {!session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-emerald-800 font-bold text-sm px-4 py-2 transition-colors"
                >
                  ലോഗിൻ (Login)
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all active:scale-98"
                >
                  രജിസ്റ്റർ (Register)
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold text-sm px-3 py-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                ലോഗൗട്ട് (Logout)
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-600 hover:text-emerald-800 focus:outline-none p-1.5 rounded-lg border border-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-t border-slate-200 bg-white/95 py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 hover:text-emerald-700 font-bold text-base py-2 border-b border-slate-100"
          >
            ഹോം (Home)
          </Link>

          {session?.role === 'USER' && (
            <div className="text-slate-600 text-xs font-semibold py-1">
              Patient: <span className="font-bold text-slate-800">{session.name}</span>
            </div>
          )}

          {session?.role === 'OWNER' && (
            <>
              <Link
                href="/owner"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-base py-2 border-b border-slate-100"
              >
                <LayoutDashboard className="w-4 h-4" />
                ഡാഷ്‌ബോർഡ് (Dashboard)
              </Link>
              <Link
                href="/owner/medicines"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-bold text-base py-2 border-b border-slate-100"
              >
                <PlusCircle className="w-4 h-4" />
                മരുന്നുകൾ (Medicines)
              </Link>
            </>
          )}

          {session?.role === 'SUPERADMIN' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-base py-2 border-b border-slate-100"
            >
              <Shield className="w-4 h-4" />
              അഡ്മിൻ പാനൽ (Admin Panel)
            </Link>
          )}

          {!session ? (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-slate-700 hover:text-emerald-800 font-bold text-base py-2.5 rounded-xl border border-slate-200 transition-colors"
              >
                ലോഗിൻ (Login)
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-emerald-600 text-white font-bold text-base py-2.5 rounded-xl shadow-lg transition-colors"
              >
                രജിസ്റ്റർ (Register)
              </Link>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-center gap-2 w-full text-slate-500 hover:text-red-600 font-bold text-base py-3 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              ലോഗൗട്ട് (Logout)
            </button>
          )}
        </div>
      )}
    </header>
  );
}
