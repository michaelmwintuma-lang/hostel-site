'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk, SignOutButton } from '@clerk/nextjs';
import { Mail, ShieldCheck, ArrowRight, RefreshCw, AlertCircle, ArrowLeft, KeyRound } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import Link from 'next/link';

const AUTHORIZED_ADMIN_EMAIL = 'xtracityhostels@gmail.com';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const clerk = useClerk();

  const [email, setEmail] = useState(AUTHORIZED_ADMIN_EMAIL);
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [emailAddressId, setEmailAddressId] = useState<string | null>(null);

  const userRole = (user?.publicMetadata as any)?.role;
  const userEmail = (user?.emailAddresses?.[0]?.emailAddress || '').toLowerCase();
  const isAdmin = userEmail === AUTHORIZED_ADMIN_EMAIL || (userRole === 'admin' && userEmail === AUTHORIZED_ADMIN_EMAIL);

  // If already authenticated as authorized admin, go straight to dashboard
  useEffect(() => {
    if (userLoaded && user && isAdmin) {
      router.replace('/admin');
    }
  }, [userLoaded, user, isAdmin, router]);

  // 1. Send OTP code directly to xtracityhostels@gmail.com
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!clerk.loaded) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== AUTHORIZED_ADMIN_EMAIL) {
      setError(`Access denied. Only ${AUTHORIZED_ADMIN_EMAIL} is authorized for administration.`);
      return;
    }

    setError(null);
    setInfoMessage(null);
    setLoading(true);

    try {
      // Create sign-in attempt
      const response = await clerk.client.signIn.create({
        identifier: normalizedEmail,
      });

      // Find email_code first factor
      const emailCodeFactor = response.supportedFirstFactors?.find(
        (factor: any) => factor.strategy === 'email_code'
      ) as any;

      if (!emailCodeFactor || !emailCodeFactor.emailAddressId) {
        throw new Error('Email verification code is not configured for this account. Please verify with system administrator.');
      }

      setEmailAddressId(emailCodeFactor.emailAddressId);

      // Trigger dispatch of email code
      await clerk.client.signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId: emailCodeFactor.emailAddressId,
      });

      setStep('code');
      setInfoMessage(`A 6-digit verification code has been dispatched to ${normalizedEmail}.`);
    } catch (err: any) {
      console.error('Error initiating email sign-in:', err);
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Unable to send verification code. Please check email address.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Resend code
  const handleResendCode = async () => {
    if (!clerk.loaded || !emailAddressId) return;

    setError(null);
    setResending(true);

    try {
      await clerk.client.signIn.prepareFirstFactor({
        strategy: 'email_code',
        emailAddressId,
      });
      setInfoMessage('New verification code sent! Please check your inbox.');
    } catch (err: any) {
      const msg = err.errors?.[0]?.message || 'Failed to resend code. Please wait a moment.';
      setError(msg);
    } finally {
      setResending(false);
    }
  };

  // 3. Verify code and finalize session (No passwords)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerk.loaded || !code.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const cleanCode = code.trim().replace(/\s+/g, '');
      const result = await clerk.client.signIn.attemptFirstFactor({
        strategy: 'email_code',
        code: cleanCode,
      });

      if (result.status === 'complete') {
        await clerk.setActive({ session: result.createdSessionId });
        router.replace('/admin');
      } else {
        console.error('Incomplete sign-in:', result);
        setError('Verification status incomplete. Please check code or try again.');
      }
    } catch (err: any) {
      console.error('Verification error:', err);
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Incorrect verification code. Please verify the 6-digit code received in your email.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Loading state when authenticated
  if (userLoaded && user && isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-8 w-8 rounded-full border-2 border-slate-700 border-t-white animate-spin" />
          <span className="text-white text-sm font-medium">Access granted. Opening dashboard…</span>
        </div>
      </div>
    );
  }

  // Access Denied screen for logged-in non-admins
  if (userLoaded && user && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="relative z-10 max-w-md w-full bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-2xl text-center space-y-6 border border-slate-200 dark:border-zinc-800">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700">
            <AlertCircle className="h-6 w-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Access Restricted</h1>
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
              Account <strong className="text-slate-900 dark:text-zinc-100">{user.emailAddresses[0]?.emailAddress}</strong> is not authorized. Administration is restricted exclusively to <strong>{AUTHORIZED_ADMIN_EMAIL}</strong>.
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <SignOutButton redirectUrl="/admin-login">
              <button className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl py-3 shadow-sm cursor-pointer">
                Sign In as {AUTHORIZED_ADMIN_EMAIL}
              </button>
            </SignOutButton>
            <Link 
              href="/"
              className="block w-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-semibold text-xs rounded-xl py-3 text-center border border-slate-200 dark:border-zinc-700"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md space-y-5">
        {/* Card Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-3 bg-white/10 border border-white/20 px-4 py-2 rounded-xl shadow-sm">
            <AppLogo alt="Xtracity Admin" width={110} height={32} className="h-7 w-auto object-contain" />
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs text-white tracking-tight">XTRACITY</span>
              <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Administration</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Portal</h1>
          <p className="text-slate-400 text-xs">Direct passwordless verification code login</p>
        </div>

        {/* Security badge: Passwordless Email Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-2.5 text-xs text-white">
          <KeyRound className="h-4 w-4 text-slate-300 shrink-0" />
          <span className="text-xs text-slate-300 font-medium">
            Authentication method: <strong className="text-white">Email Code Only</strong>
          </span>
        </div>

        {/* Main Clean Container */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-red-700 dark:text-red-300 text-xs flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {infoMessage && (
            <div className="mb-5 p-3.5 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-700 dark:text-zinc-300 text-xs flex items-start space-x-2">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-slate-800 dark:text-zinc-200" />
              <span>{infoMessage}</span>
            </div>
          )}

          {step === 'email' ? (
            /* STEP 1: Exclusive Authorized Admin Email */
            <form onSubmit={handleSendCode} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="adminEmail" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                  <input
                    id="adminEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={AUTHORIZED_ADMIN_EMAIL}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-sm font-medium text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-zinc-100"
                  />
                </div>
              </div>

              {/* Authorized Account Badge */}
              <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 min-w-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate">
                    {AUTHORIZED_ADMIN_EMAIL}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  Authorized Admin
                </span>
              </div>

              <button
                type="submit"
                disabled={loading || !clerk.loaded}
                className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-sm cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Sending Code…</span>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Enter Code Received in xtracityhostels@gmail.com */
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="otpCode" className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                    6-Digit Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setCode('');
                      setError(null);
                    }}
                    className="text-[11px] text-slate-500 dark:text-zinc-400 cursor-pointer flex items-center gap-1"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                  </button>
                </div>
                
                <input
                  id="otpCode"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                  maxLength={8}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.3em] text-2xl font-bold py-3.5 bg-slate-50 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-zinc-100"
                />
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 text-center">
                  Sent to <strong className="text-slate-900 dark:text-zinc-200">{AUTHORIZED_ADMIN_EMAIL}</strong>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !code.trim()}
                className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow-sm cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Verifying Code…</span>
                ) : (
                  <>
                    <span>Verify & Enter Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resending}
                  className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>{resending ? 'Sending new code…' : 'Resend code to email'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Return to website link */}
        <p className="text-center text-xs text-slate-500">
          <Link href="/" className="text-slate-400">
            ← Return to public website
          </Link>
        </p>
      </div>
    </div>
  );
}
