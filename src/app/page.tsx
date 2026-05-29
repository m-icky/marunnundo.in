'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getNearbyPharmacies, searchPharmacies } from '@/app/actions/public';
import MapLoader from '@/components/MapLoader';
import LogoLoader from '@/components/LogoLoader';
import { useLanguage } from '@/context/LanguageContext';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Truck, 
  AlertCircle, 
  Star, 
  HeartPulse, 
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
  { name: 'Kasaragod', lat: 12.5102, lng: 74.9852, label: 'കാസർഗോഡ്' },
  { name: 'Kannur', lat: 11.8745, lng: 75.3704, label: 'കണ്ണൂർ' },
  { name: 'Wayanad', lat: 11.6854, lng: 76.1320, label: 'വയനാട്' },
  { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, label: 'കോഴിക്കോട്' },
  { name: 'Malappuram', lat: 11.0735, lng: 76.0740, label: 'മലപ്പുറം' },
  { name: 'Palakkad', lat: 10.7867, lng: 76.6548, label: 'പാലക്കാട്' },
  { name: 'Thrissur', lat: 10.5276, lng: 76.2144, label: 'തൃശ്ശൂർ' },
  { name: 'Kochi (Ernakulam)', lat: 9.9723, lng: 76.2801, label: 'കൊച്ചി' },
  { name: 'Idukki', lat: 9.9189, lng: 77.1025, label: 'ഇടുക്കി' },
  { name: 'Kottayam', lat: 9.5916, lng: 76.5224, label: 'കോട്ടയം' },
  { name: 'Alappuzha', lat: 9.4981, lng: 76.3388, label: 'ആലപ്പുഴ' },
  { name: 'Pathanamthitta', lat: 9.2648, lng: 76.7870, label: 'പത്തനംതിട്ട' },
  { name: 'Kollam', lat: 8.8932, lng: 76.6141, label: 'കൊല്ലം' },
  { name: 'Trivandrum', lat: 8.5061, lng: 76.9515, label: 'തിരുവനന്തപുരം' }
];

export default function HomePage() {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'shop' | 'medicine'>('all');
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lng, setLng] = useState<number | undefined>(undefined);
  const [userRealLat, setUserRealLat] = useState<number | undefined>(undefined);
  const [userRealLng, setUserRealLng] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState<PharmacyItem[]>([]);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'success' | 'failed'>('idle');
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string | null>(null);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('All Kerala');
  const [recenterTrigger, setRecenterTrigger] = useState(0);

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
    // If location is already detected, immediately trigger recentering for instant map response
    if (userRealLat && userRealLng) {
      setLat(userRealLat);
      setLng(userRealLng);
      setSelectedDistrictName('Your Current Location');
      setRecenterTrigger(prev => prev + 1);
      return;
    }

    if (!navigator.geolocation) {
      setLocationStatus('failed');
      alert('Browser geolocation is not supported by your browser');
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const uLat = position.coords.latitude;
        const uLng = position.coords.longitude;
        setLat(uLat);
        setLng(uLng);
        setUserRealLat(uLat);
        setUserRealLng(uLng);
        setLocationStatus('success');
        setSelectedDistrictName('Your Current Location');
        setRecenterTrigger(prev => prev + 1);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationStatus('failed');
        alert('Could not detect location. Please select a city below or type a query.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
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

  // Translate preset label dynamically
  const getPresetLabel = (presetName: string, defaultLabel: string) => {
    if (language === 'en') {
      if (presetName.includes('Kochi')) return 'Kochi';
      return presetName;
    }
    return defaultLabel;
  };

  // Translate district name for display
  const getDisplayDistrictName = () => {
    if (selectedDistrictName === 'All Kerala') return t('all_kerala');
    if (selectedDistrictName === 'Your Current Location') return t('your_current_location');
    if (language === 'en') {
      return selectedDistrictName;
    } else {
      const preset = DISTRICT_PRESETS.find(p => p.name === selectedDistrictName);
      if (preset) return preset.label;
    }
    return selectedDistrictName;
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
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-2.5 self-center md:self-start mb-1 select-none">
            <div className="w-35 h-35 rounded-xl bg-white shadow-md border border-slate-100 flex items-center justify-center p-1.5">
              <img src="/logo.png" alt="Marunnundo Logo" className="w-full h-full object-contain" style={{scale: "1.5"}} />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 self-center md:self-start shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('live_in_kerala')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {t('hero_title')}
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-xl font-medium">
            {t('hero_subtitle')}
          </p>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
            {t('hero_bullets')}
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
                ? t('detecting_location')
                : t('detect_location')}
            </span>
          </button>

          {/* Quick city selection dropdown/tabs */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center md:text-left">
              {t('quick_cities')}
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
                  {getPresetLabel(preset.name, preset.label)}
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
              {t('search_platform')}
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
                {t('search_all')}
              </button>
              <button
                onClick={() => setSearchType('shop')}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  searchType === 'shop'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('pharmacies_only')}
              </button>
              <button
                onClick={() => setSearchType('medicine')}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all cursor-pointer ${
                  searchType === 'medicine'
                    ? 'bg-emerald-50 text-emerald-800 font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t('medicines_only')}
              </button>
            </div>

            {/* Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
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
                {t('search_btn')}
              </button>
            </div>
          </div>

          {/* Listings Pane */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {t('nearby_pharmacies')}
                <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                  {pharmacies.length} {t('available_badge')}
                </span>
              </h2>
              {lat && lng && (
                <span className="text-xs text-slate-500 font-medium">
                  {t('distance_center')}
                </span>
              )}
            </div>

            {/* Loading Skeleton */}
            {isLoading ? (
              <LogoLoader variant="inline" label={t('detecting_location')} />
            ) : pharmacies.length === 0 ? (
              <div className="glass-card rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center gap-3">
                <AlertCircle className="w-12 h-12 text-slate-400" />
                <h4 className="font-bold text-slate-800">{t('no_pharmacies_found')}</h4>
                <p className="text-slate-500 text-sm max-w-sm">
                  {t('no_pharmacies_desc')}
                </p>
                <button
                  onClick={() => { setQuery(''); setLat(undefined); setLng(undefined); setUserRealLat(undefined); setUserRealLng(undefined); setSelectedDistrictName('All Kerala'); }}
                  className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 cursor-pointer"
                >
                  {t('reset_search')}
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
                          {isOpen ? t('open_now') : t('closed_now')}
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
                              {pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : t('new_badge')} ({pharmacy._count.reviews} {t('reviews_count')})
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">{t('inventory_types')}: {pharmacy._count.medicines}</span>
                          </div>
                        </div>

                        {/* Badges and Navigation CTA */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3 sm:mt-0">
                          <div className="flex items-center gap-2">
                            {pharmacy.deliveryAvailable && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Truck className="w-3 h-3" />
                                {t('delivery_badge')}
                              </span>
                            )}
                            {pharmacy.emergencySupport && (
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {t('emergency_support_badge')}
                              </span>
                            )}
                          </div>
                          
                          <Link
                            href={`/pharmacy/${pharmacy.id}`}
                            className="text-xs font-bold bg-slate-900 text-white hover:bg-emerald-600 px-3.5 py-1.5 rounded-xl shadow-md transition-all flex items-center gap-1 hover:gap-1.5 active:scale-98"
                          >
                            <span>{t('route_cta')}</span>
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

        {/* RIGHT COLUMN: MAP COMPONENT – below listings on mobile, sticky side panel on lg */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 h-[300px] sm:h-[400px] lg:h-[600px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg relative bg-white flex flex-col">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between z-20">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              {t('interactive_live_map')}
            </span>
            {lat && lng && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {t('active_coordinate_pin')}
              </span>
            )}
          </div>
          <div className="flex-1 w-full h-full relative">
            <MapLoader
              mode="view"
              pharmacies={pharmacies}
              selectedPharmacyId={selectedPharmacyId}
              onSelectPharmacy={(id) => setSelectedPharmacyId(id)}
              userLat={userRealLat}
              userLng={userRealLng}
              centerLat={lat || 9.9723}
              centerLng={lng || 76.2801}
              zoom={lat && lng ? 14 : 11}
              recenterTrigger={recenterTrigger}
              highlightSearchArea={lat !== undefined && lng !== undefined}
              selectedDistrictName={selectedDistrictName}
            />
            {/* Floating Locate Me Button Overlay */}
            <button
              onClick={detectLocation}
              disabled={locationStatus === 'detecting'}
              className="absolute bottom-4 right-4 z-[400] bg-white hover:bg-slate-50 text-slate-800 p-3 rounded-full shadow-lg border border-slate-200/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group cursor-pointer disabled:opacity-50"
              title={language === 'ml' ? 'എന്റെ സ്ഥാനം കാണിക്കുക' : 'Show my current location'}
            >
              <Navigation 
                className={`w-5 h-5 text-emerald-600 transition-transform ${
                  locationStatus === 'detecting' ? 'animate-spin' : 'group-hover:rotate-45'
                }`} 
              />
            </button>
          </div>
        </div>

      </div>

      {/* 3. SEO INFORMATIONAL FOOTER BLOCK FOR PHONETIC SEARCH & TYPOS */}
      <section className="mt-8 border-t border-slate-100 pt-8 pb-4">
        <div className="glass-card rounded-2xl p-6 border border-slate-100 bg-slate-50/50 shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            {t('seo_title')}
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            {t('seo_desc')}
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">
            {t('seo_queries')}
          </p>
        </div>
      </section>

    </div>
  );
}
