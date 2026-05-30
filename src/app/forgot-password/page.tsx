'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Key, Lock, AlertCircle, ArrowRight, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { sendForgotPasswordOTP, verifyForgotPasswordOTP, resetPassword } from '@/app/actions/auth';
import confetti from 'canvas-confetti';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const isMl = language === 'ml';

  // Step states: 1 = Email entry, 2 = OTP verification, 3 = Reset Password
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [verifiedToken, setVerifiedToken] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Refs for 6-digit OTP fields
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Bilingual strings
  const strings = {
    title: isMl ? 'പാസ്‌വേഡ് മാറ്റുക' : 'Forgot Password',
    subtitle: isMl ? 'നിങ്ങളുടെ ഫാർമസി അക്കൗണ്ട് പാസ്‌വേഡ് വീണ്ടെടുക്കുക' : 'Retrieve your pharmacy account password',
    step1Title: isMl ? 'ഇമെയിൽ സ്ഥിരീകരിക്കുക' : 'Verify Email Address',
    step1Desc: isMl ? 'അക്കൗണ്ടുമായി ബന്ധിപ്പിച്ച ഇമെയിൽ നൽകുക. ഞങ്ങൾ ഒരു OTP കോഡ് അയക്കുന്നതാണ്.' : 'Enter your registered email address to receive a 6-digit verification code.',
    step2Title: isMl ? 'വെരിഫിക്കേഷൻ കോഡ്' : 'Enter Verification Code',
    step2Desc: isMl ? `${email} എന്ന മെയിലിലേക്ക് അയച്ച 6 അക്ക കോഡ് ഇവിടെ നൽകുക.` : `We have sent a 6-digit code to ${email}.`,
    step3Title: isMl ? 'പുതിയ പാസ്‌വേഡ്' : 'Create New Password',
    step3Desc: isMl ? 'നിങ്ങളുടെ അക്കൗണ്ടിനായി പുതിയൊരു പാസ്‌വേഡ് നിർമ്മിച്ച് സ്ഥിരീകരിക്കുക.' : 'Enter and confirm a strong new password for your account.',
    emailLabel: isMl ? 'ഇമെയിൽ വിലാസം' : 'Email Address',
    otpLabel: isMl ? '6-അക്ക വെരിഫിക്കേഷൻ കോഡ്' : '6-Digit Verification Code',
    passwordLabel: isMl ? 'പുതിയ പാസ്‌വേഡ്' : 'New Password',
    confirmPasswordLabel: isMl ? 'പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക' : 'Confirm Password',
    verifyBtn: isMl ? 'സ്ഥിരീകരിക്കുക' : 'Verify Email',
    submitOtpBtn: isMl ? 'കോഡ് പരിശോധിക്കുക' : 'Verify OTP',
    changePasswordBtn: isMl ? 'പാസ്‌വേഡ് മാറ്റുക' : 'Change Password',
    processing: isMl ? 'പ്രോസസ്സ് ചെയ്യുന്നു...' : 'Processing...',
    successReset: isMl ? 'പാസ്‌വേഡ് വിജയകരമായി മാറ്റിയിരിക്കുന്നു! ലോഗിൻ പേജിലേക്ക് റീഡയറക്ട് ചെയ്യുന്നു...' : 'Password reset successful! Redirecting to login page...',
    backToLogin: isMl ? 'ലോഗിൻ പേജിലേക്ക് മടങ്ങുക' : 'Back to Login',
    mismatchError: isMl ? 'പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല!' : 'Passwords do not match!',
    minCharError: isMl ? 'പാസ്‌വേഡിന് കുറഞ്ഞത് 6 അക്ഷരങ്ങൾ വേണം!' : 'Password must be at least 6 characters long!',
    otpLengthError: isMl ? 'ദയവായി 6 അക്ക കോഡും നൽകുക!' : 'Please enter the complete 6-digit OTP code!',
    resendPrompt: isMl ? 'കോഡ് ലഭിച്ചില്ലേ?' : "Didn't receive the code?",
    resendBtn: isMl ? 'വീണ്ടും അയക്കുക' : 'Resend OTP',
  };

  // Trigger confetti celebration on final step success
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setIsLoading(true);

    try {
      const res = await sendForgotPasswordOTP(email);
      if (res.success) {
        setResetToken(res.resetToken || '');
        setStep(2);
      } else {
        setError(res.error || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP Verification transitions to Step 3
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const joinedOtp = otpValues.join('');
    if (joinedOtp.length < 6) {
      setError(strings.otpLengthError);
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      const res = await verifyForgotPasswordOTP(resetToken, joinedOtp);
      if (res.success) {
        setVerifiedToken(res.verifiedToken || '');
        setStep(3);
      } else {
        setError(res.error || 'Invalid OTP code.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Change Password & Update Database
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(strings.minCharError);
      return;
    }
    if (password !== confirmPassword) {
      setError(strings.mismatchError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await resetPassword(verifiedToken, password);
      
      if (res.success) {
        setSuccess(strings.successReset);
        triggerConfetti();
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(res.error || 'Failed to reset password.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP handler inside Step 2
  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    setOtpValues(['', '', '', '', '', '']);
    
    try {
      const res = await sendForgotPasswordOTP(email);
      if (res.success) {
        setResetToken(res.resetToken || '');
        setSuccess(isMl ? 'വെരിഫിക്കേഷൻ കോഡ് വീണ്ടും അയച്ചിട്ടുണ്ട്!' : 'Verification code resent successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(res.error || 'Failed to resend OTP.');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP field handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.slice(-6).split('');
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        if (digits[i]) {
          newOtp[i] = digits[i];
        }
      }
      setOtpValues(newOtp);
      const nextIdx = Math.min(digits.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }

    if (/^\d*$/.test(value)) {
      const newOtp = [...otpValues];
      newOtp[index] = value;
      setOtpValues(newOtp);

      if (value !== '' && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpValues[index] === '' && index > 0) {
        const newOtp = [...otpValues];
        newOtp[index - 1] = '';
        setOtpValues(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otpValues];
        newOtp[index] = '';
        setOtpValues(newOtp);
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpValues(digits);
      inputRefs.current[5]?.focus();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-tr from-emerald-50/50 via-slate-50 to-blue-50/50">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md glass-card rounded-3xl p-8 border border-slate-200/80 shadow-2xl relative bg-white/80 backdrop-blur-xl">
        
        {/* Branding header */}
        <div className="flex flex-col items-center gap-3 text-center mb-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200 bg-white flex items-center justify-center border border-slate-100 p-1">
              <img src="/logo.png" alt="Marunnundo Logo" className="w-full h-full object-contain" />
            </div>
          </Link>
          <div className="flex flex-col mt-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {strings.title}
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-bold uppercase tracking-wider">
              {strings.subtitle}
            </p>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step >= 1 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-400'
            }`}>
              1
            </div>
            <span className={`text-xs font-bold ${step >= 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isMl ? 'മെയിൽ' : 'Email'}
            </span>
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-slate-100 relative">
            <div className={`absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500 ${
              step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'
            }`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step >= 2 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-400'
            }`}>
              2
            </div>
            <span className={`text-xs font-bold ${step >= 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isMl ? 'ഒടിപി' : 'OTP'}
            </span>
          </div>
          <div className="flex-1 h-0.5 mx-2 bg-slate-100 relative">
            <div className={`absolute inset-y-0 left-0 bg-emerald-500 transition-all duration-500 ${
              step === 3 ? 'w-full' : 'w-0'
            }`} />
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              step === 3 ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' : 'bg-slate-100 text-slate-400'
            }`}>
              3
            </div>
            <span className={`text-xs font-bold ${step === 3 ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isMl ? 'റീസെറ്റ്' : 'Reset'}
            </span>
          </div>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* MULTI-STEP FORMS */}

        {/* Step 1: Email Entry */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="flex flex-col gap-5">
            <div className="text-slate-600 text-xs leading-relaxed mb-1">
              {strings.step1Desc}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {strings.emailLabel}
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white disabled:opacity-50"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{isLoading ? strings.processing : strings.verifyBtn}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* Step 2: 6-Digit OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="flex flex-col gap-5">
            <div className="text-slate-600 text-xs leading-relaxed mb-1">
              {strings.step2Desc}
            </div>

            <div className="flex flex-col gap-2.5 items-center">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest self-start mb-1">
                {strings.otpLabel}
              </label>
              
              {/* Individual Digit Input Boxes */}
              <div className="flex gap-2.5 justify-center w-full">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    className="w-12 h-14 text-center text-xl font-bold text-slate-800 bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl outline-none transition-all"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{strings.submitOtpBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isMl ? 'ഇമെയിൽ മാറ്റുക' : 'Change Email'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">{strings.resendPrompt}</span>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline disabled:opacity-50"
                  >
                    {strings.resendBtn}
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Step 3: Password Reset */}
        {step === 3 && (
          <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
            <div className="text-slate-600 text-xs leading-relaxed mb-1">
              {strings.step3Desc}
            </div>

            {/* New Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {strings.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white disabled:opacity-50"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-widest">
                {strings.confirmPasswordLabel}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-white disabled:opacity-50"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/10 active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{isLoading ? strings.processing : strings.changePasswordBtn}</span>
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}

        {/* Footer links */}
        <div className="mt-8 border-t border-slate-100 pt-6 text-center">
          <Link
            href="/login"
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center justify-center gap-1 w-full"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{strings.backToLogin}</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
