'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MapLoader from '@/components/MapLoader';
import { submitReview } from '@/app/actions/public';
import { JWTPayload } from '@/lib/jwt';
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
  ThumbsUp,
  Share2,
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

  // Check if open now based on today's operating hours
  const [isOpenNow, setIsOpenNow] = useState(false);

  useEffect(() => {
    if (pharmacy.emergencySupport) {
      setIsOpenNow(true);
      return;
    }
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const todayName = days[new Date().getDay()];
    const todayHours = pharmacy.operatingHours.find(h => h.day === todayName);
    
    if (!todayHours || todayHours.isClosed) {
      setIsOpenNow(false);
      return;
    }

    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const parseMins = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    const openMins = parseMins(todayHours.openTime);
    const closeMins = parseMins(todayHours.closeTime);

    setIsOpenNow(currentMins >= openMins && currentMins <= closeMins);
  }, [pharmacy]);

  // Request browser geolocation to draw route
  const requestRouteNavigation = () => {
    if (!navigator.geolocation) {
      alert('Browser geolocation is not supported.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        alert('Could not resolve your coordinates. Please enable browser location permissions.');
      },
      { enableHighAccuracy: true }
    );
  };

  // Submit Review Handler
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setReviewError('Please login to write reviews');
      return;
    }

    setReviewError('');
    setReviewSuccess(false);
    setIsSubmittingReview(true);

    try {
      const res = await submitReview(pharmacy.id, rating, comment);
      if (res.success) {
        setReviewSuccess(true);
        setComment('');
        setRating(5);
        router.refresh();
      } else {
        setReviewError(res.error || 'Failed to submit review');
      }
    } catch (err: any) {
      setReviewError(err.message || 'Something went wrong');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Filter medicines
  const filteredMedicines = pharmacy.medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(medQuery.toLowerCase()) || 
                          m.genericName.toLowerCase().includes(medQuery.toLowerCase()) ||
                          m.category.toLowerCase().includes(medQuery.toLowerCase());
    
    if (prescriptionFilter === 'required') {
      return matchesSearch && m.prescriptionRequired;
    }
    if (prescriptionFilter === 'otc') {
      return matchesSearch && !m.prescriptionRequired;
    }
    return matchesSearch;
  });

  // Construct direct Whatsapp Link
  const whatsappLink = pharmacy.whatsappNumber 
    ? `https://wa.me/91${pharmacy.whatsappNumber}?text=Hi%20${encodeURIComponent(pharmacy.name)},%20I%20saw%20your%20shop%20on%20Marunnundo.in%20and%20wanted%20to%20check%20availability%20for:`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      {/* 1. BACK NAVIGATION */}
      <Link 
        href="/" 
        className="flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 font-extrabold text-sm self-start group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>ഷോപ്പുകളുടെ ലിസ്റ്റിലേക്ക് മടങ്ങുക (Back to Discovery)</span>
      </Link>

      {/* 2. PROFILE BILLBOARD / BANNER CONTAINER */}
      <section className="glass-card rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl relative">
        <div className="h-44 sm:h-64 w-full relative bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={pharmacy.banner || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&auto=format&fit=crop&q=80'}
            alt="Pharmacy Banner"
            className="w-full h-full object-cover"
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
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED
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
                {pharmacy.rating > 0 ? pharmacy.rating.toFixed(1) : 'New'} ({pharmacy.reviews.length} reviews)
              </span>
              <span className="hidden sm:inline text-slate-400">•</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                isOpenNow ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {isOpenNow ? 'തുറന്നിരിക്കുന്നു (Open Now)' : 'അടച്ചിരിക്കുന്നു (Closed Now)'}
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
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" />
              ഷോപ്പുമായി ബന്ധപ്പെടാം (Contact Pharmacy)
            </h3>
            
            <a 
              href={`tel:${pharmacy.contactNumber}`}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm"
            >
              <Phone className="w-4 h-4" />
              <span>ഫോൺ ചെയ്യുക (Call: {pharmacy.contactNumber})</span>
            </a>

            {whatsappLink ? (
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>വാട്സ്ആപ്പ് ഓർഡർ (WhatsApp Order)</span>
              </a>
            ) : (
              <div className="text-center text-xs text-slate-400 font-semibold py-2">
                WhatsApp ordering is not enabled by owner
              </div>
            )}

            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${pharmacy.latitude},${pharmacy.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>ഗൂഗിൾ മാപ്പ് വഴി കാണിക്കുക (Open Google Maps)</span>
            </a>
          </div>

          {/* Map Navigation Block */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                തത്സമയ റൂട്ട് മാപ്പ് (Route Finder)
              </h3>
              
              <button
                onClick={requestRouteNavigation}
                disabled={isLocating}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 disabled:opacity-50 cursor-pointer"
              >
                {isLocating ? 'Resolving...' : 'വഴി കാണിക്കുക (Find Route)'}
              </button>
            </div>

            {/* OSRM details banner */}
            {routeDist !== null && routeDuration !== null && (
              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200">
                <span>🚙 ദൂരം (Distance): {routeDist} KM</span>
                <span>⏱️ യാത്രാ സമയം: {routeDuration} mins</span>
              </div>
            )}

            {/* Map Frame */}
            <div className="h-[250px] rounded-xl overflow-hidden relative bg-slate-100">
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
              *ലൊക്കേഷൻ അനുവദിച്ച ശേഷം ഭൂപടത്തിൽ നിങ്ങളുടെ സ്ഥാനത്തുനിന്നുള്ള യാത്രാ മാർഗ്ഗം തത്സമയം കാണാം.
            </p>
          </div>

          {/* Operating Hours Block */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md flex flex-col gap-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-600" />
              പ്രവർത്തന സമയം (Operating Hours)
            </h3>
            
            <div className="flex flex-col gap-2">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                const dayHours = pharmacy.operatingHours.find(h => h.day === day);
                const isClosed = !dayHours || dayHours.isClosed;
                
                return (
                  <div key={day} className="flex justify-between items-center text-xs font-semibold py-1 border-b border-slate-50 last:border-0">
                    <span className="text-slate-600">{day}</span>
                    {isClosed ? (
                      <span className="text-red-500 font-extrabold">Closed</span>
                    ) : (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
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
                ലഭ്യമായ മരുന്നുകൾ (Medicine Inventory)
                <span className="text-xs font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {filteredMedicines.length} Listed
                </span>
              </h2>

              {/* Delivery info */}
              {pharmacy.deliveryAvailable && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg flex items-center gap-1 self-start sm:self-center">
                  <Truck className="w-3.5 h-3.5 animate-bounce" />
                  Home Delivery within {pharmacy.deliveryRadius} KM
                </span>
              )}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search text input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="മരുന്നിന്റെ പേര് തിരയൂ (Search Dolo, Paracetamol...)"
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
                  All
                </button>
                <button
                  onClick={() => setPrescriptionFilter('required')}
                  className={`px-3 py-2.5 transition-all cursor-pointer ${
                    prescriptionFilter === 'required' ? 'bg-red-50 text-red-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Rx Required
                </button>
                <button
                  onClick={() => setPrescriptionFilter('otc')}
                  className={`px-3 py-2.5 transition-all cursor-pointer ${
                    prescriptionFilter === 'otc' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  OTC (No Rx)
                </button>
              </div>
            </div>

            {/* Medicines List Grid */}
            {filteredMedicines.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col items-center gap-2">
                <AlertCircle className="w-10 h-10 text-slate-400" />
                <h4 className="font-bold text-slate-700">മരുന്നുകൾ കണ്ടെത്താനായില്ല</h4>
                <p className="text-xs text-slate-500">We could not find any medicine in stock matching your filter.</p>
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
                          {med.isAvailable && med.quantity > 0 ? `IN STOCK (${med.quantity})` : 'OUT OF STOCK'}
                        </span>
                      </div>
                      
                      <p className="text-slate-400 text-xs mt-0.5 font-semibold italic">
                        {med.genericName}
                      </p>
                      
                      <span className="inline-block text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-full mt-2">
                        Category: {med.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                      <span className="font-black text-emerald-800 text-base">
                        ₹ {med.price.toFixed(2)}
                      </span>
                      {med.prescriptionRequired ? (
                        <span className="text-[9px] font-extrabold text-red-700 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
                          Rx Prescription Required
                        </span>
                      ) : (
                        <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
                          OTC Over the Counter
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
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              അഭിപ്രായങ്ങൾ (Patient Reviews)
              <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                {pharmacy.reviews.length} total
              </span>
            </h2>

            {/* Review Input Box */}
            {session ? (
              <form onSubmit={handleReviewSubmit} className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl flex flex-col gap-4">
                <h4 className="font-bold text-slate-800 text-sm">നിങ്ങളുടെ അഭിപ്രായം രേഖപ്പെടുത്താം (Write a Review)</h4>
                
                {/* Stars selector */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 font-bold">റേറ്റിംഗ് (Rating):</span>
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
                  placeholder="ഷോപ്പിലെ സേവനങ്ങളെക്കുറിച്ചുള്ള നിങ്ങളുടെ അഭിപ്രായം ഇവിടെ എഴുതുക..."
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
                    Review submitted successfully!
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-md self-end px-5 active:scale-95 cursor-pointer"
                >
                  {isSubmittingReview ? 'Submitting...' : 'അഭിപ്രായം രേഖപ്പെടുത്താം (Submit Review)'}
                </button>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-xl text-center text-xs text-slate-500 font-bold">
                അഭിപ്രായം രേഖപ്പെടുത്താൻ ദയവായി{' '}
                <Link href="/login" className="text-emerald-700 underline hover:text-emerald-800">
                  ലോഗിൻ ചെയ്യുക (Login)
                </Link>
                .
              </div>
            )}

            {/* Reviews List */}
            {pharmacy.reviews.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 font-semibold italic">
                ഇതുവരെ അഭിപ്രായങ്ങൾ ഒന്നും രേഖപ്പെടുത്തിയിട്ടില്ല. ആദ്യ അഭിപ്രായം രേഖപ്പെടുത്തൂ! (No reviews yet. Be the first!)
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
                          💬 ഫാർമസി ഉടമയുടെ മറുപടി (Owner Reply)
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
