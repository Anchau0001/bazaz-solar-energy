import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  X,
  CheckCircle2,
  Mail,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect?: (role: 'admin' | 'staff') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirect
}) => {
  const { login } = useAuth();

  // Mode: login | forgot | verify-otp | reset-password
  const [viewMode, setViewMode] = useState<'login' | 'forgot' | 'verify-otp' | 'reset-password'>('login');

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Login form state
  const [username, setUsername] = useState(() => {
    try {
      return localStorage.getItem('bazaz_saved_username') || '';
    } catch {
      return '';
    }
  });
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    try {
      return localStorage.getItem('bazaz_remember_me') === 'true';
    } catch {
      return false;
    }
  });

  // Forgot & OTP state
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [dispatchedOtp, setDispatchedOtp] = useState<string | null>(null);
  const [copiedOtp, setCopiedOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // New password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Detect ?resetToken= in URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('resetToken');
      if (urlToken) {
        setResetToken(urlToken);
        setViewMode('reset-password');
      }
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      const user = await login(username.trim(), password.trim());

      try {
        localStorage.setItem('bazaz_has_logged_in', 'true');

        if (rememberMe) {
          localStorage.setItem('bazaz_saved_username', username.trim());
          localStorage.setItem('bazaz_remember_me', 'true');
        } else {
          localStorage.removeItem('bazaz_saved_username');
          localStorage.setItem('bazaz_remember_me', 'false');
        }
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      onClose();
      if (onSuccessRedirect) {
        onSuccessRedirect(user.role);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Forgot Password - Requests OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetEmail.trim()) {
      setErrorMsg('Please enter your registered staff or admin email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.forgotPassword(resetEmail.trim());
      setResetToken(res.token);
      setDispatchedOtp(res.otpCode);
      setResendCooldown(30);
      setOtpDigits(['', '', '', '', '', '']);
      setViewMode('verify-otp');
      setSuccessMsg(`6-digit OTP verification code sent to ${res.email}`);

      // Auto-focus first OTP digit box after render
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to dispatch OTP code. Please verify your email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];

    if (cleaned.length > 1) {
      // Pasted multi-digit string
      const pasted = cleaned.slice(0, 6).split('');
      pasted.forEach((d, i) => {
        if (i < 6) newDigits[i] = d;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    // Auto-advance to next box
    if (cleaned && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleAutoFillOtp = () => {
    if (dispatchedOtp && dispatchedOtp.length === 6) {
      setOtpDigits(dispatchedOtp.split(''));
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleCopyOtp = () => {
    if (dispatchedOtp) {
      navigator.clipboard.writeText(dispatchedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.verifyOtp({
        email: resetEmail.trim(),
        otpCode: fullCode
      });
      setResetToken(res.token);
      setSuccessMsg('OTP code verified successfully! Set your new password below.');
      setViewMode('reset-password');
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid or expired OTP verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reset Password Submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!resetToken) {
      setErrorMsg('Reset token is missing. Please request a new OTP code.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('The new passwords do not match. Please re-enter.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.resetPassword({
        token: resetToken,
        newPassword: newPassword.trim()
      });
      setSuccessMsg(res.message);
      if (res.username) {
        setUsername(res.username);
      }
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');

      // Clean URL if token was in query
      if (typeof window !== 'undefined' && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete('resetToken');
        window.history.replaceState({}, '', url.toString());
      }

      setTimeout(() => {
        setViewMode('login');
      }, 1600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearSavedLogin = () => {
    try {
      localStorage.removeItem('bazaz_saved_username');
      localStorage.setItem('bazaz_remember_me', 'false');
      setUsername('');
      setPassword('');
      setRememberMe(false);
      setSuccessMsg('Saved login details cleared.');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <img
            src="/logo.png"
            alt="Bazaz Solar Energy Logo"
            className="w-14 h-14 object-contain rounded-full bg-white p-1 mb-3 border-2 border-amber-400 shadow-md"
          />

          <h3 className="font-extrabold text-lg text-white font-serif">
            {viewMode === 'login' && 'Staff & Admin Access Portal'}
            {viewMode === 'forgot' && 'Reset Staff / Admin Password'}
            {viewMode === 'verify-otp' && 'Enter Verification OTP Code'}
            {viewMode === 'reset-password' && 'Set New Account Password'}
          </h3>
          <p className="text-xs text-emerald-200 mt-0.5">
            Bazaz Solar Energy & Electricity Material • Zaria
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Error Message Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* VIEW MODE 1: LOGIN */}
          {viewMode === 'login' && (
            <>
              {/* Saved Account Notice if Remembered */}
              {rememberMe && username ? (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs">
                  <span className="text-slate-600 truncate max-w-[210px]">
                    Saved account: <strong className="text-slate-800">{username}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleClearSavedLogin}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                  >
                    Clear / Switch
                  </button>
                </div>
              ) : null}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Username or Registered Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="admin@bazazsolar.ng or lawalumaranc@gmail.com"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password Input with Visibility Option (Eye Icon) */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* FORGOT PASSWORD BUTTON PLACED UNDER PASSWORD INPUT */}
                  <div className="flex justify-end pt-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setSuccessMsg('');
                        setResetEmail(username.includes('@') ? username : '');
                        setViewMode('forgot');
                      }}
                      className="text-emerald-800 hover:text-emerald-950 font-bold hover:underline text-[11px] transition"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Remember Login Details Checkbox */}
                <div className="pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-slate-300"
                    />
                    <span>Save my login details on this device</span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Authenticating...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Secure Sign In</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* VIEW MODE 2: FORGOT PASSWORD (REQUEST EMAIL) */}
          {viewMode === 'forgot' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Enter your registered administrator or staff email address. A 6-digit OTP verification code will be sent to your email to reset your password.
              </p>

              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. lawalumaranc@gmail.com"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? (
                      <span>Sending OTP Code...</span>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Send 6-Digit OTP Code</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setViewMode('login');
                    }}
                    className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* VIEW MODE 3: ENTER & VERIFY 6-DIGIT OTP */}
          {viewMode === 'verify-otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs animate-in fade-in">
              <div className="text-center space-y-1">
                <p className="text-slate-600">
                  We dispatched a 6-digit verification code to:
                </p>
                <p className="font-bold text-slate-900 text-sm">
                  {resetEmail}
                </p>
              </div>

              {/* Instant Delivery Preview Banner so user is never blocked */}
              {dispatchedOtp && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-2 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verification Code Dispatched:</span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-mono text-2xl font-black tracking-widest text-emerald-950 bg-white px-4 py-1.5 rounded-xl border border-emerald-300 shadow-2xs">
                      {dispatchedOtp}
                    </span>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-xs active:scale-95"
                    >
                      Fill Code
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Valid for 15 minutes. Check your inbox or use code above.
                  </p>
                </div>
              )}

              {/* 6 Digit Inputs */}
              <div>
                <label className="font-bold text-slate-700 block text-center mb-2">
                  Enter 6-Digit OTP Code
                </label>
                <div className="flex items-center justify-center gap-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => { otpInputRefs.current[idx] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:border-emerald-700 shadow-2xs transition"
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting || otpDigits.join('').length !== 6}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-amber-400" />
                      <span>Verify Code & Continue</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleRequestOtp}
                    disabled={resendCooldown > 0}
                    className="text-xs font-semibold text-emerald-800 hover:underline disabled:text-slate-400"
                  >
                    {resendCooldown > 0 ? `Resend Code (${resendCooldown}s)` : 'Resend Code'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setViewMode('login');
                    }}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 hover:underline flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* VIEW MODE 4: ENTER NEW PASSWORD (WITH EYE VISIBILITY ICONS) */}
          {viewMode === 'reset-password' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs animate-in fade-in">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs">
                Identity verified! Create your new account password below.
              </div>

              {/* New Password with Eye Icon */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter new password (min 4 characters)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition"
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password with Eye Icon */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 transition"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
                >
                  {isSubmitting ? (
                    <span>Updating Password...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span>Set New Password & Return to Sign In</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('');
                    setViewMode('login');
                  }}
                  className="w-full py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-center text-slate-400">
            Authorized personnel only. All logins and security actions are audited.
          </p>
        </div>
      </div>
    </div>
  );
};
