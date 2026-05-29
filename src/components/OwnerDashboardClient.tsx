'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { 
  PlusCircle, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Star, 
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface Props {
  sessionName: string;
  analytics: {
    totalMedicines: number;
    lowStock: number;
    totalValue: number;
    visitorStats: { name: string; visits: number; searches: number }[];
  } | null;
  pharmacyId: string | null;
}

export default function OwnerDashboardClient({ sessionName, analytics, pharmacyId }: Props) {
  const { t } = useLanguage();

  if (!pharmacyId || !analytics) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center gap-4 max-w-xl mx-auto my-12 shadow-xl bg-white animate-fade-in">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-black text-slate-800">{t('no_pharmacy_registered')}</h2>
        <p className="text-slate-500 text-sm font-semibold leading-relaxed">
          {t('no_pharmacy_desc')}
        </p>
        <Link 
          href="/register"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer text-sm"
        >
          {t('register_store_btn')}
        </Link>
      </div>
    );
  }

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 160;
  const padding = 30;

  // Let's plot visitor stats dynamically
  const maxVal = Math.max(...analytics.visitorStats.flatMap(d => [d.visits, d.searches]), 10);
  
  const pointsVisits = analytics.visitorStats.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (analytics.visitorStats.length - 1);
    const y = chartHeight - padding - (d.visits / maxVal) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pointsSearches = analytics.visitorStats.map((d, i) => {
    const x = padding + (i * (chartWidth - padding * 2)) / (analytics.visitorStats.length - 1);
    const y = chartHeight - padding - (d.searches / maxVal) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1 bg-slate-800/80 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full w-max border border-slate-700">
            <Sparkles className="w-3 h-3 animate-spin text-emerald-400" /> 
            <span>{t('pharmacy_portal').toUpperCase()}</span>
          </div>
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-none">
            {t('welcome_back')} {sessionName}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            {t('merchant_desc')}
          </p>
        </div>

        <Link
          href="/owner/medicines"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-900/40 text-xs sm:text-sm flex items-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('add_medicine_btn')}</span>
        </Link>
      </section>

      {/* METRICS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Medicines */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm bg-white">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('metrics_sku').split(' | ')[0]}</span>
            <span className="text-3xl font-black text-slate-800 leading-none">{analytics.totalMedicines}</span>
            <span className="text-[10px] font-bold text-slate-500">Total Medicine SKUs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm bg-white">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-amber-600">{t('metrics_low_stock')}</span>
            <span className="text-3xl font-black text-amber-600 leading-none">{analytics.lowStock}</span>
            <span className="text-[10px] font-bold text-slate-500">{t('metrics_low_stock_desc')}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Estimated Value */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm bg-white">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('metrics_value')}</span>
            <span className="text-2xl font-black text-slate-800 leading-none">₹ {analytics.totalValue.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-500">{t('metrics_value_desc')}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Secure Status */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm bg-white">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('owner_nav_settings')}</span>
            <span className="text-2xl font-black text-emerald-600 leading-none">Active</span>
            <span className="text-[10px] font-bold text-slate-500">Secure Merchant Portal</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </section>

      {/* DETAILED STATS & ANALYTICS VISUAL CHART */}
      <section className="grid grid-cols-1 gap-6">
        
        {/* SVG VISITOR GRAPH */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col gap-5 bg-white">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              {t('analytics_title')}
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              {t('analytics_sub')}
            </span>
          </div>

          {/* SVG Inline chart render */}
          <div className="w-full flex justify-center">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full max-w-[500px] h-auto overflow-visible select-none"
            >
              {/* Grid Lines */}
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="#f1f5f9" strokeWidth={1} />
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#cbd5e1" strokeWidth={1.5} />

              {/* Path Visits (Green line) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsVisits}
              />

              {/* Path Searches (Blue line) */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsSearches}
              />

              {/* Data points dots */}
              {analytics.visitorStats.map((d, i) => {
                const x = padding + (i * (chartWidth - padding * 2)) / (analytics.visitorStats.length - 1);
                const yVisits = chartHeight - padding - (d.visits / maxVal) * (chartHeight - padding * 2);
                const ySearches = chartHeight - padding - (d.searches / maxVal) * (chartHeight - padding * 2);
                
                return (
                  <g key={i}>
                    {/* Visits dots */}
                    <circle cx={x} cy={yVisits} r={4} fill="#10b981" stroke="white" strokeWidth={1.5} />
                    {/* Searches dots */}
                    <circle cx={x} cy={ySearches} r={4} fill="#2563eb" stroke="white" strokeWidth={1.5} />
                    
                    {/* X axis month labels */}
                    <text
                      x={x}
                      y={chartHeight - 10}
                      fontSize="9"
                      fontWeight="bold"
                      fill="#94a3b8"
                      textAnchor="middle"
                    >
                      {d.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend indicator */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center text-xs font-bold pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              {t('analytics_visits')}
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              {t('analytics_queries')}
            </span>
          </div>
        </div>

      </section>

    </div>
  );
}
