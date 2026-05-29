import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies, getPharmacyAnalytics } from '@/app/actions/owner';
import { getPharmacyDetails } from '@/app/actions/public';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { 
  PlusCircle, 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Star, 
  MessageSquare,
  ArrowRight,
  TrendingDown,
  Info,
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default async function OwnerDashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  
  if (pharmacies.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center gap-4 max-w-xl mx-auto my-12 shadow-xl">
        <Package className="w-16 h-16 text-slate-300" />
        <h2 className="text-2xl font-black text-slate-800">No Pharmacy Registered</h2>
        <p className="text-slate-500 text-sm">
          You are currently logged in as a Merchant, but you have no registered medical shops under your account. Please log out and register again as a Pharmacy Owner or contact support.
        </p>
        <Link 
          href="/register"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer text-sm"
        >
          Register Store
        </Link>
      </div>
    );
  }

  const pharmacy = pharmacies[0];
  const analytics = await getPharmacyAnalytics(pharmacy.id);
  const fullDetails = await getPharmacyDetails(pharmacy.id);
  const recentReviews = fullDetails?.reviews.slice(0, 3) || [];

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 160;
  const padding = 30;

  // Let's plot visitor stats dynamically
  // stats: { name: string, visits: number, searches: number }[]
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
    <div className="flex flex-col gap-8">
      
      {/* Welcome Banner */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 to-slate-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1 bg-slate-800/80 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full w-max border border-slate-700">
            <Sparkles className="w-3 h-3 animate-spin" /> MERCHANT PORTAL
          </div>
          <h1 className="text-2xl sm:text-3.5xl font-black tracking-tight leading-none">
            Welcome back, {session.name}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium">
            Manage stock availability, track analytics, and handle patient reviews.
          </p>
        </div>

        <Link
          href="/owner/medicines"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-900/40 text-xs sm:text-sm flex items-center gap-1.5 active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>മരുന്നുകൾ ചേർക്കുക (Add Medicine)</span>
        </Link>
      </section>

      {/* METRICS ROW */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Medicines */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">മരുന്നുകളുടെ എണ്ണം</span>
            <span className="text-3xl font-black text-slate-800 leading-none">{analytics.totalMedicines}</span>
            <span className="text-[10px] font-bold text-slate-500">Total Medicine SKUs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-amber-600">കുറഞ്ഞ സ്റ്റോക്ക്</span>
            <span className="text-3xl font-black text-amber-600 leading-none">{analytics.lowStock}</span>
            <span className="text-[10px] font-bold text-slate-500">Low Stock Alert (&le;10 qty)</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Estimated Value */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ആകെ സ്റ്റോക്ക് മൂല്യം</span>
            <span className="text-2xl font-black text-slate-800 leading-none">₹ {analytics.totalValue.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-slate-500">Estimated Stock Value</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Reviews average */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ഉപയോക്തൃ റേറ്റിംഗ്</span>
            <span className="text-3xl font-black text-amber-500 leading-none flex items-center gap-1">
              <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
              {analytics.avgRating > 0 ? analytics.avgRating.toFixed(1) : '0.0'}
            </span>
            <span className="text-[10px] font-bold text-slate-500">Based on {analytics.totalReviews} reviews</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Star className="w-6 h-6 fill-amber-500" />
          </div>
        </div>

      </section>

      {/* DETAILED STATS & ANALYTICS VISUAL CHART */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG VISITOR GRAPH (2 Cols on desktop) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5 bg-white">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              പേജ് സന്ദർശന വിവരങ്ങൾ (Shop View & Searches)
            </h3>
            <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
              Last 5 Months
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
          <div className="flex gap-6 justify-center text-xs font-bold pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              ഷോപ്പ് സന്ദർശനം (Shop Page Views)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
              തിരച്ചിലുകൾ (Medicine Queries)
            </span>
          </div>
        </div>

        {/* QUICK REVIEWS LOG PANEL */}
        <div className="glass-card rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between bg-white">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                സമീപകാല റിവ്യൂസ്
              </h3>
              <Link 
                href="/owner/reviews"
                className="text-[11px] font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center"
              >
                All <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {recentReviews.length === 0 ? (
              <p className="text-slate-400 font-semibold italic text-xs text-center py-10">
                അഭിപ്രായങ്ങൾ ഒന്നും ലഭിച്ചിട്ടില്ല.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentReviews.map(review => (
                  <div key={review.id} className="p-3 border border-slate-50 rounded-xl bg-slate-50/50 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-700">{review.user.name}</span>
                      <span className="text-amber-500 flex items-center gap-0.5">
                        ⭐ {review.rating}
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs font-semibold line-clamp-2 leading-relaxed">
                      {review.comment}
                    </p>
                    {review.reply ? (
                      <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded self-start mt-1">
                        Replied
                      </span>
                    ) : (
                      <span className="text-[9px] font-extrabold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded self-start mt-1">
                        Needs Reply
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/owner/reviews"
            className="w-full mt-4 flex items-center justify-center gap-1 bg-slate-900 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-98 text-xs cursor-pointer"
          >
            <span>റിവ്യൂകൾക്ക് മറുപടി നൽകാം (Reply reviews)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </section>

    </div>
  );
}
