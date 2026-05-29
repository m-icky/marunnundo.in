'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login } from '@/app/actions/auth';
import { HeartPulse, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Use window.location.href to force full layout reload and prevent Next.js layout caching
        if (res.role === 'SUPERADMIN') {
          window.location.href = '/admin';
        } else if (res.role === 'OWNER') {
          window.location.href = '/owner';
        } else {
          window.location.href = '/';
        }
      } else {
        setError(res.error || t('invalid_credentials'));
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-tr from-emerald-50/50 via-slate-50 to-blue-50/50">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200/80 shadow-2xl relative">
        {/* Branding header */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
          </Link>
          <div className="flex flex-col mt-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {t('login_title')}
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-wider">
              {t('login_subtitle')}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              {t('email_label')}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              {t('password_label')}
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{isLoading ? t('logging_in_btn') : t('login_btn')}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center flex flex-col gap-2.5">
          <p className="text-xs text-slate-500 font-bold">
            {t('no_account_prompt')}
          </p>
          <Link
            href="/register"
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            {t('register_here')}
          </Link>
        </div>

      </div>

    </div>
  );
}
