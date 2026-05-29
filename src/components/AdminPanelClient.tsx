'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyPharmacy, toggleSuspendPharmacy } from '@/app/actions/admin';
import { 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Store, 
  Package, 
  Phone, 
  Mail, 
  FileText, 
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Eye,
  ShieldAlert as ShieldIcon,
  MapPin
} from 'lucide-react';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  whatsappNumber: string | null;
  licenseNumber: string;
  isVerified: boolean;
  isSuspended: boolean;
  createdAt: Date;
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  _count: {
    medicines: number;
    reviews: number;
  };
}

interface Stats {
  totalUsers: number;
  totalOwners: number;
  totalPharmacies: number;
  verifiedPharmacies: number;
  pendingPharmacies: number;
  suspendedPharmacies: number;
  totalMedicines: number;
}

interface Props {
  stats: Stats;
  initialPharmacies: Pharmacy[];
}

export default function AdminPanelClient({ stats, initialPharmacies }: Props) {
  const router = useRouter();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(initialPharmacies);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'suspended'>('all');
  
  // Loading action states
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleVerify = async (id: string) => {
    if (!confirm('Are you sure you want to verify this pharmacy? It will immediately go live.')) return;
    
    setActionLoadingId(id);
    try {
      const res = await verifyPharmacy(id);
      if (res.success) {
        setPharmacies(prev => prev.map(p => p.id === id ? { ...p, isVerified: true } : p));
        router.refresh();
      } else {
        alert(res.error || 'Failed to verify pharmacy');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleSuspend = async (id: string, currentState: boolean) => {
    const actionLabel = currentState ? 'unsuspend' : 'suspend';
    if (!confirm(`Are you sure you want to ${actionLabel} this pharmacy?`)) return;

    setActionLoadingId(id);
    try {
      const res = await toggleSuspendPharmacy(id, !currentState);
      if (res.success) {
        setPharmacies(prev => prev.map(p => p.id === id ? { ...p, isSuspended: !currentState } : p));
        router.refresh();
      } else {
        alert(res.error || 'Failed to alter suspension status');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter listings
  const filteredPharmacies = pharmacies.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.address.toLowerCase().includes(search.toLowerCase()) ||
                          p.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
                          p.owner.name.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'pending') {
      return matchesSearch && !p.isVerified;
    }
    if (statusFilter === 'verified') {
      return matchesSearch && p.isVerified && !p.isSuspended;
    }
    if (statusFilter === 'suspended') {
      return matchesSearch && p.isSuspended;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      
      {/* Admin Title Card */}
      <section className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
            <ShieldIcon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">സൂപ്പർ അഡ്മിൻ ഡാഷ്‌ബോർഡ്</h1>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Superadmin Control Center for Marunnundo.in
            </p>
          </div>
        </div>
      </section>

      {/* METRIC BADGES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ആകെ ഉപയോക്താക്കൾ</span>
            <span className="text-3xl font-black text-slate-800 leading-none">{stats.totalUsers + stats.totalOwners}</span>
            <span className="text-[10px] font-bold text-slate-500">{stats.totalUsers} Patients | {stats.totalOwners} Owners</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Shops */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-emerald-700">സജീവ ഫാർമസികൾ</span>
            <span className="text-3xl font-black text-emerald-700 leading-none">{stats.verifiedPharmacies}</span>
            <span className="text-[10px] font-bold text-slate-500">Verified Active Shops</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        {/* Pending approvals */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-amber-600">അംഗീകാരം കാക്കുന്നവ</span>
            <span className="text-3xl font-black text-amber-600 leading-none">{stats.pendingPharmacies}</span>
            <span className="text-[10px] font-bold text-slate-500">Awaiting DHS Verifications</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Total Medicines */}
        <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ആകെ മരുന്നുകൾ</span>
            <span className="text-3xl font-black text-slate-800 leading-none">{stats.totalMedicines}</span>
            <span className="text-[10px] font-bold text-slate-500">Registered inventory items</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* FILTER & CONTROLS PANE */}
      <section className="glass-card rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="കടയുടെ പേര്, വിലാസം, ലൈസൻസ് നമ്പർ അല്ലെങ്കിൽ ഉടമയുടെ പേര് തിരയൂ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-800 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
        </div>

        {/* Status filters */}
        <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white text-xs font-bold self-start md:self-center">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2.5 transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({stats.totalPharmacies})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2.5 transition-all cursor-pointer ${
              statusFilter === 'pending' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending ({stats.pendingPharmacies})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-4 py-2.5 transition-all cursor-pointer ${
              statusFilter === 'verified' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Verified ({stats.verifiedPharmacies})
          </button>
          <button
            onClick={() => setStatusFilter('suspended')}
            className={`px-4 py-2.5 transition-all cursor-pointer ${
              statusFilter === 'suspended' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Suspended ({stats.suspendedPharmacies})
          </button>
        </div>
      </section>

      {/* SHOP ADMIN MATRIX LISTING */}
      <section className="flex flex-col gap-5">
        {filteredPharmacies.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 font-bold italic shadow-sm">
            തിരഞ്ഞെടുത്ത വിഭാഗത്തിൽ ഷോപ്പുകൾ ഒന്നും കാണാനില്ല (No matching pharmacies found)
          </div>
        ) : (
          filteredPharmacies.map(pharmacy => {
            const isLoading = actionLoadingId === pharmacy.id;
            
            return (
              <div 
                key={pharmacy.id}
                className={`glass-card rounded-2xl p-5 sm:p-6 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white ${
                  pharmacy.isSuspended 
                    ? 'border-red-200 bg-red-50/10' 
                    : !pharmacy.isVerified 
                    ? 'border-amber-200 bg-amber-50/10' 
                    : 'border-slate-200'
                }`}
              >
                {/* 1. Shop Info */}
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-extrabold text-slate-800 text-lg">{pharmacy.name}</h3>
                    
                    {/* Status Pill */}
                    {pharmacy.isSuspended ? (
                      <span className="bg-red-100 text-red-700 text-[9px] font-black px-2 py-0.5 rounded-full">
                        SUSPENDED
                      </span>
                    ) : pharmacy.isVerified ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                        VERIFIED ACTIVE
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                        AWAITING APPROVAL
                      </span>
                    )}
                  </div>

                  <p className="text-slate-500 text-xs font-semibold flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span>{pharmacy.address}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mt-1 border-t border-slate-100/50 pt-2">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      License: {pharmacy.licenseNumber}
                    </span>
                    <span>•</span>
                    <span>Medicines: {pharmacy._count.medicines}</span>
                    <span>•</span>
                    <span>Reviews: {pharmacy._count.reviews}</span>
                  </div>
                </div>

                {/* 2. Merchant Owner Profile Details (Pre-Verification check) */}
                <div className="flex-1 flex flex-col gap-2 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100 max-w-sm">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ഉടമയുടെ വിവരങ്ങൾ (Owner Credentials)
                  </span>
                  
                  <div className="flex flex-col gap-1.5 text-xs font-bold text-slate-700">
                    <span className="text-slate-800">{pharmacy.owner.name}</span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {pharmacy.owner.email}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {pharmacy.owner.phone}
                    </span>
                  </div>
                </div>

                {/* 3. Administrative Action CTAs */}
                <div className="flex flex-wrap lg:flex-col justify-start lg:justify-center gap-2.5 min-w-[150px]">
                  
                  {/* Verification click */}
                  {!pharmacy.isVerified && (
                    <button
                      onClick={() => handleVerify(pharmacy.id)}
                      disabled={isLoading}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isLoading ? 'Verifying...' : 'അംഗീകരിക്കുക (Verify Shop)'}</span>
                    </button>
                  )}

                  {/* Suspension toggle click */}
                  {pharmacy.isVerified && (
                    <button
                      onClick={() => handleToggleSuspend(pharmacy.id, pharmacy.isSuspended)}
                      disabled={isLoading}
                      className={`flex-1 lg:flex-none flex items-center justify-center gap-1.5 font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer ${
                        pharmacy.isSuspended 
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                          : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                      }`}
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>
                        {isLoading 
                          ? 'Processing...' 
                          : pharmacy.isSuspended 
                          ? 'അനുമതി നൽകാം (Restore Shop)' 
                          : 'സസ്‌പെൻഡ് ചെയ്യുക (Suspend Shop)'}
                      </span>
                    </button>
                  )}

                  {/* View Live */}
                  {pharmacy.isVerified && !pharmacy.isSuspended && (
                    <a
                      href={`/pharmacy/${pharmacy.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 lg:flex-none flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all shadow-md active:scale-95 text-center"
                    >
                      <Eye className="w-4 h-4" />
                      <span>ഷോപ്പ് കാണാം (View Shop)</span>
                    </a>
                  )}

                </div>

              </div>
            );
          })
        )}
      </section>

    </div>
  );
}
