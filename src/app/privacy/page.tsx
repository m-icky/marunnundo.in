import Link from 'next/link';
import { Shield, Eye, Lock, FileText, ArrowRight, CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | മരുന്നുണ്ടോ.in',
  description: 'Privacy Policy and Data Protection guidelines for Marunnundo.in users and pharmacies.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 mb-10 border border-emerald-100/80 shadow-xl shadow-emerald-900/5 relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                സ്വകാര്യതാ നയം <span className="text-emerald-600 font-sans">(Privacy Policy)</span>
              </h1>
              <p className="text-slate-600 font-medium mt-2 max-w-2xl text-sm sm:text-base">
                മരുന്നുണ്ടോ.in അതിന്റെ ഉപയോക്താക്കളുടെയും ഫാർമസി ഉടമസ്ഥരുടെയും വിവരങ്ങൾ എങ്ങനെ സംരക്ഷിക്കുന്നുവെന്ന് ഇവിടെ വായിക്കാം. Learn how we handle, protect, and respect your personal data.
              </p>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-3">
                Last Updated: May 2026
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-4 sticky lg:top-24 flex flex-col gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-1">
                നിയമ വ്യവസ്ഥകൾ (Legal Directory)
              </h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="flex items-center gap-3 font-bold text-sm p-3.5 rounded-xl transition-all bg-emerald-50 text-emerald-800 border border-emerald-100"
                >
                  <Lock className="w-4 h-4" />
                  <span>Privacy Policy (സ്വകാര്യതാ നയം)</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-3 font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 text-sm p-3.5 rounded-xl transition-all"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>Terms of Service (സേവന നിബന്ധനകൾ)</span>
                </Link>
                <Link
                  href="/pharmacy-license-policy"
                  className="flex items-center gap-3 font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 text-sm p-3.5 rounded-xl transition-all"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Pharmacy License Policy (ലൈസൻസ് നയം)</span>
                </Link>
              </nav>
            </div>
            
            {/* Quick Contact Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md bg-slate-900 text-slate-400">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
                സംശയങ്ങൾ ഉണ്ടോ? (Have Questions?)
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                ഞങ്ങളുടെ സ്വകാര്യതാ നയത്തെക്കുറിച്ച് എന്തെങ്കിലും സംശയങ്ങളുണ്ടെങ്കിൽ ബന്ധപ്പെടുക:
              </p>
              <ul className="flex flex-col gap-3 text-xs">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>support@marunnundo.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 484 2345 678</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Ernakulam, Kerala, India</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col gap-8 text-slate-700">
              
              {/* Introduction */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  1. അവതാരിക (Introduction)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    മരുന്നുണ്ടോ.in-ലേക്ക് സ്വാഗതം. നിങ്ങളുടെ സ്വകാര്യത ഞങ്ങൾക്ക് അതീവ പ്രാധാന്യമുള്ളതാണ്. ഞങ്ങളുടെ പ്ലാറ്റ്‌ഫോം ഉപയോഗിക്കുമ്പോൾ നിങ്ങളുടെ വ്യക്തിഗത വിവരങ്ങൾ എങ്ങനെ ശേഖരിക്കപ്പെടുന്നുവെന്നും, ഉപയോഗിക്കപ്പെടുന്നുവെന്നും, വെളിപ്പെടുത്തപ്പെടുന്നുവെന്നും വ്യക്തമാക്കാനാണ് ഈ സ്വകാര്യതാ നയം രൂപീകരിച്ചിരിക്കുന്നത്.
                  </p>
                  <p className="text-slate-500 font-sans italic">
                    Welcome to Marunnundo.in. We are committed to protecting your privacy. This Privacy Policy details how we collect, process, and safeguard your information when you use our platform to search for medicines or list your pharmacy.
                  </p>
                </div>
              </section>

              {/* Data Collection */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  2. ഞങ്ങൾ ശേഖരിക്കുന്ന വിവരങ്ങൾ (Information We Collect)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-4">
                  <p>
                    നിങ്ങൾ ഞങ്ങളുടെ പ്ലാറ്റ്‌ഫോമിൽ ഏതുതരം ഉപയോക്താവാണ് എന്നതിനെ അടിസ്ഥാനമാക്കി താഴെ പറയുന്ന വിവരങ്ങൾ ശേഖരിക്കാം:
                  </p>
                  
                  {/* Category 1: User */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 text-emerald-800">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
                      സാധാരണ ഉപയോക്താക്കൾ (Normal Users / Patients)
                    </h3>
                    <ul className="list-disc pl-5 text-xs sm:text-sm flex flex-col gap-1.5 text-slate-600">
                      <li><strong>ലൊക്കേഷൻ വിവരങ്ങൾ:</strong> നിങ്ങളുടെ അനുമതിയോടെ, നിങ്ങളുടെ ഉപകരണത്തിന്റെ കൃത്യമായ GPS ലൊക്കേഷൻ (കൂടുതൽ അടുത്തുള്ള ഫാർമസികൾ കണ്ടെത്തുന്നതിനായി).</li>
                      <li><strong>തിരച്ചിൽ വിവരങ്ങൾ:</strong> നിങ്ങൾ തിരയുന്ന മരുന്നുകളുടെ പേരുകൾ, ജില്ലകൾ, തീയതികൾ എന്നിവ.</li>
                      <li><strong>ഉപകരണ വിവരങ്ങൾ:</strong> നിങ്ങളുടെ ഐപി അഡ്രസ് (IP Address), ബ്രൗസർ വിവരങ്ങൾ, വെബ്സൈറ്റ് ഉപയോഗിച്ച സമയം.</li>
                    </ul>
                  </div>

                  {/* Category 2: Owners */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-2">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 text-blue-800">
                      <CheckCircle className="w-4.5 h-4.5 text-blue-600" />
                      ഫാർമസി ഉടമസ്ഥർ (Pharmacy Owners)
                    </h3>
                    <ul className="list-disc pl-5 text-xs sm:text-sm flex flex-col gap-1.5 text-slate-600">
                      <li><strong>അക്കൗണ്ട് വിവരങ്ങൾ:</strong> പേര്, മൊബൈൽ നമ്പർ, ഇമെയിൽ വിലാസം, രഹസ്യവാക്ക് (Password).</li>
                      <li><strong>ഫാർമസി വിവരങ്ങൾ:</strong> ഫാർമസിയുടെ പേര്, കൃത്യമായ വിലാസം, കോൺടാക്റ്റ് നമ്പർ, വാട്സ്ആപ്പ് നമ്പർ, ലൊക്കേഷൻ കോർഡിനേറ്റുകൾ (Latitude & Longitude).</li>
                      <li><strong>ലൈസൻസ് വിവരങ്ങൾ:</strong> ഡ്രഗ്സ് കൺട്രോൾ ഡിപ്പാർട്ട്മെന്റ് നൽകിയ ഔദ്യോഗിക ലൈസൻസ് നമ്പർ (Drug License Number), വെരിഫിക്കേഷൻ സ്റ്റാറ്റസ്.</li>
                      <li><strong>ഇൻവെന്ററി വിവരങ്ങൾ:</strong> ഫാർമസിയിൽ ലഭ്യമായ മരുന്നുകളുടെ പേരുകൾ, വില, സ്റ്റോക്ക് വിവരങ്ങൾ.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* How We Use Data */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-emerald-600" />
                  3. വിവരങ്ങൾ എങ്ങനെ ഉപയോഗിക്കുന്നു (How We Use Your Data)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>ശേഖരിക്കുന്ന വിവരങ്ങൾ താഴെ പറയുന്ന ആവശ്യങ്ങൾക്കായി ഉപയോഗിക്കുന്നു:</p>
                  <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                    <li>നിങ്ങൾക്ക് സമീപമുള്ള ഫാർമസികളും അവയിലെ മരുന്ന് ലഭ്യതയും കൃത്യമായി ഭൂപടത്തിൽ (Map) കാണിച്ച് തരുന്നതിനായി.</li>
                    <li>പ്ലാറ്റ്‌ഫോമിന്റെ സുഗമമായ പ്രവർത്തനത്തിനും സുരക്ഷയ്ക്കുമായി.</li>
                    <li>ഫാർമസി ലൈസൻസ് വിവരങ്ങൾ പരിശോധിച്ച് വ്യാജ വിവരങ്ങൾ പരസ്യപ്പെടുത്തുന്നത് തടയുന്നതിനായി.</li>
                    <li>ഫാർമസി ഉടമസ്ഥരെ പുതിയ അറിയിപ്പുകളും കസ്റ്റമർ മെസ്സേജുകളും അറിയിക്കുന്നതിനായി (Notifications).</li>
                    <li>ഉപയോക്താക്കളുടെ നിർദ്ദേശങ്ങൾക്കനുസരിച്ച് സേവനങ്ങൾ മെച്ചപ്പെടുത്തുന്നതിനായി.</li>
                  </ul>
                </div>
              </section>

              {/* Data Sharing */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  4. വിവരങ്ങൾ കൈമാറുന്നത് (Data Sharing & Disclosure)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    ഞങ്ങൾ നിങ്ങളുടെ സ്വകാര്യ വിവരങ്ങൾ പരസ്യദാതാക്കൾക്കോ മൂന്നാം കക്ഷികൾക്കോ വിൽക്കുകയോ വാടകയ്ക്ക് നൽകുകയോ ഇല്ല. എന്നാൽ താഴെ പറയുന്ന സന്ദർഭങ്ങളിൽ വിവരങ്ങൾ പങ്കുവെക്കാം:
                  </p>
                  <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                    <li><strong>ഭൂപട സേവനങ്ങൾ:</strong> മാപ്പ് ഇന്റഗ്രേഷനായി (OpenStreetMap/Mapbox) നിങ്ങളുടെ ലൊക്കേഷൻ ഡാറ്റ അജ്ഞാതമായി ഉപയോഗിച്ചേക്കാം.</li>
                    <li><strong>നിയമപരമായ ആവശ്യങ്ങൾ:</strong> ഡ്രഗ്സ് കൺട്രോൾ ഡിപ്പാർട്ട്മെന്റോ സർക്കാർ ഏജൻസികളോ നിയമപരമായി ആവശ്യപ്പെട്ടാൽ വിവരങ്ങൾ കൈമാറാൻ ഞങ്ങൾ ബാധ്യസ്ഥരാണ്.</li>
                  </ul>
                </div>
              </section>

              {/* Security */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-600" />
                  5. വിവര സുരക്ഷ (Data Security)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    നിങ്ങൾ നൽകുന്ന വിവരങ്ങൾ അതീവ സുരക്ഷിതമായി ഡാറ്റാബേസിൽ സൂക്ഷിക്കുന്നു. പാസ്‌വേഡുകൾ എൻക്രിപ്റ്റ് ചെയ്ത രൂപത്തിലാണ് സംഭരിക്കുന്നത്. പ്ലാറ്റ്‌ഫോമിലെ വിവരങ്ങൾ ചോരാതിരിക്കാൻ ആധുനിക സെക്യൂരിറ്റി മാനദണ്ഡങ്ങൾ ഞങ്ങൾ ഉപയോഗിക്കുന്നുണ്ട്. എന്നിരുന്നാലും, ഇൻറർനെറ്റിലൂടെയുള്ള ഒരു ട്രാൻസ്മിഷനും 100% സുരക്ഷിതമാണെന്ന് ഉറപ്പ് നൽകാൻ കഴിയില്ല.
                  </p>
                  <p className="text-slate-500 font-sans italic">
                    We employ industry-standard security measures, including strong encryption algorithms for credentials, to safeguard database transmissions. While we strive to protect your data, no method of transmission over the internet is completely secure.
                  </p>
                </div>
              </section>

              {/* Cookies */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  6. കുക്കികൾ (Cookies & Storage)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    വെബ്‌സൈറ്റിന്റെ ഉപയോഗക്ഷമത വർദ്ധിപ്പിക്കുന്നതിനും ലോഗിൻ വിവരങ്ങൾ ഓർത്തു വെക്കുന്നതിനും ഞങ്ങൾ സുരക്ഷിതമായ കുക്കികളും (Session Cookies), ലോക്കൽ സ്റ്റോറേജും (LocalStorage) ഉപയോഗിക്കുന്നു. നിങ്ങളുടെ ബ്രൗസർ സെറ്റിങ്സിൽ പോയി കുക്കികൾ നിയന്ത്രിക്കാൻ നിങ്ങൾക്ക് സാധിക്കും.
                  </p>
                </div>
              </section>

              {/* Rights */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  7. നിങ്ങളുടെ അവകാശങ്ങൾ (Your Rights & Control)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>ഉപയോക്താക്കൾക്ക് താഴെ പറയുന്ന അവകാശങ്ങളുണ്ട്:</p>
                  <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                    <li>ഞങ്ങൾ ശേഖരിച്ചിരിക്കുന്ന വിവരങ്ങൾ ഏതൊക്കെയെന്ന് പരിശോധിക്കാനും തിരുത്താനുമുള്ള അവകാശം.</li>
                    <li>ലൊക്കേഷൻ പെർമിഷനുകൾ ഏത് സമയത്തും അപ്രാപ്തമാക്കാനുള്ള അവകാശം.</li>
                    <li>ഫാർമസി ഉടമസ്ഥർക്ക് അക്കൗണ്ടുകൾ ഡിലീറ്റ് ചെയ്യാനും ഫാർമസി ഡാറ്റ നീക്കം ചെയ്യാനുമുള്ള അവകാശം.</li>
                  </ul>
                </div>
              </section>

              {/* Changes */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  8. മാറ്റങ്ങൾ (Changes to this Policy)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    കാലാനുസൃതമായി ഈ നയങ്ങളിൽ മാറ്റങ്ങൾ വരുത്താൻ ഞങ്ങൾക്ക് അവകാശമുണ്ട്. അങ്ങനെയുള്ള സാഹചര്യങ്ങളിൽ തീയതി സഹിതം പുതിയ നയങ്ങൾ ഇവിടെ വെളിപ്പെടുത്തുന്നതാണ്.
                  </p>
                </div>
              </section>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
