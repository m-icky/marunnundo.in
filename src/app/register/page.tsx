'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser, registerOwner } from '@/app/actions/auth';
import MapLoader from '@/components/MapLoader';
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
  Truck, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  Navigation
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'user' | 'owner'>('user');
  
  // General details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Owner/Pharmacy details
  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [emergencySupport, setEmergencySupport] = useState(false);
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryRadius, setDeliveryRadius] = useState('5');
  const [latitude, setLatitude] = useState('9.9723'); // Default Kochi coords
  const [longitude, setLongitude] = useState('76.2801');
  
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
        if (!shopName || !address || !licenseNumber) {
          setError('Please fill in all required shop details');
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
          <Link href="/" className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
            <HeartPulse className="w-5.5 h-5.5 animate-pulse" />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight mt-1.5">
            പുതിയ അക്കൗണ്ട് രജിസ്റ്റർ ചെയ്യാം
          </h2>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Register new account on Marunnundo.in
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
            <span>രോഗി / ഉപയോക്താവ് (Patient)</span>
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
            <span>ഫാർമസി ഉടമ (Pharmacy Owner)</span>
          </button>
        </div>

        {/* Registration form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* LEFT SECTION: AUTH / OWNER INFO */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-600" />
              വ്യക്തിഗത വിവരങ്ങൾ (Owner / User Profile)
            </h3>

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">പേര് (Name) *</label>
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
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">ഇമെയിൽ (Email) *</label>
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
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">ഫോൺ നമ്പർ (Phone) *</label>
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
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">രഹസ്യവാക്ക് (Password) *</label>
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
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2">
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
                {isLoading ? 'രജിസ്റ്റർ ചെയ്യുന്നു...' : 'രജിസ്റ്റർ ചെയ്യാം (Register)'}
              </button>
            )}
          </div>

          {/* RIGHT SECTION: OWNER/PHARMACY SPECIFIC (Only visible in owner tab) */}
          <div className={`flex flex-col gap-5 ${activeTab === 'user' ? 'hidden md:flex opacity-25 pointer-events-none select-none' : ''}`}>
            <h3 className="text-sm font-extrabold text-slate-700 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              മെഡിക്കൽ ഷോപ്പ് വിവരങ്ങൾ (Pharmacy Details)
            </h3>

            {/* Shop Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">ഷോപ്പിന്റെ പേര് (Shop Name) *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Life Pharmacy"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  required={activeTab === 'owner'}
                  disabled={activeTab === 'user'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"
                />
                <Store className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">വിലാസം (Address) *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full shop address, street, building"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required={activeTab === 'owner'}
                  disabled={activeTab === 'user'}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* License Number & WhatsApp */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest text-[10px]">ലൈസൻസ് നമ്പർ *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. DL-4321A"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required={activeTab === 'owner'}
                    disabled={activeTab === 'user'}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                  />
                  <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest text-[10px]">വാട്സ്ആപ്പ് നമ്പർ</label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="WhatsApp No"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    disabled={activeTab === 'user'}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none"
                  />
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Toggle badges */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={emergencySupport}
                  onChange={(e) => setEmergencySupport(e.target.checked)}
                  disabled={activeTab === 'user'}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>24/7 എമർജൻസി</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  disabled={activeTab === 'user'}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                />
                <span>ഹോം ഡെലിവറി</span>
              </label>
            </div>

            {deliveryAvailable && (
              <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-150">
                <label className="text-xs font-bold text-slate-600 min-w-[120px]">ഡെലിവറി പരിധി (KM):</label>
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

            {/* MAP COORDINATES PICKER */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                ലൊക്കേഷൻ തിരഞ്ഞെടുക്കുക (Set Map Location) *
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
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                *ഭൂപടത്തിൽ ക്ലിക്ക് ചെയ്യുകയോ പിൻ വലിച്ചിടുകയോ ചെയ്യുമ്പോൾ കോർഡിനേറ്റുകൾ തനിയെ സെറ്റാകുന്നതാണ്.
              </p>
            </div>

            {activeTab === 'owner' && (
              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-sm"
              >
                {isLoading ? 'ഷോപ്പ് രജിസ്റ്റർ ചെയ്യുന്നു...' : 'ഫാർമസി രജിസ്റ്റർ ചെയ്യാം (Register Pharmacy)'}
              </button>
            )}
          </div>

        </form>

        {/* Footer links */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center flex flex-col gap-2.5">
          <p className="text-xs text-slate-500 font-semibold">
            ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ? (Already have an account?)
          </p>
          <Link
            href="/login"
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            ഇവിടെ ലോഗിൻ ചെയ്യാം (Login Here)
          </Link>
        </div>

      </div>

    </div>
  );
}
