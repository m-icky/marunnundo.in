'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePharmacy } from '@/app/actions/owner';
import MapLoader from '@/components/MapLoader';
import { 
  Store, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Truck, 
  AlertCircle, 
  Clock, 
  Image as ImageIcon,
  Save, 
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface OperatingHours {
  id?: string;
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
  logo: string | null;
  banner: string | null;
}

interface Props {
  pharmacy: Pharmacy;
  initialHours: OperatingHours[];
}

const PRESET_BANNERS = [
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1607619056574-7b8d304b3b3a?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=600&auto=format&fit=crop&q=80'
];

export default function OwnerShopClient({ pharmacy, initialHours }: Props) {
  const router = useRouter();
  
  // Detail States
  const [name, setName] = useState(pharmacy.name);
  const [address, setAddress] = useState(pharmacy.address);
  const [contactNumber, setContactNumber] = useState(pharmacy.contactNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(pharmacy.whatsappNumber || '');
  const [deliveryAvailable, setDeliveryAvailable] = useState(pharmacy.deliveryAvailable);
  const [deliveryRadius, setDeliveryRadius] = useState(pharmacy.deliveryRadius.toString());
  const [emergencySupport, setEmergencySupport] = useState(pharmacy.emergencySupport);
  const [logo, setLogo] = useState(pharmacy.logo || '');
  const [banner, setBanner] = useState(pharmacy.banner || '');
  
  // Coordinates State
  const [latitude, setLatitude] = useState(pharmacy.latitude.toString());
  const [longitude, setLongitude] = useState(pharmacy.longitude.toString());

  // Hours State
  const [hours, setHours] = useState<OperatingHours[]>(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days.map(day => {
      const existing = initialHours.find(h => h.day === day);
      return {
        day,
        openTime: existing?.openTime || '09:00',
        closeTime: existing?.closeTime || '21:00',
        isClosed: existing ? existing.isClosed : false
      };
    });
  });

  // Feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleHourToggle = (day: string) => {
    setHours(prev => prev.map(h => h.day === day ? { ...h, isClosed: !h.isClosed } : h));
  };

  const handleTimeChange = (day: string, field: 'openTime' | 'closeTime', val: string) => {
    setHours(prev => prev.map(h => h.day === day ? { ...h, [field]: val } : h));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const latNum = parseFloat(latitude);
      const lngNum = parseFloat(longitude);

      if (isNaN(latNum) || isNaN(lngNum)) {
        setError('Please select valid decimal map coordinates.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('address', address);
      formData.append('contactNumber', contactNumber);
      formData.append('whatsappNumber', whatsappNumber);
      formData.append('deliveryAvailable', deliveryAvailable ? 'true' : 'false');
      formData.append('deliveryRadius', deliveryRadius);
      formData.append('emergencySupport', emergencySupport ? 'true' : 'false');
      formData.append('latitude', latitude);
      formData.append('longitude', longitude);
      formData.append('logo', logo);
      formData.append('banner', banner);

      // Append hours
      hours.forEach(h => {
        formData.append(`hours.${h.day}.open`, h.openTime);
        formData.append(`hours.${h.day}.close`, h.closeTime);
        formData.append(`hours.${h.day}.closed`, h.isClosed ? 'true' : 'false');
      });

      const res = await updatePharmacy(pharmacy.id, formData);
      if (res.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error || 'Failed to update pharmacy details');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-12">
      
      {/* Header card */}
      <section className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">ഷോപ്പ് ക്രമീകരണങ്ങൾ (Settings)</h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              Edit pharmacy coordinates, delivery radius and operational hours
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-4 rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 animate-bounce" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-4 rounded-xl flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>ക്രമീകരണങ്ങൾ വിജയകരമായി അപ്‌ഡേറ്റ് ചെയ്തിരിക്കുന്നു! (Settings updated successfully!)</span>
        </div>
      )}

      {/* CORE FIELDS SET */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: BASE INFO & IMAGES */}
        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-5 bg-white">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-emerald-600" />
              പ്രധാന വിവരങ്ങൾ (Shop Details)
            </h3>

            {/* Shop Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">ഷോപ്പിന്റെ പേര് (Shop Name)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">വിലാസം (Address)</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-h-[60px]"
              />
            </div>

            {/* Contact & Whatsapp */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">ഫോൺ നമ്പർ</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">വാട്സ്ആപ്പ് നമ്പർ</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>
            </div>

            {/* Delivery Toggles */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={emergencySupport}
                  onChange={(e) => setEmergencySupport(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4 focus:ring-0"
                />
                <span>24/7 എമർജൻസി</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  className="rounded text-emerald-600 w-4 h-4 focus:ring-0"
                />
                <span>ഹോം ഡെലിവറി</span>
              </label>
            </div>

            {deliveryAvailable && (
              <div className="flex items-center gap-3 animate-in slide-in-from-top-2 duration-150 border-t border-slate-50 pt-2.5">
                <label className="text-xs font-bold text-slate-600">ഡെലിവറി പരിധി (Delivery Radius in KM):</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={deliveryRadius}
                  onChange={(e) => setDeliveryRadius(e.target.value)}
                  className="w-20 px-2 py-1 border border-slate-200 rounded text-center text-xs font-bold bg-white"
                />
              </div>
            )}
          </div>

          {/* Banner presets selection */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 bg-white">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              പ്രൊഫൈൽ ചിത്രങ്ങൾ (Profile Media)
            </h3>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600">Logo Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/logo.jpg"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none bg-white"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600">Banner Image URL</label>
              <input
                type="text"
                placeholder="https://example.com/banner.jpg"
                value={banner}
                onChange={(e) => setBanner(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none bg-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ബാനർ ചിത്രങ്ങൾ (Preset Banner Templates)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_BANNERS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBanner(url)}
                    className={`h-14 rounded-lg overflow-hidden border-2 transition-all relative ${
                      banner === url ? 'border-emerald-500 scale-95 shadow-md' : 'border-transparent opacity-85 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: MAP COORDINATES PICKER & OPERATING HOURS */}
        <div className="flex flex-col gap-6">
          
          {/* Coordinates Picker */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 bg-white">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              ലൊക്കേഷൻ ക്രമീകരണം (Shop Coordinates Picker)
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg flex justify-between">
                <span className="text-slate-400">Latitude:</span>
                <span className="text-slate-800">{parseFloat(latitude).toFixed(6)}</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg flex justify-between">
                <span className="text-slate-400">Longitude:</span>
                <span className="text-slate-800">{parseFloat(longitude).toFixed(6)}</span>
              </div>
            </div>

            <div className="h-[180px] rounded-xl overflow-hidden relative border border-slate-200">
              <MapLoader
                mode="pick"
                centerLat={parseFloat(latitude) || 9.9723}
                centerLng={parseFloat(longitude) || 76.2801}
                zoom={14}
                onLocationSelected={(latVal, lngVal) => {
                  setLatitude(latVal.toString());
                  setLongitude(lngVal.toString());
                }}
              />
            </div>
            <p className="text-[10px] text-slate-400 text-center leading-relaxed font-semibold">
              *ലൊക്കേഷൻ മാറ്റാൻ മാപ്പിൽ ആവശ്യമുള്ള സ്ഥലത്ത് ക്ലിക്ക് ചെയ്യുകയോ പിൻ നീക്കുകയോ ചെയ്യുക.
            </p>
          </div>

          {/* Operating Hours Matrix */}
          <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 bg-white">
            <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-50 pb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600 animate-pulse" />
              പ്രവർത്തന സമയം (Operating Hours Matrix)
            </h3>

            <div className="flex flex-col gap-2.5">
              {hours.map((h, i) => (
                <div key={h.day} className="flex items-center justify-between gap-3 text-xs border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                  <span className="font-bold text-slate-700 w-20">{h.day}</span>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={h.openTime}
                      disabled={h.isClosed}
                      onChange={(e) => handleTimeChange(h.day, 'openTime', e.target.value)}
                      className="px-2 py-1 border border-slate-200 rounded text-xs font-semibold focus:outline-none bg-white disabled:opacity-30"
                    />
                    <span className="text-slate-400 font-bold">to</span>
                    <input
                      type="time"
                      value={h.closeTime}
                      disabled={h.isClosed}
                      onChange={(e) => handleTimeChange(h.day, 'closeTime', e.target.value)}
                      className="px-2 py-1 border border-slate-200 rounded text-xs font-semibold focus:outline-none bg-white disabled:opacity-30"
                    />
                  </div>

                  <label className="flex items-center gap-1 cursor-pointer font-extrabold text-red-600">
                    <input
                      type="checkbox"
                      checked={h.isClosed}
                      onChange={() => handleHourToggle(h.day)}
                      className="rounded text-red-600 w-3.5 h-3.5 focus:ring-0"
                    />
                    <span>Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </form>
  );
}
