import Link from 'next/link';
import { Shield, Eye, Lock, FileText, ArrowRight, AlertTriangle, Scale, Mail, Phone, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service | മരുന്നുണ്ടോ.in',
  description: 'Terms of Service and legal agreements for Marunnundo.in search and pharmacy listings.',
};

export default function TermsOfServicePage() {
  return (
    <div className="flex-1 bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 mb-10 border border-emerald-100/80 shadow-xl shadow-emerald-900/5 relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                സേവന നിബന്ധനകൾ <span className="text-emerald-600 font-sans">(Terms of Service)</span>
              </h1>
              <p className="text-slate-600 font-medium mt-2 max-w-2xl text-sm sm:text-base">
                മരുന്നുണ്ടോ.in പ്ലാറ്റ്‌ഫോം ഉപയോഗിക്കുന്നതിനുള്ള പൊതുവായ നിയമങ്ങളും നിബന്ധനകളും വായിച്ചറിയുക. Please read these terms and conditions carefully before using our platform.
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
                  className="flex items-center gap-3 font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 text-sm p-3.5 rounded-xl transition-all"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>Privacy Policy (സ്വകാര്യതാ നയം)</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-3 font-bold text-sm p-3.5 rounded-xl transition-all bg-emerald-50 text-emerald-800 border border-emerald-100"
                >
                  <FileText className="w-4 h-4 text-emerald-700" />
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
                ഞങ്ങളുടെ സേവന നിബന്ധനകളെക്കുറിച്ച് എന്തെങ്കിലും സംശയങ്ങളുണ്ടെങ്കിൽ ബന്ധപ്പെടുക:
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
              
              {/* Acceptance of Terms */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  1. കരാർ അംഗീകാരം (Acceptance of Terms)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    മരുന്നുണ്ടോ.in വെബ്‌സൈറ്റോ മൊബൈൽ വെബ് ആപ്ലിക്കേഷനോ ഉപയോഗിക്കുന്നതിലൂടെ, നിങ്ങൾ ഈ സേവന നിബന്ധനകൾ പൂർണ്ണമായും അംഗീകരിക്കുന്നതായി കണക്കാക്കുന്നു. നിങ്ങൾ ഇവ അംഗീകരിക്കുന്നില്ലെങ്കിൽ പ്ലാറ്റ്‌ഫോം ഉപയോഗിക്കരുത്.
                  </p>
                  <p className="text-slate-500 font-sans italic">
                    By accessing or using Marunnundo.in, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you are requested to cease using our platform immediately.
                  </p>
                </div>
              </section>

              {/* Nature of Service */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-emerald-600" />
                  2. പ്ലാറ്റ്‌ഫോം സ്വഭാവം (Nature of Platform & Service Disclaimer)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p className="font-semibold text-slate-900">
                    ദയവായി ശ്രദ്ധിക്കുക (Please Read Critically):
                  </p>
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl text-xs sm:text-sm text-amber-900 leading-relaxed flex flex-col gap-2">
                    <p>
                      <strong>മരുന്നുണ്ടോ.in ഒരു മെഡിക്കൽ ഡിസ്പെൻസറിയോ ഔഷധ വിൽപ്പനശാലയോ അല്ല.</strong> ഞങ്ങൾ ഉപയോക്താക്കൾക്ക് സമീപമുള്ള വെരിഫൈഡ് ആയ ലൈസൻസുള്ള ഫാർമസികളെ കണ്ടെത്താനും അവയിലുള്ള സ്റ്റോക്ക് പരിശോധിക്കാനുമുള്ള ഒരു <strong>തിരച്ചിൽ പ്ലാറ്റ്‌ഫോം (Discovery Tool)</strong> മാത്രമാണ്.
                    </p>
                    <p className="font-sans italic">
                      Marunnundo.in is not a pharmacy or an online pharmaceutical store. We do NOT sell or dispense medicines directly. We are a search and discovery platform helping users connect with nearby licensed physical pharmacies in Kerala.
                    </p>
                  </div>
                  <ul className="list-disc pl-5 mt-2 flex flex-col gap-2 text-slate-600 text-xs sm:text-sm">
                    <li>മരുന്നുകളുടെ വില, ലഭ്യത, ഫോട്ടോകൾ എന്നിവ അതത് ഫാർമസി ഉടമകളാണ് അപ്‌ലോഡ് ചെയ്യുന്നത്. അതിലെ കൃത്യതയ്ക്ക് മരുന്നുണ്ടോ.in നേരിട്ട് ഉത്തരവാദിയല്ല.</li>
                    <li>ഡോക്ടറുടെ കുറിപ്പടി (Valid Prescription) ആവശ്യമുള്ള മരുന്നുകൾ വാങ്ങാൻ യഥാർത്ഥ കുറിപ്പടി തന്നെ ഫാർമസിയിൽ നേരിട്ട് ഹാജരാക്കേണ്ടതാണ്.</li>
                  </ul>
                </div>
              </section>

              {/* User Conduct */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-emerald-600" />
                  3. ഉപയോക്താക്കളുടെ ഉത്തരവാദിത്തങ്ങൾ (User Responsibilities)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                    <li>ഉപയോക്താക്കൾ തെറ്റായ വിവരങ്ങളോ മറ്റുള്ളവരെ അപകീർത്തിപ്പെടുത്തുന്ന തരത്തിലുള്ള വ്യാജ റിവ്യൂകളോ പ്ലാറ്റ്‌ഫോമിൽ പോസ്റ്റ് ചെയ്യരുത്.</li>
                    <li>സിസ്റ്റം അനാവശ്യമായി സ്ക്രാപ്പ് ചെയ്യാനോ (Data Scraping), സുരക്ഷ തകർക്കാനോ ഉള്ള ശ്രമങ്ങൾ പാടില്ല.</li>
                    <li>പ്ലാറ്റ്‌ഫോമിൽ ലഭ്യമായ ഫോൺ നമ്പറുകളിലേക്ക് ആവശ്യമില്ലാത്ത സന്ദേശങ്ങളോ സ്പാമോ അയക്കരുത്.</li>
                  </ul>
                </div>
              </section>

              {/* Owner Conduct */}
              <section className="flex flex-col gap-4">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  4. ഫാർമസി ഉടമസ്ഥരുടെ വ്യവസ്ഥകൾ (Pharmacy Owner Rules)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    മരുന്നുണ്ടോ.in-ൽ ഫാർമസി രജിസ്റ്റർ ചെയ്യുന്ന ഉടമസ്ഥർ താഴെ പറയുന്നവ കർശനമായി പാലിക്കേണ്ടതാണ്:
                  </p>
                  <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                    <li><strong>ലൈസൻസ് സ്ഥിരീകരണം:</strong> സർക്കാർ നിയമാനുസൃതമായ ഡ്രഗ് ലൈസൻസ് നമ്പർ (Drug License Form 20/21) കൃത്യമായി നൽകേണ്ടതാണ്. വ്യാജ ലൈസൻസുകൾ നൽകിയാൽ അക്കൗണ്ട് അപ്പോൾ തന്നെ സസ്പെൻഡ് ചെയ്യുന്നതായിരിക്കും.</li>
                    <li><strong>മരുന്ന് വിവരങ്ങൾ:</strong> കാലഹരണപ്പെട്ട (Expired) മരുന്നുകളോ, സർക്കാർ നിരോധിച്ച മരുന്നുകളോ പ്ലാറ്റ്‌ഫോമിൽ പ്രദർശിപ്പിക്കരുത്.</li>
                    <li><strong>പ്രത്യേക മരുന്നുകൾ:</strong> ഡോക്ടറുടെ കുറിപ്പടി ആവശ്യമുള്ള മരുന്നുകൾക്ക് `prescriptionRequired` ടോഗിൾ ഓൺ ചെയ്യേണ്ടതാണ്.</li>
                  </ul>
                </div>
              </section>

              {/* Disclaimer and Limitations */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-emerald-600" />
                  5. പരിധികളും ബാധ്യതകളും (Disclaimers & Limitation of Liability)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    പ്ലാറ്റ്‌ഫോമിലെ വിവരങ്ങൾ "As Is" (ലഭ്യമായ രീതിയിൽ) ആണ് നൽകുന്നത്. മരുന്നുകളുടെ തത്സമയ സ്റ്റോക്ക് വ്യത്യാസപ്പെട്ടേക്കാം എന്നതിനാൽ, അത് ഉറപ്പുവരുത്താൻ ഉപയോക്താക്കൾ നേരിട്ട് ഫാർമസിയുമായി ഫോൺ വഴിയോ അല്ലാതെയോ ബന്ധപ്പെടാൻ ഉപദേശിക്കുന്നു. മരുന്ന് മാറി നൽകുകയോ തെറ്റായ വില ഈടാക്കുകയോ ചെയ്യുന്ന തരത്തിലുള്ള ഫാർമസി ഇടപാടുകളിൽ മരുന്നുണ്ടോ.in യാതൊരു ബാധ്യതയും വഹിക്കുന്നില്ല.
                  </p>
                  <p className="text-slate-500 font-sans italic">
                    The platform is provided on an "as-is" and "as-available" basis. In no event shall Marunnundo.in or its developers be held liable for any inaccuracies, discrepancies in stock/pricing, or medical complications arising out of medicines acquired from independent pharmacies found through this search application.
                  </p>
                </div>
              </section>

              {/* Governing Law */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-emerald-600" />
                  6. നിയമപരമായ അധികാരം (Governing Law & Jurisdiction)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    ഈ സേവന നിബന്ധനകൾ ഇന്ത്യൻ നിയമവ്യവസ്ഥയ്ക്ക് വിധേയമാണ്. ഈ സേവനവുമായി ബന്ധപ്പെട്ട് ഉണ്ടാകുന്ന എന്തെങ്കിലും തർക്കങ്ങൾ എറണാകുളം (കേരളം) കോടതികളുടെ അധികാരപരിധിയിലായിരിക്കും പരിഹരിക്കപ്പെടുക.
                  </p>
                </div>
              </section>

              {/* Termination */}
              <section className="flex flex-col gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-emerald-600" />
                  7. അക്കൗണ്ടുകൾ നിർത്തലാക്കൽ (Account Termination)
                </h2>
                <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                  <p>
                    ഈ നിബന്ധനകൾ ലംഘിക്കുന്ന ഏതൊരു ഉപയോക്താവിൻറെയോ ഫാർമസിസ്റ്റിന്റെയോ അക്കൗണ്ടുകൾ മുൻകൂട്ടി അറിയിക്കാതെ സസ്പെൻഡ് ചെയ്യാനോ റദ്ദാക്കാനോ ഉള്ള പൂർണ്ണ അധികാരം മരുന്നുണ്ടോ.in അഡ്മിന് ഉണ്ടായിരിക്കുന്നതാണ്.
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
