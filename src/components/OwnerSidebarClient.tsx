'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  MessageSquare, 
  Store,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface Props {
  primaryPharmacy: {
    id: string;
    name: string;
    isVerified: boolean;
  } | null;
}

export default function OwnerSidebarClient({ primaryPharmacy }: Props) {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: '/owner',            icon: LayoutDashboard, label: t('owner_nav_overview'),  exact: true },
    { href: '/owner/shop',       icon: Settings,        label: t('owner_nav_settings'),  exact: true },
    { href: '/owner/medicines',  icon: PlusCircle,      label: t('owner_nav_inventory'), exact: false },
  ];

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-400 border-b md:border-b-0 md:border-r border-slate-800 flex-shrink-0">

      {/* ── Mobile: horizontal scrollable tab bar ── */}
      <nav className="flex md:hidden overflow-x-auto scrollbar-hide border-b border-slate-800">
        {navLinks.map(({ href, icon: Icon, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`flex-shrink-0 flex flex-col items-center gap-1 px-5 py-3 text-[10px] font-bold transition-all whitespace-nowrap border-b-2 ${
              isActive(href, exact)
                ? 'border-emerald-400 text-emerald-400 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/40'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
        {primaryPharmacy && (
          <a
            href={`/pharmacy/${primaryPharmacy.id}`}
            target="_blank"
            rel="noreferrer"
            className="flex-shrink-0 flex flex-col items-center gap-1 px-5 py-3 text-[10px] font-bold text-emerald-400 hover:text-emerald-300 border-b-2 border-transparent whitespace-nowrap"
          >
            <Store className="w-4 h-4" />
            {t('owner_live_preview')}
          </a>
        )}
      </nav>

      {/* ── Desktop: vertical sidebar ── */}
      <div className="hidden md:flex flex-col justify-between h-full p-6">
        <div className="flex flex-col gap-8">
          {/* Header metadata */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              {t('owner_sidebar_title')}
            </span>
            <h3 className="font-extrabold text-white text-base leading-snug">
              {primaryPharmacy ? primaryPharmacy.name : t('owner_no_shop')}
            </h3>
            {primaryPharmacy && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold w-max px-2.5 py-0.5 rounded-full ${
                primaryPharmacy.isVerified 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {primaryPharmacy.isVerified ? t('owner_verified') : t('owner_pending')}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map(({ href, icon: Icon, label, exact }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isActive(href, exact)
                    ? 'bg-slate-800 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Links */}
        {primaryPharmacy && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col gap-3">
            <a
              href={`/pharmacy/${primaryPharmacy.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" /> {t('owner_live_preview')}
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('owner_secure_portal')}</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
