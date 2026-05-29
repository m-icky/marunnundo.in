'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser, registerOwner, resolveGoogleMapsUrl } from '@/app/actions/auth';
import MapLoader from '@/components/MapLoader';
import { useLanguage } from '@/context/LanguageContext';
import { 
  HeartPulse, 
  User, 
  Store, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  FileText, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle,
  Navigation,
  Hash
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'user' | 'owner'>('user');
  
  // General details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Owner/Pharmacy details
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [district, setDistrict] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [emergencySupport, setEmergencySupport] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryRadius, setDeliveryRadius] = useState('5');
  const [latitude, setLatitude] = useState('9.9723'); // Default Kochi coords
  const [longitude, setLongitude] = useState('76.2801');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [isResolvingMaps, setIsResolvingMaps] = useState(false);
  const [mapsError, setMapsError] = useState('');

  const handleResolveGoogleMaps = async () => {
    if (!googleMapsUrl) {
      setMapsError(t('whatsapp_disabled') === 'WhatsApp ordering not enabled' ? 'Please enter a Google Maps link first.' : 'ദയവായി ഗൂഗിൾ മാപ്പ് ലിങ്ക് നൽകുക.');
      return;
    }

    setMapsError('');
    setIsResolvingMaps(true);

    try {
      // First try client-side extraction if it's a long URL
      const atPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
      const qPattern = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
      const llPattern = /[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/;
      const queryPattern = /[?&]query=(-?\d+\.\d+),(-?\d+\.\d+)/;

      let match = googleMapsUrl.match(atPattern);
      if (!match) match = googleMapsUrl.match(qPattern);
      if (!match) match = googleMapsUrl.match(llPattern);
      if (!match) match = googleMapsUrl.match(queryPattern);

      if (match && match[1] && match[2]) {
        setLatitude(match[1]);
        setLongitude(match[2]);
        setIsResolvingMaps(false);
        return;
      }

      // If not parseable client-side (e.g. a short URL), use our server action
      const res = await resolveGoogleMapsUrl(googleMapsUrl);
      if (res.success && res.latitude && res.longitude) {
        setLatitude(res.latitude.toString());
        setLongitude(res.longitude.toString());
      } else {
        setMapsError(res.error || 'Failed to extract coordinates from this link.');
      }
    } catch (err: any) {
      setMapsError(err.message || 'Something went wrong while resolving the link.');
    } finally {
      setIsResolvingMaps(false);
    }
  };
  
  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (activeTab === 'user') {
        const res = await registerUser(name, email, phone, password);
        if (res.success) {
          setSuccess(true);
          setTimeout(() => router.push('/login'), 2000);
        } else {
          setError(res.error || 'Failed to register');
        }
      } else {
        // Owner Registration
        if (!shopName || !address || !licenseNumber || !district || !pincode) {
          setError(language === 'ml' ? 'ഷോപ്പ് വിലാസം, ജില്ല, പിൻകോഡ്, ലൈസൻസ് നമ്പർ എന്നിവ നിർബന്ധമാണ്' : 'Please fill in all required fields including district and pincode');
          setIsLoading(false);
          return;
        }

        const latNum = parseFloat(latitude);
        const lngNum = parseFloat(longitude);

        if (isNaN(latNum) || isNaN(lngNum)) {
          setError('Please provide valid decimal coordinates');
          setIsLoading(false);
          return;
        }

        const res = await registerOwner({
          name,
          email,
          phone,
          password,
          shopName,
          address,
          pincode,
          district,
          licenseNumber,
          contactNumber: phone,
          whatsappNumber: whatsappNumber || null,
          deliveryAvailable,
          deliveryRadius: parseFloat(deliveryRadius) || 5,
          emergencySupport,
          latitude: latNum,
          longitude: lngNum,
        });

        if (res.success) {
          setSuccess(true);
          setTimeout(() => router.push('/login'), 2500);
        } else {
          setError(res.error || 'Failed to register store');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-slate-50 to-emerald-50/50">
      
      {/* Decors */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-4xl glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-2xl relative">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-2.5 mb-8">
          <Link href="/" className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg bg-white flex items-center justify-center border border-slate-100 p-1 hover:scale-105 transition-transform duration-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Marunnundo Logo" className="w-full h-full object-contain" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-1.5">
            {t('register_title')}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            {t('register_subtitle')}
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md mx-auto mb-8 border border-slate-200/50">
          <button
            type="button"
            onClick={() => { setActiveTab('user'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'user'
                ? 'bg-white text-slate-800 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>{t('patient_tab')}</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('owner'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'owner'
                ? 'bg-white text-slate-800 shadow-md font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t('owner_tab')}</span>
          </button>
        </div>

        {/* Registration form – single column on mobile, 2-col on md+ */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
          
          {/* LEFT SECTION: AUTH / OWNER INFO */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              {t('personal_info_section')}
            </h3>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('name_label')} *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('email_reg_label')} *</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('phone_label')} *</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('password_reg_label')} *</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Registration completed! Redirecting to login...</span>
              </div>
            )}

            {activeTab === 'user' && (
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-3 active:scale-98 cursor-pointer text-sm"
              >
                {isLoading ? t('registering_btn') : t('register_btn')}
              </button>
            )}
          </div>

          {/* RIGHT SECTION: OWNER/PHARMACY SPECIFIC (Only visible in owner tab) */}
          <div className={`flex flex-col gap-5 ${activeTab === 'user' ? 'hidden md:flex opacity-25 pointer-events-none select-none' : ''}`}>
            <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              {t('pharmacy_info_section')}
            </h3>

            {/* Shop Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('shop_name_label')} *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Life Pharmacy"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required={activeTab === 'owner'}
                  disabled={activeTab === 'user'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('address_label')} *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full shop address, street, building"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required={activeTab === 'owner'}
                  disabled={activeTab === 'user'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* District Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('district_label')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required={activeTab === 'owner'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer text-slate-700"
                >
                  <option value="">{t('choose_district')}</option>
                  {([
                    { en: 'Kasaragod',        ml: 'കാസർഗോഡ്' },
                    { en: 'Kannur',           ml: 'കണ്ണൂർ' },
                    { en: 'Wayanad',          ml: 'വയനാട്' },
                    { en: 'Kozhikode',        ml: 'കോഴിക്കോട്' },
                    { en: 'Malappuram',       ml: 'മലപ്പുറം' },
                    { en: 'Palakkad',         ml: 'പാലക്കാട്' },
                    { en: 'Thrissur',         ml: 'തൃശ്ശൂർ' },
                    { en: 'Ernakulam',        ml: 'എറണാകുളം' },
                    { en: 'Idukki',           ml: 'ഇടുക്കി' },
                    { en: 'Kottayam',         ml: 'കോട്ടയം' },
                    { en: 'Alappuzha',        ml: 'ആലപ്പുഴ' },
                    { en: 'Pathanamthitta',   ml: 'പത്തനംതിട്ട' },
                    { en: 'Kollam',           ml: 'കൊല്ലം' },
                    { en: 'Thiruvananthapuram', ml: 'തിരുവനന്തപുരം' },
                  ] as const).map((d) => (
                    <option key={d.en} value={d.en}>
                      {language === 'ml' ? `${d.ml} (${d.en})` : d.en}
                    </option>
                  ))}
                </select>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <svg className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">{t('pincode_label')} <span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder={t('pincode_placeholder')}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required={activeTab === 'owner'}
                  disabled={activeTab === 'user'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-widest font-mono"
                />
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
              <p className="text-[10px] text-slate-400">{t('pincode_hint')}</p>
            </div>

            {/* License Number & WhatsApp – stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t('license_label')} *</label>
                <div className="relative">
                  <input
                     type="text"
                     placeholder="e.g. DL-4321A"
                     value={licenseNumber}
                     onChange={(e) => setLicenseNumber(e.target.value)}
                     required={activeTab === 'owner'}
                     disabled={activeTab === 'user'}
                     className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{t('whatsapp_reg_label')}</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="WhatsApp No"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    disabled={activeTab === 'user'}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Toggle badges – stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={emergencySupport}
                  onChange={(e) => setEmergencySupport(e.target.checked)}
                  disabled={activeTab === 'user'}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>{t('emergency_247_toggle')}</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  disabled={activeTab === 'user'}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <span>{t('delivery_toggle')}</span>
              </label>
            </div>

            {deliveryAvailable && (
              <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-150">
                <label className="text-xs font-bold text-slate-600 min-w-[120px]">{t('delivery_radius_label')}:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  disabled={activeTab === 'user'}
                  className="w-20 px-2 py-1 border border-slate-200 rounded text-center text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                />
              </div>
            )}

            {/* GOOGLE MAPS LINK INPUT */}
            <div className="flex flex-col gap-2.5 bg-emerald-50/30 p-4 rounded-2xl border border-emerald-100/50">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600" />
                {t('google_maps_link_label')} *
              </label>
              
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://maps.app.goo.gl/... or https://google.com/maps/..."
                  value={googleMapsUrl}
                  onChange={(e) => {
                    setGoogleMapsUrl(e.target.value);
                    setMapsError('');
                  }}
                  required={activeTab === 'owner'}
                  disabled={activeTab === 'user'}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleResolveGoogleMaps}
                  disabled={isResolvingMaps || activeTab === 'user'}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md shadow-emerald-600/10 cursor-pointer whitespace-nowrap"
                >
                  {isResolvingMaps ? t('verifying_link_btn') : t('verify_link_btn')}
                </button>
              </div>

              {mapsError && (
                <p className="text-[11px] font-semibold text-red-600 animate-pulse">
                  ⚠️ {mapsError}
                </p>
              )}
              
              <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                *{t('maps_link_notice')}
              </p>
            </div>

            {/* MAP COORDINATES PREVIEW */}
            <div className="flex flex-col gap-2 mt-1">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {t('location_preview_label')}
              </label>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex justify-between">
                  <span className="text-slate-400">Lat:</span>
                  <span className="text-slate-700">{latitude}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex justify-between">
                  <span className="text-slate-400">Lng:</span>
                  <span className="text-slate-700">{longitude}</span>
                </div>
              </div>

              <div className="h-[180px] rounded-xl overflow-hidden border border-slate-200 relative">
                <MapLoader
                  mode="pick"
                  centerLat={parseFloat(latitude)}
                  centerLng={parseFloat(longitude)}
                  zoom={12}
                  onLocationSelected={(latVal, lngVal) => {
                    setLatitude(latVal.toString());
                    setLongitude(lngVal.toString());
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed font-semibold">
                *{t('marker_drag_notice')}
              </p>
            </div>

            {activeTab === 'owner' && (
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm"
              >
                {isLoading ? t('registering_shop_btn') : t('register_shop_btn')}
              </button>
            )}
          </div>

        </form>

        {/* Footer links */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center flex flex-col gap-2.5">
          <p className="text-xs text-slate-500 font-bold">
            {t('already_have_account')}
          </p>
          <Link
            href="/login"
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            {t('login_here')}
          </Link>
        </div>

      </div>

    </div>
  );
}
