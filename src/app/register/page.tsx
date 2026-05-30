'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { registerOwner, resolveGoogleMapsUrl } from '@/app/actions/auth';
import MapLoader from '@/components/MapLoader';
import { useLanguage } from '@/context/LanguageContext';
import { 
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
  Hash,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  ArrowLeft,
  Check,
  Loader2
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  
  // Account details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Pharmacy details
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
  const [isMapsVerified, setIsMapsVerified] = useState(false);

  // Password validation checks
  const hasMinLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoSpaces = password.length > 0 && !/\s/.test(password);

  const isPasswordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasNoSpaces;
  
  // Status states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResolveGoogleMaps = async () => {
    if (!googleMapsUrl) {
      setMapsError(language === 'ml' ? 'ദയവായി ഗൂഗിൾ മാപ്പ് ലിങ്ക് നൽകുക.' : 'Please enter a Google Maps link first.');
      setIsMapsVerified(false);
      return;
    }

    setMapsError('');
    setIsResolvingMaps(true);
    setIsMapsVerified(false);

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
        setIsMapsVerified(true);
        return;
      }

      // If not parseable client-side, resolve through server action
      const res = await resolveGoogleMapsUrl(googleMapsUrl);
      if (res.success && res.latitude && res.longitude) {
        setLatitude(res.latitude.toString());
        setLongitude(res.longitude.toString());
        setIsMapsVerified(true);
      } else {
        setMapsError(res.error || 'Failed to extract coordinates from this link.');
        setIsMapsVerified(false);
      }
    } catch (err: any) {
      setMapsError(err.message || 'Something went wrong while resolving the link.');
      setIsMapsVerified(false);
    } finally {
      setIsResolvingMaps(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Secure password validation check
    if (!isPasswordValid) {
      setError(language === 'ml' 
        ? 'ദയവായി എല്ലാ പാസ്‌വേഡ് നിബന്ധനകളും പാലിക്കുക' 
        : 'Please satisfy all password security requirements'
      );
      return;
    }

    setIsLoading(true);

    try {
      if (!shopName || !address || !licenseNumber || !district || !pincode) {
        setError(language === 'ml' 
          ? 'ഷോപ്പ് വിലാസം, ജില്ല, പിൻകോഡ്, ലൈസൻസ് നമ്പർ എന്നിവ നിർബന്ധമാണ്' 
          : 'Please fill in all required fields including district and pincode'
        );
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
        
        // Trigger a burst of beautiful confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        // Follow up with some side bursts for extra premium feel!
        const duration = 2.5 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#10b981', '#34d399', '#059669']
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#10b981', '#34d399', '#059669']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();

        // Redirect to /login after 3.5 seconds
        setTimeout(() => router.push('/login'), 3500);
      } else {
        setError(res.error || 'Failed to register store');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-slate-50">
      
      {/* Light Theme Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-10"></div>

      <div className="w-full max-w-5xl flex flex-col gap-8 relative">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="self-start flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{language === 'ml' ? 'തിരികെ ഹോമിലേക്ക്' : 'Back to Home'}</span>
        </Link>

        {/* Brand Banner Card */}
        <header className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/20 rounded-full blur-2xl"></div>
          <div className="flex items-center gap-4.5 relative z-10">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-md p-1.5 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Marunnundo Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col gap-1 text-left">
              <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/10 w-max">
                <Sparkles className="w-3 h-3 text-emerald-500 animate-spin" />
                <span>{language === 'ml' ? 'ഫാർമസി രജിസ്ട്രേഷൻ' : 'PHARMACY ONBOARDING'}</span>
              </div>
              <h1 className="text-2xl sm:text-3.5xl font-black text-slate-800 tracking-tight leading-none">
                {language === 'ml' ? 'പുതിയ ഫാർമസി ചേർക്കുക' : 'Register New Pharmacy'}
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-semibold">
                {language === 'ml' ? 'നിങ്ങളുടെ ഫാർമസി വിവരങ്ങൾ രേഖപ്പെടുത്തി അക്കൗണ്ട് തുറക്കൂ' : 'Provide your pharmacy details to register on marunnundo.in'}
              </p>
            </div>
          </div>
        </header>

        {/* Redesigned Registration Form (Light Theme) */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* LEFT COLUMN: ACCOUNT CREDENTIALS & STORE INFO (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* CARD 1: ACCOUNT CREDENTIALS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col gap-5">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">01</span>
                <span>{t('personal_info_section')}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('name_label')} <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('email_reg_label')} <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('phone_label')} <span className="text-emerald-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5 group col-span-1 sm:col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('password_reg_label')} <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>

                  {/* Dynamic Password Strength & Criteria Indicators */}
                  {password.length > 0 && (
                    <div className="mt-2.5 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          {language === 'ml' ? 'പാസ്‌വേഡ് സുരക്ഷാ നില' : 'Password Security Strength'}
                        </span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          isPasswordValid ? 'text-emerald-600' : 'text-amber-600'
                        }`}>
                          {isPasswordValid 
                            ? (language === 'ml' ? 'ശക്തമാണ്' : 'Strong & Secure')
                            : (language === 'ml' ? 'ദുർബലമാണ്' : 'Weak / Incomplete')
                          }
                        </span>
                      </div>
                      
                      {/* Strength progress bar */}
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            isPasswordValid ? 'bg-emerald-500 w-full' : 'bg-amber-400 w-1/2'
                          }`}
                        ></div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            hasMinLength ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {hasMinLength ? <Check className="w-3 h-3 stroke-[3px]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                          </div>
                          <span className={hasMinLength ? 'text-slate-700 font-semibold' : 'text-slate-400 font-semibold'}>
                            {language === 'ml' ? 'കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ' : 'Minimum 6 characters'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            hasUpperCase && hasLowerCase ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {hasUpperCase && hasLowerCase ? <Check className="w-3 h-3 stroke-[3px]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                          </div>
                          <span className={hasUpperCase && hasLowerCase ? 'text-slate-700 font-semibold' : 'text-slate-400 font-semibold'}>
                            {language === 'ml' ? 'വലിയ & ചെറിയ അക്ഷരങ്ങൾ' : 'Uppercase & Lowercase'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            hasNumber ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {hasNumber ? <Check className="w-3 h-3 stroke-[3px]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                          </div>
                          <span className={hasNumber ? 'text-slate-700 font-semibold' : 'text-slate-400 font-semibold'}>
                            {language === 'ml' ? 'ഒരു അക്കം (0-9)' : 'One number (0-9)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            hasSpecialChar ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {hasSpecialChar ? <Check className="w-3 h-3 stroke-[3px]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                          </div>
                          <span className={hasSpecialChar ? 'text-slate-700 font-semibold' : 'text-slate-400 font-semibold'}>
                            {language === 'ml' ? 'പ്രത്യേക ചിഹ്നം (!@#$%...)' : 'Special symbol (!@#$...)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-semibold">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            hasNoSpaces ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {hasNoSpaces ? <Check className="w-3 h-3 stroke-[3px]" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>}
                          </div>
                          <span className={hasNoSpaces ? 'text-slate-700 font-semibold' : 'text-slate-400 font-semibold'}>
                            {language === 'ml' ? 'ഇടവേളകൾ പാടില്ല' : 'No spaces allowed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* CARD 2: PHARMACY STORE INFO */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col gap-5">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">02</span>
                <span>{t('pharmacy_info_section')}</span>
              </h3>

              {/* Shop Name */}
              <div className="flex flex-col gap-1.5 group">
                <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                  {t('shop_name_label')} <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Life Pharmacy"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                  />
                  <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                </div>
              </div>

              {/* Shop Address */}
              <div className="flex flex-col gap-1.5 group">
                <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                  {t('address_label')} <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Full shop address, street, building"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* District */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('district_label')} <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full pl-10 pr-8 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold appearance-none cursor-pointer"
                    >
                      <option value="" className="text-slate-500">{t('choose_district')}</option>
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
                        <option key={d.en} value={d.en} className="bg-white text-slate-800">
                          {language === 'ml' ? `${d.ml} (${d.en})` : d.en}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none group-focus-within:text-emerald-600" />
                    <svg className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>

                {/* Pincode */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('pincode_label')} <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder={t('pincode_placeholder')}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold font-mono tracking-widest"
                    />
                    <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* License Number */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('license_label')} <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. DL-4321A"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                    />
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div className="flex flex-col gap-1.5 group">
                  <label className="text-[10px] font-extrabold text-slate-500 group-focus-within:text-emerald-600 transition-colors uppercase tracking-widest">
                    {t('whatsapp_reg_label')}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="WhatsApp number"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                    />
                    <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 group-focus-within:text-emerald-600 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: SERVICES & GEOLOCATION (5 COLS) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* CARD 3: SERVICES & FEATURES */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-5">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">03</span>
                <span>{language === 'ml' ? 'സേവനങ്ങൾ' : 'Services & Delivery'}</span>
              </h3>

              {/* Redesigned Switch Badges (Light Theme) */}
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => setEmergencySupport(!emergencySupport)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    emergencySupport 
                      ? 'bg-emerald-50 border-emerald-500/40 text-emerald-800 shadow-sm shadow-emerald-500/5' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col items-start gap-0.5 text-left">
                    <span className="text-xs font-extrabold uppercase tracking-wider">{t('emergency_247_toggle')}</span>
                    <span className="text-[9px] text-slate-400 font-bold">Show emergency badge in search</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ${emergencySupport ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${emergencySupport ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryAvailable(!deliveryAvailable)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    deliveryAvailable 
                      ? 'bg-emerald-50 border-emerald-500/40 text-emerald-800 shadow-sm shadow-emerald-500/5' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col items-start gap-0.5 text-left">
                    <span className="text-xs font-extrabold uppercase tracking-wider">{t('delivery_toggle')}</span>
                    <span className="text-[9px] text-slate-400 font-bold">Deliver medicines direct to patients</span>
                  </div>
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ${deliveryAvailable ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${deliveryAvailable ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
              </div>

              {deliveryAvailable && (
                <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl animate-in slide-in-from-top-2 duration-150">
                  <label className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">{t('delivery_radius_label')}:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={deliveryRadius}
                      onChange={(e) => setDeliveryRadius(e.target.value)}
                      className="w-16 px-2.5 py-1 border border-slate-200 bg-white rounded-lg text-center text-xs font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none"
                    />
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">KM</span>
                  </div>
                </div>
              )}
            </div>

            {/* CARD 4: GOOGLE MAPS ONBOARDING & PREVIEW */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col gap-5">
              <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">04</span>
                <span>{language === 'ml' ? 'ലൊക്കേഷൻ വിവരങ്ങൾ' : 'Location Pinning'}</span>
              </h3>

              {/* Google Maps input */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-500/20">
                <label className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  {t('google_maps_link_label')} <span className="text-emerald-500">*</span>
                </label>
                
                <div className="flex flex-col gap-2 mt-1">
                  <input
                    type="url"
                    placeholder="Paste maps link here..."
                    value={googleMapsUrl}
                    onChange={(e) => {
                      setGoogleMapsUrl(e.target.value);
                      setMapsError('');
                      setIsMapsVerified(false);
                    }}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleResolveGoogleMaps}
                      disabled={isResolvingMaps}
                      className={`flex-1 disabled:opacity-50 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md cursor-pointer whitespace-nowrap text-center ${
                        isMapsVerified 
                          ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/10'
                      }`}
                    >
                      {isResolvingMaps ? (
                        t('verifying_link_btn')
                      ) : isMapsVerified ? (
                        <span className="flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-100 animate-in zoom-in-50 duration-200" />
                          <span>{language === 'ml' ? 'വെരിഫൈഡ്' : 'Verified'}</span>
                        </span>
                      ) : (
                        t('verify_link_btn')
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleMapsUrl('');
                        setMapsError('');
                        setIsMapsVerified(false);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-extrabold text-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap text-center"
                    >
                      {language === 'ml' ? 'റീസെറ്റ്' : 'Reset'}
                    </button>
                  </div>
                </div>

                {mapsError && (
                  <p className="text-[10px] font-bold text-red-600 animate-pulse mt-0.5">
                    ⚠️ {mapsError}
                  </p>
                )}
                
                <p className="text-[9px] text-slate-400 leading-relaxed font-bold mt-1">
                  *{t('maps_link_notice')}
                </p>
              </div>

              {/* Location Coordinates overlay */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">{t('location_preview_label')}</span>
                  <span className="text-[9px] font-extrabold bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-500" /> Live Geopins
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex justify-between">
                    <span className="text-slate-400 text-[10px] font-sans uppercase font-bold tracking-widest">Lat</span>
                    <span className="text-emerald-600">{parseFloat(latitude).toFixed(5)}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl flex justify-between">
                    <span className="text-slate-400 text-[10px] font-sans uppercase font-bold tracking-widest">Lng</span>
                    <span className="text-emerald-600">{parseFloat(longitude).toFixed(5)}</span>
                  </div>
                </div>

                {/* Leaflet Map Widget container */}
                <div className="h-[200px] rounded-2xl overflow-hidden border border-slate-200 relative shadow-inner bg-slate-100">
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
                <p className="text-[9px] text-slate-400 text-center leading-relaxed font-bold">
                  *{t('marker_drag_notice')}
                </p>
              </div>
            </div>

            {/* Error alerts & success info */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-extrabold p-4 rounded-2xl flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold p-4 rounded-2xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Registration completed successfully! Redirecting to login page...</span>
              </div>
            )}

            {/* Submit Action Block */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-4 rounded-2xl transition-all shadow-md active:scale-98 cursor-pointer text-sm flex items-center justify-center gap-2"
            >
              <span>{isLoading ? t('registering_shop_btn') : t('register_shop_btn')}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

          </div>

        </form>

        {/* Unified sleek Footer info */}
        <footer className="mt-8 border-t border-slate-200 pt-6 text-center flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
            <span>Secure Merchant Portal & Verified Network</span>
          </div>
          <p className="text-xs text-slate-600 font-bold">
            {t('already_have_account')}{' '}
            <Link
              href="/login"
              className="font-extrabold text-emerald-600 hover:text-emerald-700 underline pl-1"
            >
              {t('login_here')}
            </Link>
          </p>
        </footer>

      </div>

      {/* Full-screen Success Celebration & Redirect Loader Overlay */}
      {success && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white border border-slate-100 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl flex flex-col items-center text-center gap-6 relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Emerald Top Accent Line */}
            <div className="absolute top-0 inset-x-0 h-2 bg-emerald-500"></div>
            
            {/* Animated Checkmark Circle */}
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/10 relative">
              <Check className="w-10 h-10 stroke-[3px] animate-in zoom-in-75 duration-300 delay-100" />
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                {language === 'ml' ? 'രജിസ്ട്രേഷൻ വിജയകരം!' : 'Registration Successful!'}
              </h2>
              <p className="text-slate-500 text-sm font-semibold leading-relaxed">
                {language === 'ml' 
                  ? 'നിങ്ങളുടെ ഫാർമസി വിജയകരമായി രജിസ്റ്റർ ചെയ്തു. ഒരു വെൽക്കം ഇമെയിൽ നിങ്ങളുടെ ഇൻബോക്സിലേക്ക് അയച്ചിട്ടുണ്ട്.'
                  : 'Your pharmacy has been successfully registered. A welcome email has been sent to your inbox!'
                }
              </p>
            </div>

            {/* Spinner Loader */}
            <div className="flex flex-col items-center gap-3 mt-2 w-full">
              <div className="flex items-center justify-center gap-2.5 bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 w-full">
                <Loader2 className="w-4.5 h-4.5 text-emerald-600 animate-spin" />
                <span className="text-xs font-bold text-slate-600">
                  {language === 'ml' ? 'ഡാഷ്‌ബോർഡിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു...' : 'Preparing your secure dashboard...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
