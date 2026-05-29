'use client';

import Link from 'next/link';
import { HeartPulse, Phone, Mail, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 shadow-md">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                മരുന്നുണ്ടോ<span className="text-emerald-400">.in</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {t('footer_desc')}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t('footer_desc_en')}
            </p>
          </div>

          {/* Districts Covered */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              {t('key_districts')}
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>{t('ernakulam')}</li>
              <li>{t('trivandrum')}</li>
              <li>{t('kozhikode')}</li>
              <li>{t('thrissur')}</li>
            </ul>
          </div>

          {/* Contact and Trust */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              {t('contact_support')}
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>+91 484 2345 678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@marunnundo.in</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-emerald-400/90 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>{t('dhs_approved')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left text-xs text-slate-500">
            <p>&copy; {new Date().getFullYear()} Marunnundo.in. {t('all_rights_reserved')}</p>
            <span className="hidden sm:inline text-slate-800">|</span>
            <p>
              {t('designed_by')}{' '}
              <a 
                href="https://iam-naveen.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Mack&apos;s.Studio
              </a>
            </p>
          </div>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">{t('privacy_policy')}</Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">{t('terms_of_service')}</Link>
            <Link href="/pharmacy-license-policy" className="hover:text-emerald-400 transition-colors">{t('pharmacy_license_policy')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
