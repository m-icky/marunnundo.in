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

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-400 border-r border-slate-800 p-6 flex flex-col justify-between flex-shrink-0 animate-slide-in-left">
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
          <Link
            href="/owner"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname === '/owner' 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span>{t('owner_nav_overview')}</span>
          </Link>
          
          <Link
            href="/owner/shop"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname === '/owner/shop' 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Settings className="w-4.5 h-4.5" />
            <span>{t('owner_nav_settings')}</span>
          </Link>

          <Link
            href="/owner/medicines"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname.startsWith('/owner/medicines') 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <PlusCircle className="w-4.5 h-4.5" />
            <span>{t('owner_nav_inventory')}</span>
          </Link>

          <Link
            href="/owner/reviews"
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              pathname.startsWith('/owner/reviews') 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>{t('owner_nav_reviews')}</span>
          </Link>
        </nav>

      </div>

      {/* Quick Links / Status */}
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
    </aside>
  );
}
