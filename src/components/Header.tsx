'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth';
import { JWTPayload } from '@/lib/jwt';
import { Menu, X, LogOut, Shield, LayoutDashboard, PlusCircle, HeartPulse, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface HeaderProps {
  session: JWTPayload | null;
}

export default function Header({ session }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200 bg-white flex items-center justify-center border border-slate-100 p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Marunnundo Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight font-sans leading-none flex items-center gap-1">
                മരുന്നുണ്ടോ<span className="text-blue-600">.in</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                {t('pharmacy_discovery')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {/* Language Switcher */}
            <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/50 mr-2 shadow-inner items-center">
              <Globe className="w-3.5 h-3.5 text-slate-400 mx-2" />
              <button
                onClick={() => setLanguage('ml')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'ml'
                    ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                മലയാളം
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
            </div>

            <Link 
              href="/" 
              className="text-slate-600 hover:text-emerald-700 font-bold text-sm tracking-wide transition-colors"
            >
              {t('home')}
            </Link>

            {session?.role === 'USER' && (
              <span className="text-slate-600 text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full">
                {t('patient')}: <span className="font-bold text-slate-800">{session.name}</span>
              </span>
            )}

            {session?.role === 'OWNER' && (
              <>
                <Link
                  href="/owner"
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-sm tracking-wide transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {t('dashboard')}
                </Link>
                <Link
                  href="/owner/medicines"
                  className="flex items-center gap-1.5 text-slate-600 hover:text-emerald-700 font-bold text-sm tracking-wide transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('medicines')}
                </Link>
              </>
            )}

            {session?.role === 'SUPERADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-red-600 hover:text-red-700 font-bold text-sm tracking-wide transition-colors"
              >
                <Shield className="w-4 h-4" />
                {t('admin_panel')}
              </Link>
            )}

            {!session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-600 hover:text-emerald-800 font-bold text-sm px-4 py-2 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all active:scale-98"
                >
                  {t('register')}
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-bold text-sm px-3 py-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                {t('logout')}
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
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
          {/* Mobile Language Selector */}
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Language / ഭാഷ
            </span>
            <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setLanguage('ml')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'ml'
                    ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                മലയാളം
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-700 hover:text-emerald-700 font-bold text-base py-2 border-b border-slate-100"
          >
            {t('home')}
          </Link>

          {session?.role === 'USER' && (
            <div className="text-slate-600 text-xs font-semibold py-1">
              {t('patient')}: <span className="font-bold text-slate-800">{session.name}</span>
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
                {t('dashboard')}
              </Link>
              <Link
                href="/owner/medicines"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-bold text-base py-2 border-b border-slate-100"
              >
                <PlusCircle className="w-4 h-4" />
                {t('medicines')}
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
              {t('admin_panel')}
            </Link>
          )}

          {!session ? (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-slate-700 hover:text-emerald-800 font-bold text-base py-2.5 rounded-xl border border-slate-200 transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-emerald-600 text-white font-bold text-base py-2.5 rounded-xl shadow-lg transition-colors"
              >
                {t('register')}
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
              {t('logout')}
            </button>
          )}
        </div>
      )}
    </header>
  );
}
