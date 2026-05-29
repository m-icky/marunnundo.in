'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MapLoader from '@/components/MapLoader';
import { submitReview } from '@/app/actions/public';
import { JWTPayload } from '@/lib/jwt';
import { useLanguage } from '@/context/LanguageContext';
import { 
  MapPin, 
  Phone, 
  MessageSquare, 
  Star, 
  Truck, 
  AlertCircle, 
  ArrowLeft, 
  Search, 
  Info,
  Calendar,
  Clock,
  User,
  Navigation,
  CheckCircle2
} from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string | null;
  quantity: number;
  price: number;
  prescriptionRequired: boolean;
  isAvailable: boolean;
}

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  reply: string | null;
  createdAt: Date;
  user: {
    name: string;
  };
}

interface OperatingHours {
  id: string;
  day: string;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  contactNumber: string;
  whatsappNumber: string | null;
  deliveryAvailable: boolean;
  deliveryRadius: number;
  emergencySupport: boolean;
  latitude: number;
  longitude: number;
  rating: number;
  logo: string | null;
  banner: string | null;
  isVerified: boolean;
  isSuspended: boolean;
  medicines: Medicine[];
  reviews: Review[];
  operatingHours: OperatingHours[];
}

interface Props {
  pharmacy: Pharmacy;
  session: JWTPayload | null;
}

export default function PharmacyDetailsClient({ pharmacy, session }: Props) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [userLat, setUserLat] = useState<number | undefined>(undefined);
  const [userLng, setUserLng] = useState<number | undefined>(undefined);
  const [isLocating, setIsLocating] = useState(false);
  const [routeDist, setRouteDist] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);

  // Inventory filtering state
  const [medQuery, setMedQuery] = useState('');
  const [prescriptionFilter, setPrescriptionFilter] = useState<'all' | 'required' | 'otc'>('all');

  // Review submission state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Check if store is open based on simple static hour check
  const checkIsOpenNow = () => {
    if (pharmacy.emergencySupport) return true; // 24/7 or emergency support always shows open
    
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[now.getDay()];
    const operatingDay = pharmacy.operatingHours.find(h => h.day === currentDay);
    
    if (!operatingDay || operatingDay.isClosed) return false;

    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeVal = currentHour * 60 + currentMin;

    // Parse operating times e.g. "08:00" or similar
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const openTimeVal = parseTime(operatingDay.openTime);
    const closeTimeVal = parseTime(operatingDay.closeTime);

    return currentTimeVal >= openTimeVal && currentTimeVal <= closeTimeVal;
  };

  const isOpenNow = checkIsOpenNow();

  // Web API navigator geolocation for live routing path
  const requestRouteNavigation = () => {
    if (!navigator.geolocation) {
      alert('Your browser does not support geolocation.');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setIsLocating(false);
      },
      (error) => {
        console.error('Routing location access denied:', error);
        alert('Could not retrieve your location. Please grant map access.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // WhatsApp click-to-chat generator
  const getWhatsAppMessageLink = () => {
    if (!pharmacy.whatsappNumber) return null;
    const cleanNum = pharmacy.whatsappNumber.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanNum.length === 10 ? `91${cleanNum}` : cleanNum;
    
    const greetingText = encodeURIComponent(
      `Hello ${pharmacy.name}, I found your store on Marunnundo.in and want to enquire about medicine stock.`
    );
    return `https://wa.me/${phoneWithCountry}?text=${greetingText}`;
  };

  const whatsappLink = getWhatsAppMessageLink();

  // Search filter implementation
  const filteredMedicines = pharmacy.medicines.filter(med => {
    const matchesQuery = 
      med.name.toLowerCase().includes(medQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(medQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(medQuery.toLowerCase());
    
    const matchesRx = 
      prescriptionFilter === 'all' ||
      (prescriptionFilter === 'required' && med.prescriptionRequired) ||
      (prescriptionFilter === 'otc' && !med.prescriptionRequired);

    return matchesQuery && matchesRx;
  });

  // Handle Review Creation
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setReviewError('Please enter a comment.');
      return;
    }

    setReviewError('');
    setReviewSuccess(false);
    setIsSubmittingReview(true);

    try {
      const response = await submitReview(
        pharmacy.id,
        rating,
        comment.trim()
      );

      if (response.success) {
        setReviewSuccess(true);
        setComment('');
        setRating(5);
        // Refresh page router for fresh DB fetch
        router.refresh();
      } else {
        setReviewError(response.error || 'Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
      setReviewError('An unexpected error occurred.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // SEO Schema details
  const pharmacySchema = {
    '@context': 'https://schema.org',
    '@type': 'Pharmacy',
    '@id': `https://marunnundo.in/pharmacy/${pharmacy.id}`,
    'name': pharmacy.name,
    'image': pharmacy.logo || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=60',
    'telephone': pharmacy.contactNumber,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': pharmacy.address,
      'addressLocality': 'Kerala',
      'addressRegion': 'KL',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': pharmacy.latitude,
      'longitude': pharmacy.longitude
    },
    'url': `https://marunnundo.in/pharmacy/${pharmacy.id}`,
    'priceRange': '₹₹'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* Search Engine Optimization Local Business (Pharmacy) Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pharmacySchema) }}
      />
      {/* 1. BACK NAVIGATION */}
      <Link 
        href="/" 
        className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-extrabold text-sm self-start group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>{t('back_to_discovery')}</span>
      </Link>

      {/* 2. PROFILE BILLBOARD / BANNER CONTAINER */}
      <section className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl relative">
        <div className="h-44 sm:h-64 w-full relative bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={pharmacy.banner || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=80'}
            alt="Pharmacy Banner"
            className="w-full. h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
        </div>

        {/* Profile Card Header overlay */}
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-16 sm:-mt-20 relative z-10">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white p-1 border-2 border-white shadow-xl flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={pharmacy.logo || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=150&auto=format&fit=crop&q=60'}
              alt="Pharmacy Logo"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-black text-slate-800 sm:text-white drop-shadow-sm">
                {pharmacy.name}
              </h1>
              {pharmacy.isVerified && (
                <span className="bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md shadow-emerald-500/10">
                  <CheckCircle2 className="w-3 h-3" /> {t('verified_badge')}
                </span>
              )}
            </div>

            <p className="text-slate-500 sm:text-slate-200 text-sm font-medium flex items-start gap-1 max-w-2xl">
              <MapPin className="w-4 h-4 text-emerald-500 sm:text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{pharmacy.address}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-slate-600 sm:text-slate-200">
              <span className="flex items-center gap-0.5 text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                {pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : t('new_badge')} ({pharmacy.reviews.length} {t('reviews_count')})
              </span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                isOpenNow ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {isOpenNow ? t('open_now') : t('closed_now')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DUAL COLUMN INFO PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: NAVIGATION MAP & OPERATING STATS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Action CTAs */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md flex flex-col gap-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-1">
              <Info className="w-4 h-4 text-emerald-600" />
              {t('contact_pharmacy')}
            </h3>
            
            <a 
              href={`tel:${pharmacy.contactNumber}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm animate-all"
            >
              <Phone className="w-4 h-4" />
              <span>{t('call_btn')}</span>
            </a>

            {whatsappLink ? (
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm animate-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('whatsapp_order')}</span>
              </a>
            ) : (
              <div className="text-center text-xs text-slate-400 font-semibold py-2 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                {t('whatsapp_disabled')}
              </div>
            )}

            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm animate-all"
            >
              <Navigation className="w-4 h-4" />
              <span>{t('open_google_maps')}</span>
            </a>
          </div>

          {/* Map Navigation Block */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                {t('route_finder')}
              </h3>
              
              <button
                onClick={requestRouteNavigation}
                disabled={isLocating}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 disabled:opacity-50 cursor-pointer"
              >
                {isLocating ? t('route_resolving') : t('find_route_btn')}
              </button>
            </div>

            {/* OSRM details banner */}
            {routeDist !== null && routeDuration !== null && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
                <span>🚙 {t('distance_label')}: {routeDist} KM</span>
                <span>⏱️ {t('travel_time_label')}: {routeDuration} {t('mins_label')}</span>
              </div>
            )}

            {/* Map Frame */}
            <div className="h-[250px] rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200">
              <MapLoader
                mode="route"
                userLat={userLat}
                userLng={userLng}
                pharmacyLat={pharmacy.latitude}
                pharmacyLng={pharmacy.longitude}
                centerLat={pharmacy.latitude}
                centerLng={pharmacy.longitude}
                zoom={14}
                onRouteCalculated={(dist, dur) => {
                  setRouteDist(dist);
                  setRouteDuration(dur);
                }}
              />
            </div>
            
            <p className="text-[11px] text-slate-500 leading-relaxed text-center font-medium">
              *{t('map_notice')}
            </p>
          </div>

          {/* Operating Hours Block */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {t('operating_hours')}
            </h3>
            
            <div className="flex flex-col gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                const dayHours = pharmacy.operatingHours.find(h => h.day === day);
                const isClosed = !dayHours || dayHours.isClosed;
                
                return (
                  <div key={day} className="flex justify-between items-center text-xs font-semibold py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600">{day}</span>
                    {isClosed ? (
                      <span className="text-red-500 font-extrabold">{t('closed_label')}</span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                        {dayHours.openTime} AM - {dayHours.closeTime} PM
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCHABLE INVENTORY & REVIEWS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          {/* INVENTORY CARD */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 shadow-md flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {t('medicine_inventory')}
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {filteredMedicines.length} {t('listed_label')}
                </span>
              </h2>

              {/* Delivery info */}
              {pharmacy.deliveryAvailable && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 self-start sm:self-center">
                  <Truck className="w-3.5 h-3.5 animate-bounce" />
                  {t('delivery_badge')} ({pharmacy.deliveryRadius} KM)
                </span>
              )}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search text input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t('search_medicine_placeholder')}
                  value={medQuery}
                  onChange={(e) => setMedQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm placeholder:text-slate-400 bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>

              {/* Prescription select */}
              <div className="flex border border-slate-200 rounded-xl overflow-hidden bg-white text-xs font-bold">
                <button
                  onClick={() => setPrescriptionFilter('all')}
                  className={`px-3 py-2.5 transition-all cursor-pointer ${
                    prescriptionFilter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t('all_filter')}
                </button>
                <button
                  onClick={() => setPrescriptionFilter('required')}
                  className={`px-3 py-2.5 transition-all cursor-pointer ${
                    prescriptionFilter === 'required' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t('rx_required_filter')}
                </button>
                <button
                  onClick={() => setPrescriptionFilter('otc')}
                  className={`px-3 py-2.5 transition-all cursor-pointer ${
                    prescriptionFilter === 'otc' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t('otc_filter')}
                </button>
              </div>
            </div>

            {/* Medicines List Grid */}
            {filteredMedicines.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-2">
                <AlertCircle className="w-10 h-10 text-slate-400" />
                <h4 className="font-bold text-slate-700">{t('no_medicine_found')}</h4>
                <p className="text-xs text-slate-500">{t('no_medicine_desc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredMedicines.map(med => (
                  <div key={med.id} className="p-4 border border-slate-200/80 rounded-xl bg-white/70 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-extrabold text-slate-800 text-base leading-tight">
                          {med.name}
                        </h4>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
                          med.isAvailable && med.quantity > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {med.isAvailable && med.quantity > 0 ? `${t('in_stock_badge')} (${med.quantity})` : t('out_of_stock_badge')}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-xs mt-0.5 font-semibold italic">
                        {med.genericName}
                      </p>
                      
                      <span className="inline-block text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full mt-2">
                        {t('category_label')}: {med.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                      <span className="font-black text-emerald-800 text-base">
                        ₹ {med.price.toFixed(2)}
                      </span>
                      {med.prescriptionRequired ? (
                        <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                          {t('rx_required_label')}
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                          {t('otc_label')}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* REVIEWS CARD */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200/80 shadow-md flex flex-col gap-6">
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
              {t('patient_reviews')}
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {pharmacy.reviews.length} {t('total_label')}
              </span>
            </h2>

            {/* Review Input Box */}
            {session ? (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col gap-4">
                <h4 className="font-bold text-slate-800 text-sm">{t('write_review')}</h4>
                
                {/* Stars selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-bold">{t('rating_label')}:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-amber-500 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                      >
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <textarea
                  placeholder={t('comment_placeholder')}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white min-h-[80px]"
                  required
                />

                {reviewError && (
                  <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {reviewError}
                  </p>
                )}

                {reviewSuccess && (
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {t('review_success_msg')}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md self-end px-5 active:scale-95 cursor-pointer"
                >
                  {isSubmittingReview ? t('submitting_btn') : t('submit_review_btn')}
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl text-center text-xs text-slate-500 font-bold">
                {t('review_login_notice')}{' '}
                <Link href="/login" className="text-emerald-700 underline hover:text-emerald-800">
                  {t('login')}
                </Link>
                .
              </div>
            )}

            {/* Reviews List */}
            {pharmacy.reviews.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 font-semibold italic">
                {t('no_reviews_yet')}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {pharmacy.reviews.map(review => (
                  <div key={review.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 text-xs font-bold">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-800 text-xs">{review.user.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`} />
                      ))}
                    </div>

                    <p className="text-slate-600 text-sm mt-1 leading-relaxed font-medium">{review.comment}</p>

                    {/* Merchant Reply if exists */}
                    {review.reply && (
                      <div className="mt-3 p-3 bg-emerald-50/70 border border-emerald-100 rounded-lg flex flex-col gap-1 ml-4 animate-in slide-in-from-left-2 duration-150">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                          💬 {t('owner_reply_title')}
                        </span>
                        <p className="text-slate-600 text-xs font-medium leading-relaxed italic">{review.reply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
