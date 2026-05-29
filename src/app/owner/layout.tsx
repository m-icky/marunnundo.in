import { getSession } from '@/app/actions/auth';
import { getOwnerPharmacies } from '@/app/actions/owner';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  MessageSquare, 
  Store,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

export default async function OwnerLayout({ children }: Props) {
  const session = await getSession();
  
  // Guard route
  if (!session || session.role !== 'OWNER') {
    redirect('/login');
  }

  const pharmacies = await getOwnerPharmacies();
  const hasPharmacy = pharmacies.length > 0;
  const primaryPharmacy = hasPharmacy ? pharmacies[0] : null;

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
      
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-400 border-r border-slate-800 p-6 flex flex-col justify-between flex-shrink-0">
        <div className="flex flex-col gap-8">
          
          {/* Header metadata */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
              Pharmacy Manager
            </span>
            <h3 className="font-extrabold text-white text-base leading-snug">
              {primaryPharmacy ? primaryPharmacy.name : 'No Shop Registered'}
            </h3>
            {primaryPharmacy && (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold w-max px-2 py-0.5 rounded-full ${
                primaryPharmacy.isVerified 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              }`}>
                {primaryPharmacy.isVerified ? 'VERIFIED' : 'PENDING APPROVAL'}
              </span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            <Link
              href="/owner"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>ഡാഷ്‌ബോർഡ് (Overview)</span>
            </Link>
            
            <Link
              href="/owner/shop"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Settings className="w-4.5 h-4.5" />
              <span>ഷോപ്പ് ക്രമീകരണങ്ങൾ (Settings)</span>
            </Link>

            <Link
              href="/owner/medicines"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>മരുന്ന് സ്റ്റോക്ക് (Inventory)</span>
            </Link>

            <Link
              href="/owner/reviews"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              <span>അഭിപ്രായങ്ങൾ (Reviews)</span>
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
                <Store className="w-3.5 h-3.5" /> Live Preview
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secure Merchant Portal</span>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN DASHBOARD PAGE OUTLET */}
      <main className="flex-1 bg-slate-50 p-4 sm:p-8 flex flex-col gap-6 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
