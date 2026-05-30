'use client';

import Link from 'next/link';
import { Shield, Eye, Lock, FileText, ArrowRight, Award, CheckCircle2, ShieldAlert, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function PharmacyLicensePolicyClient() {
  const { language } = useLanguage();

  return (
    <div className="flex-1 bg-slate-50/50 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 mb-10 border border-emerald-100/80 shadow-xl shadow-emerald-900/5 relative overflow-hidden text-center sm:text-left">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/30 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {language === 'ml' ? (
                  <>ഫാർമസി ലൈസൻസ് നയം <span className="text-emerald-600 font-sans">(Pharmacy License Policy)</span></>
                ) : (
                  <>Pharmacy License Policy</>
                )}
              </h1>
              <p className="text-slate-600 font-medium mt-2 max-w-2xl text-sm sm:text-base">
                {language === 'ml' ? (
                  "കേരളത്തിലെ ഡ്രഗ് കൺട്രോൾ ഡിപ്പാർട്ട്മെന്റ് നിയമങ്ങൾക്ക് അനുസൃതമായുള്ള വിവര ശേഖരണ നയങ്ങൾ. Guidelines for verified pharmaceutical license listings on Marunnundo.in."
                ) : (
                  "Guidelines for verified pharmaceutical license listings on Marunnundo.in matching Kerala state law."
                )}
              </p>
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-3">
                {language === 'ml' ? "അവസാനം പുതുക്കിയത്: മെയ് 2026" : "Last Updated: May 2026"}
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
                {language === 'ml' ? "നിയമ വ്യവസ്ഥകൾ" : "Legal Directory"}
              </h3>
              <nav className="flex flex-col gap-2">
                <Link
                  href="/privacy"
                  className="flex items-center gap-3 font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 text-sm p-3.5 rounded-xl transition-all"
                >
                  <Lock className="w-4 h-4 text-slate-400" />
                  <span>{language === 'ml' ? "Privacy Policy (സ്വകാര്യതാ നയം)" : "Privacy Policy"}</span>
                </Link>
                <Link
                  href="/terms"
                  className="flex items-center gap-3 font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 text-sm p-3.5 rounded-xl transition-all"
                >
                  <FileText className="w-4 h-4 text-slate-400" />
                  <span>{language === 'ml' ? "Terms of Service (സേവന നിബന്ധനകൾ)" : "Terms of Service"}</span>
                </Link>
                <Link
                  href="/pharmacy-license-policy"
                  className="flex items-center gap-3 font-bold text-sm p-3.5 rounded-xl transition-all bg-emerald-50 text-emerald-800 border border-emerald-100"
                >
                  <Shield className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ml' ? "Pharmacy License Policy (ലൈസൻസ് നയം)" : "Pharmacy License Policy"}</span>
                </Link>
              </nav>
            </div>
            
            {/* Quick Contact Card */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200/80 shadow-md bg-slate-900 text-slate-400">
              <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-3">
                {language === 'ml' ? "സംശയങ്ങൾ ഉണ്ടോ? (Have Questions?)" : "Have Questions?"}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {language === 'ml' ? (
                  "ഞങ്ങളുടെ ഫാർമസി ലൈസൻസ് നയത്തെക്കുറിച്ച് എന്തെങ്കിലും സംശയങ്ങളുണ്ടെങ്കിൽ ബന്ധപ്പെടുക:"
                ) : (
                  "If you have any questions about our Pharmacy License Policy, please contact us:"
                )}
              </p>
              <ul className="flex flex-col gap-3 text-xs">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>marunnundo.in@gmail.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 79027 65146</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ml' ? "എറണാകുളം, കേരളം, ഇന്ത്യ" : "Ernakulam, Kerala, India"}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Content Pane */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col gap-8 text-slate-700">
              
              {language === 'ml' ? (
                <>
                  {/* Regulatory Compliance */}
                  <section className="flex flex-col gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      1. സർക്കാർ നിയമങ്ങളുമായുള്ള പൊരുത്തം (Regulatory Framework)
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        മരുന്നുണ്ടോ.in ഇന്ത്യയിലെ 1940-ലെ <strong>ഡ്രഗ്‌സ് ആൻഡ് കോസ്‌മെറ്റിക്‌സ് ആക്റ്റിനും (Drugs and Cosmetics Act, 1940)</strong> അതിന് കീഴിലുള്ള ചട്ടങ്ങൾക്കും വിധേയമായാണ് പ്രവർത്തിക്കുന്നത്. ഔദ്യോഗികമായി ഡ്രഗ് ലൈസൻസ് ഇല്ലാത്ത സ്ഥാപനങ്ങൾ ഈ വെബ്‌സൈറ്റിൽ ലിസ്റ്റ് ചെയ്യാൻ അനുവദിക്കില്ല.
                      </p>
                      <p className="text-slate-500 font-sans italic">
                        Marunnundo.in fully aligns with the Drugs and Cosmetics Act, 1940 and Drugs and Cosmetics Rules, 1945 governed by the Drugs Control Department of India and the Government of Kerala. We mandate strictly verified drug licenses for all registered entities.
                      </p>
                    </div>
                  </section>

                  {/* Mandatory Verification Process */}
                  <section className="flex flex-col gap-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      2. ഫാർമസി വെരിഫിക്കേഷൻ നടപടികൾ (Mandatory Verification Process)
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        ഒരു ഫാർമസി ഉടമ ഞങ്ങളുടെ സിസ്റ്റത്തിൽ അക്കൗണ്ട് തുറക്കുമ്പോൾ, താഴെ പറയുന്ന ഘട്ടങ്ങളിലൂടെ കടന്നുപോകണം:
                      </p>
                      
                      <div className="flex flex-col gap-3.5 my-2">
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm flex-shrink-0">1</div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <strong>ലൈസൻസ് നമ്പർ രേഖപ്പെടുത്തുക:</strong> ഡ്രഗ്സ് കൺട്രോൾ അതോറിറ്റി നൽകിയ യഥാർത്ഥ റീട്ടെയിൽ ഡ്രഗ് ലൈസൻസ് നമ്പർ (Form 20/21) ഫാർമസി പ്രൊഫൈലിൽ അപ്‌ലോഡ് ചെയ്യേണ്ടതാണ്.
                          </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm flex-shrink-0">2</div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <strong>അഡ്മിൻ പരിശോധന:</strong> നിങ്ങൾ സമർപ്പിച്ച ലൈസൻസ് നമ്പർ അഡ്മിൻ പാനലിൽ പരിശോധിക്കുകയും സ്റ്റേറ്റ് ഡ്രഗ് കൺട്രോളറുടെ വിവരങ്ങളുമായി ഒത്തുനോക്കുകയും ചെയ്യുന്നു.
                          </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm flex-shrink-0">3</div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <strong>സ്ഥിരീകരണം (Verification Status):</strong> പരിശോധന പൂർത്തിയായാൽ മാത്രമേ പ്രൊഫൈൽ വെരിഫൈഡ് ആയി മാറുകയും (`isVerified: true`) മരുന്നുകൾ പൊതുജനങ്ങൾക്കായി കാണിക്കുകയും ചെയ്യുകയുള്ളൂ.
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Prescription Requirements */}
                  <section className="flex flex-col gap-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-emerald-600" />
                      3. കുറിപ്പടിയുള്ള മരുന്നുകൾ (Prescription Medicines Compliance)
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        ഷെഡ്യൂൾ എച്ച്, എച്ച് 1 (Schedule H & H1), ഷെഡ്യൂൾ എക്സ് (Schedule X) വിഭാഗത്തിൽപ്പെടുന്ന മരുന്നുകൾ പരസ്യപ്പെടുത്തുമ്പോഴും പ്രദർശിപ്പിക്കുമ്പോഴും പ്രത്യേക വ്യവസ്ഥകൾ ബാധകമാണ്:
                      </p>
                      <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600 text-xs sm:text-sm">
                        <li><strong>prescriptionRequired ലേബൽ:</strong> കുറിപ്പടിയില്ലാതെ വിൽക്കാൻ പാടില്ലാത്ത എല്ലാ മരുന്നുകൾക്കും പ്രൊഫൈലിൽ ഈ ടോഗിൾ ഓൺ ചെയ്തിട്ടുണ്ടെന്ന് ഫാർമസിസ്റ്റുകൾ ഉറപ്പാക്കേണ്ടതാണ്.</li>
                        <li><strong>യഥാർത്ഥ കുറിപ്പടി നിർബന്ധം:</strong> ഉപയോക്താക്കൾ മരുന്ന് വാങ്ങാൻ ഫാർമസിയിൽ നേരിട്ടെത്തുമ്പോൾ യോഗ്യതയുള്ള രജിസ്റ്റേർഡ് ഡോക്ടർ ഒപ്പിട്ട യഥാർത്ഥ പ്രിസ്‌ക്രിപ്ഷൻ തന്നെ സമർപ്പിക്കണം. അത് പരിശോധിക്കാതെ ഒരു ഫാർമസിയും മരുന്നുകൾ വിതരണം ചെയ്യാൻ പാടുള്ളതല്ല.</li>
                        <li><strong>ഷെഡ്യൂൾ എക്സ് (Schedule X):</strong> നർക്കോട്ടിക് വിഭാഗത്തിൽപ്പെടുന്ന കടുത്ത മരുന്നുകൾ ലിസ്റ്റ് ചെയ്യാൻ അനുവദിക്കുന്നതല്ല.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Suspensions */}
                  <section className="flex flex-col gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-emerald-600" />
                      4. കടുത്ത ശിക്ഷാനടപടികൾ (Suspension & Penalties)
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>താഴെ പറയുന്ന സാഹചര്യങ്ങളിൽ നിങ്ങളുടെ ഫാർമസി അക്കൗണ്ട് അടിയന്തിരമായി സസ്പെൻഡ് ചെയ്യുന്നതാണ് (`isSuspended: true`):</p>
                      <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                        <li>ഡ്രഗ് ലൈസൻസ് കാലാവധി കഴിയുകയോ റദ്ദാക്കുകയോ ചെയ്യുമ്പോൾ.</li>
                        <li>നിരോധിതമോ വ്യാജമോ ആയ മരുന്നുകൾ ഇൻവെന്ററിയിൽ ചേർത്തതായി തെളിഞ്ഞാൽ.</li>
                        <li>കൃത്യമല്ലാത്ത ഡ്രഗ് ലൈസൻസ് നമ്പർ സമർപ്പിച്ചതായി കണ്ടെത്തിയാൽ.</li>
                        <li>പ്രിസ്‌ക്രിപ്ഷൻ ആവശ്യമുള്ള മരുന്നുകൾ നിയമവിരുദ്ധമായി നൽകാൻ പ്ലാറ്റ്‌ഫോം ഉപയോഗിച്ചാൽ.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Verified Badge Disclaimer */}
                  <section className="flex flex-col gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      5. വെരിഫൈഡ് ബാഡ്ജ് ഡിസ്‌ക്ലൈമർ (Verified Badge Disclaimer)
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        ഫാർമസി പ്രൊഫൈലിനൊപ്പം കാണിക്കുന്ന "Verified" ബാഡ്ജ് അർത്ഥമാക്കുന്നത് അവർ സമർപ്പിച്ച ഡ്രഗ് ലൈസൻസ് വിവരങ്ങൾ സിസ്റ്റം പരിശോധിച്ചതാണെന്ന് മാത്രമാണ്. അതൊരു ഫാർമസിയിലെ സേവനത്തിന്റെയോ പ്രവർത്തനത്തിന്റെയോ ഗ്യാരണ്ടിയല്ല. ഉപയോക്താക്കൾ ഇടപാടുകൾ നടത്തുമ്പോൾ സ്വയമേവ ശ്രദ്ധിക്കേണ്ടതാണ്.
                      </p>
                      <p className="text-slate-500 font-sans italic">
                        The "Verified" badge displays confirmation that the store has uploaded a legitimate drug license certificate matching government parameters. It does not certify the daily operational practices of the individual pharmacies.
                      </p>
                    </div>
                  </section>
                </>
              ) : (
                <>
                  {/* Regulatory Compliance */}
                  <section className="flex flex-col gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      1. Regulatory Framework
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        Marunnundo.in fully aligns with the Drugs and Cosmetics Act, 1940 and corresponding rules governed by the Drugs Control Department of Kerala/India. We mandate strictly verified drug licenses for all listed entities; listing without an active license is strictly prohibited.
                      </p>
                    </div>
                  </section>

                  {/* Mandatory Verification Process */}
                  <section className="flex flex-col gap-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      2. Mandatory Verification Process
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        When a pharmacy owner registers an account on our platform, they must undergo the following strict verification steps:
                      </p>
                      
                      <div className="flex flex-col gap-3.5 my-2">
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm flex-shrink-0">1</div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <strong>Submit License Details:</strong> Upload the official retail drug license number (Form 20 or Form 21) issued by the Drugs Control Department into the merchant settings.
                          </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm flex-shrink-0">2</div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <strong>Admin Verification:</strong> Admin panel executives verify the license coordinates against the public portal directories of the State Drugs Control Department.
                          </div>
                        </div>
                        <div className="flex gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm flex-shrink-0">3</div>
                          <div className="flex-1 text-xs sm:text-sm">
                            <strong>Activation & Status:</strong> Only after verification does the pharmacy receive its green &apos;Verified&apos; badge, making its medicine inventory searchable for general patients.
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Prescription Requirements */}
                  <section className="flex flex-col gap-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-emerald-600" />
                      3. Prescription Medicines Compliance
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        Special rules apply for listing medicines under Schedule H, H1, and Schedule X categories:
                      </p>
                      <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600 text-xs sm:text-sm">
                        <li><strong>Prescription Toggle:</strong> Pharmacists must activate the `prescriptionRequired` tag for all prescription-only medicines.</li>
                        <li><strong>Counter Verification:</strong> Patients must present a physical, valid prescription signed by a registered medical practitioner at the pharmacy counter. No pharmacy shall dispense such medicines without physical inspection of the prescription.</li>
                        <li><strong>Schedule X Prohibition:</strong> Listings for highly restricted narcotic drugs under Schedule X are strictly banned on this directory tool.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Suspensions */}
                  <section className="flex flex-col gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <ShieldAlert className="w-5 h-5 text-emerald-600" />
                      4. Suspension & Penalties
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>A pharmacy account will be suspended immediately (`isSuspended: true`) under the following infractions:</p>
                      <ul className="list-disc pl-5 flex flex-col gap-2 text-slate-600">
                        <li>Expiry or cancellation of the official state drug license.</li>
                        <li>Listing banned, substandard, or spurious medicines in the inventory.</li>
                        <li>Providing an incorrect, expired, or fraudulent drug license number during registration.</li>
                        <li>Utilizing the platform to distribute prescription medicines in violation of the Drugs Act.</li>
                      </ul>
                    </div>
                  </section>

                  {/* Verified Badge Disclaimer */}
                  <section className="flex flex-col gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      5. Verified Badge Disclaimer
                    </h2>
                    <div className="text-sm sm:text-base leading-relaxed flex flex-col gap-3">
                      <p>
                        The &quot;Verified&quot; badge confirmed next to a pharmacy indicates that the platform verified their state drug license number. It is not an endorsement or warranty of their daily pharmaceutical services. Patients are advised to exercise reasonable caution during transactions.
                      </p>
                    </div>
                  </section>
                </>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
