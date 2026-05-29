'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getNearbyPharmacies, searchPharmacies } from '@/app/actions/public';
import MapLoader from '@/components/MapLoader';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Truck, 
  AlertCircle, 
  Star, 
  HeartPulse, 
  Phone,
  Layers,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface PharmacyItem {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  deliveryAvailable: boolean;
  emergencySupport: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  logo: string | null;
  banner: string | null;
  distance: number | null;
  _count: {
    medicines: number;
    reviews: number;
  };
  medicines?: {
    name: string;
    genericName: string;
    isAvailable: boolean;
  }[];
}

const DISTRICT_PRESETS = [
  { name: 'Kochi (Ernakulam)', lat: 9.9723, lng: 76.2801, label: 'കൊച്ചി' },
  { name: 'Trivandrum', lat: 8.5061, lng: 76.9515, label: 'തിരുവനന്തപുരം' },
  { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, label: 'കോഴിക്കോട്' },
  { name: 'Thrissur', lat: 10.5276, lng: 76.2144, label: 'തൃശ്ശൂർ' }
];

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'shop' | 'medicine'>('all');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState<PharmacyItem[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'success' | 'failed'>('idle');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('All Kerala');

  // Fetch pharmacies based on coordinates and search filters
  const fetchPharmacies = useCallback(async () => {
    setIsLoading(true);
    try {
      let data: any[] = [];
      if (query.trim()) {
        data = await searchPharmacies(query, lat, lng, searchType);
      } else {
        data = await getNearbyPharmacies(lat, lng, 30); // 30KM radius
      }
      setPharmacies(data);
    } catch (error) {
      console.error('Failed to load pharmacies:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, lat, lng, searchType]);

  // Load initially or when coords change
  useEffect(() => {
    fetchPharmacies();
  }, [fetchPharmacies]);

  // Handle browser geolocation
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('failed');
      alert('Browser geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setLocationStatus('success');
        setSelectedDistrictName('Your Current Location');
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('failed');
        alert('Could not detect location. Please select a city below or type a query.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Warp to a quick district preset
  const handleWarpDistrict = (preset: typeof DISTRICT_PRESETS[0]) => {
    setLat(preset.lat);
    setLng(preset.lng);
    setSelectedDistrictName(preset.name);
    setLocationStatus('success');
  };

  // Check if store is open based on simple static hour check
  const isStoreOpen = (emergency: boolean) => {
    if (emergency) return true; // 24/7 or emergency support always shows open
    const hour = new Date().getHours();
    return hour >= 8 && hour < 22; // 8 AM to 10 PM
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-6">
      {/* Search Engine Optimization JSON-LD Local Business & Site Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Marunnundo.in',
            'alternateName': 'മരുന്നുണ്ടോ.in',
            'url': 'https://marunnundo.in',
            'description': 'കേരളത്തിലെ സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ, അവയിലെ മരുന്ന് ലഭ്യത, ലൈവ് നാവിഗേഷൻ റൂട്ടുകൾ എന്നിവ തൽസമയം പരിശോധിക്കുക.',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://marunnundo.in/?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
      
      {/* 1. HERO & SEARCH HEAD-UP DISPLAY */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border border-emerald-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-100/40 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 self-center md:self-start shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>കേരളത്തിൽ ഉടനീളം ലഭ്യമാണ് (Live in Kerala)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            മരുന്നുണ്ടോ<span className="text-emerald-600">?</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl font-medium">
            സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ കണ്ടെത്തുക, മരുന്ന് ലഭ്യത പരിശോധിക്കുക, ഭൂപടത്തിലൂടെ കൃത്യമായി നാവിഗേറ്റ് ചെയ്യുക.
          </p>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Find nearby pharmacies • Verify stock availability • Live routes
          </div>
        </div>

        {/* Quick Location Detection Button */}
        <div className="flex flex-col gap-3 w-full md:w-auto min-w-[240px]">
          <button
            onClick={detectLocation}
            className={`w-full flex items-center justify-center gap-2 font-bold px-6 py-4 rounded-2xl transition-all shadow-lg active:scale-98 cursor-pointer ${
              locationStatus === 'detecting'
                ? 'bg-blue-100 text-blue-700 border border-blue-200 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <Navigation className={`w-5 h-5 ${locationStatus === 'detecting' ? 'animate-spin' : ''}`} />
            <span>
              {locationStatus === 'detecting'
                ? 'ലൊക്കേഷൻ കണ്ടെത്തുന്നു...'
                : 'സമീപത്തെ ഷോപ്പുകൾ കാണാം (Detect Location)'}
            </span>
          </button>

          {/* Quick city selection dropdown/tabs */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
              പ്രധാന നഗരങ്ങൾ (Quick Cities)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {DISTRICT_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleWarpDistrict(preset)}
                  className={`text-xs font-bold px-3 py-2 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedDistrictName === preset.name
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. DUAL-PANE VIEW CONTROLS & MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: LISTINGS & SEARCH FILTERS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Search Card Container */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md">
            <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <HeartPulse className="w-5 h-5 text-emerald-600" />
              മരുന്ന് തിരയൂ / ഷോപ്പ് തിരയൂ (Search Platform)
            </h3>
            
            {/* Search Type Filter Tabs */}
            <div className="flex border-b border-slate-100 mb-4 pb-1 gap-1">
              <button
                onClick={() => setSearchType('all')}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  searchType === 'all'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                എല്ലാം (Search All)
              </button>
              <button
                onClick={() => setSearchType('shop')}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  searchType === 'shop'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                മെഡിക്കൽ ഷോപ്പുകൾ (Pharmacies Only)
              </button>
              <button
                onClick={() => setSearchType('medicine')}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  searchType === 'medicine'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                മരുന്നുകൾ (Medicines Only)
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="മരുന്നിന്റെ പേര്, ബ്രാൻഡ് അല്ലെങ്കിൽ ഷോപ്പ് ടൈപ്പ് ചെയ്യുക..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm placeholder:text-slate-400 bg-white"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
              </div>
              <button
                onClick={fetchPharmacies}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer"
              >
                തിരയൂ (Search)
              </button>
            </div>
          </div>

          {/* Listings Pane */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                സമീപത്തെ മെഡിക്കൽ ഷോപ്പുകൾ
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {pharmacies.length} Available
                </span>
              </h2>
              {lat && lng && (
                <span className="text-xs text-slate-500 font-medium">
                  Showing distance from center
                </span>
              )}
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="glass-card rounded-2xl p-4 border border-slate-100 flex gap-4 h-36">
                    <div className="w-24 h-full rounded-xl shimmer"></div>
                    <div className="flex-1 flex flex-col gap-3 py-1">
                      <div className="w-1/2 h-5 rounded shimmer"></div>
                      <div className="w-3/4 h-3 rounded shimmer"></div>
                      <div className="w-1/3 h-4 rounded shimmer"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : pharmacies.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center gap-3">
                <AlertCircle className="w-12 h-12 text-slate-400" />
                <h4 className="font-bold text-slate-800">മെഡിക്കൽ ഷോപ്പുകൾ ഒന്നും കണ്ടെത്തിയില്ല</h4>
                <p className="text-slate-500 text-sm max-w-sm">
                  We could not find any pharmacies matching your query or location within the search radius. Try resetting filters or changing coordinates.
                </p>
                <button
                  onClick={() => { setQuery(''); setLat(undefined); setLng(undefined); setSelectedDistrictName('All Kerala'); }}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 cursor-pointer"
                >
                  തിരച്ചിൽ റീസെറ്റ് ചെയ്യുക (Reset)
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {pharmacies.map((pharmacy) => {
                  const isOpen = isStoreOpen(pharmacy.emergencySupport);
                  const isSelected = selectedPharmacyId === pharmacy.id;
                  
                  return (
                    <div
                      key={pharmacy.id}
                      className={`glass-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col sm:flex-row gap-4 p-4 ${
                        isSelected 
                          ? 'border-emerald-500 ring-2 ring-emerald-500/10 shadow-lg shadow-emerald-500/5' 
                          : 'border-slate-200/80 hover:border-emerald-300'
                      }`}
                      onClick={() => setSelectedPharmacyId(pharmacy.id)}
                    >
                      {/* Image/Logo container */}
                      <div className="w-full sm:w-28 h-28 relative rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pharmacy.logo || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=60'}
                          alt={pharmacy.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Open/Closed Badge overlay */}
                        <span className={`absolute top-2 left-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 ${
                          isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          <Clock className="w-2.5 h-2.5" />
                          {isOpen ? 'OPEN' : 'CLOSED'}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-extrabold text-slate-800 text-lg hover:text-emerald-700 transition-colors">
                              <Link href={`/pharmacy/${pharmacy.id}`}>{pharmacy.name}</Link>
                            </h3>
                            {pharmacy.distance !== null && (
                              <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" />
                                {pharmacy.distance} KM
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-xs line-clamp-1 font-medium">{pharmacy.address}</p>
                          
                          {/* Ratings and Details */}
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600 font-medium">
                            <span className="flex items-center gap-0.5 font-bold text-amber-600">
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              {pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : 'New'} ({pharmacy._count.reviews} reviews)
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">Inventory: {pharmacy._count.medicines} types</span>
                          </div>
                        </div>

                        {/* Badges and Navigation CTA */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 sm:mt-0">
                          <div className="flex items-center gap-2">
                            {pharmacy.deliveryAvailable && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                Delivery
                              </span>
                            )}
                            {pharmacy.emergencySupport && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                24/7 Support
                              </span>
                            )}
                          </div>
                          
                          <Link
                            href={`/pharmacy/${pharmacy.id}`}
                            className="text-xs font-bold bg-slate-900 text-white hover:bg-emerald-600 px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1 hover:gap-1.5 active:scale-98"
                          >
                            <span>വഴി കാണിക്കുക (Route)</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY MAP COMPONENT (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 h-[400px] lg:h-[600px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg relative bg-white flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-20">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              മാപ്പ് കാഴ്ച (Interactive Live Map)
            </span>
            {lat && lng && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active Coordinate Pin
              </span>
            )}
          </div>
          <div className="flex-1 w-full h-full relative">
            <MapLoader
              mode="view"
              pharmacies={pharmacies}
              selectedPharmacyId={selectedPharmacyId}
              onSelectPharmacy={(id) => setSelectedPharmacyId(id)}
              userLat={lat}
              userLng={lng}
              centerLat={lat || 9.9723}
              centerLng={lng || 76.2801}
              zoom={lat && lng ? 14 : 11}
            />
          </div>
        </div>

      </div>

      {/* 3. SEO INFORMATIONAL FOOTER BLOCK FOR PHONETIC SEARCH & TYPOS */}
      <section className="mt-8 border-t border-slate-100 pt-8 pb-4">
        <div className="glass-card rounded-2xl p-6 border border-slate-100 bg-slate-50/50 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            മരുന്നുണ്ടോ.in - Kerala Pharmacy & Medicine Search Directory
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            നിങ്ങളുടെ പ്രദേശത്തെ മെഡിക്കൽ സ്റ്റോറുകളിൽ മരുന്നുകൾ ലഭ്യമാണോ എന്ന് തൽസമയം പരിശോധിക്കാൻ സഹായിക്കുന്ന ഒരു ഓൺലൈൻ പ്ലാറ്റ്‌ഫോമാണ് <strong>മരുന്നുണ്ടോ (Marunnundo)</strong>. 
            പലരും ഗൂഗിളിൽ <strong>marunnundo.in</strong>, <strong>marunn undo</strong>, <strong>marun indo</strong>, <strong>marun</strong>, അല്ലെങ്കിൽ <strong>marunundo</strong> എന്ന് ടൈപ്പ് ചെയ്തും ഞങ്ങളുടെ വെബ്സൈറ്റിൽ എത്താറുണ്ട്. 
            കേരളത്തിലെ ഏത് ഭാഗത്തുമുള്ള ഫാർമസികൾ കണ്ടെത്താനും അവയുമായി ബന്ധപ്പെടാനും ഈ സംവിധാനം ഉപയോഗിക്കാം.
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            Frequently searched queries: Marunnundo app, marunn undo kochi, marun indo medicine search, marun shop near me, മരുന്നുണ്ടോ മെഡിക്കൽ ഷോപ്പുകൾ.
          </p>
        </div>
      </section>

    </div>
  );
}
