'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, SignIn } from '@clerk/nextjs';
import AppLogo from '@/components/AppLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      const role = (user.publicMetadata as any)?.role;
      const email = user.emailAddresses?.[0]?.emailAddress;
      if (role === 'admin' || email === 'xtracityhostels@gmail.com') {
        router.replace('/admin');
      }
    }
  }, [isLoaded, user, router]);

  // If user is loaded and is already admin, show redirecting
  if (isLoaded && user) {
    const role = (user.publicMetadata as any)?.role;
    const email = user.emailAddresses?.[0]?.emailAddress;
    if (role === 'admin' || email === 'xtracityhostels@gmail.com') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#061A10] via-[#0D3D22] to-[#0a2d1a] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
            <span className="text-emerald-300/50 text-xs">Access granted. Redirecting…</span>
          </div>
        </div>
      );
    }

    // User is signed in but not admin
    if (role !== 'admin' && email !== 'xtracityhostels@gmail.com') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#061A10] via-[#0D3D22] to-[#0a2d1a] flex items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-700/15 rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 w-full max-w-sm">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center space-y-6"
              style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
              <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
                <div className="relative bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center justify-center space-x-3">
                  <AppLogo alt="Admin Portal" width={110} height={36} className="h-9 w-auto object-contain" />
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-sm text-white leading-tight">XTRACITY</span>
                    <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Executives</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 border border-red-400/30">
                  <svg viewBox="0 0 24 24" className="h-7 w-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L3 7V12C3 17.25 6.84 22.15 12 23.5C17.16 22.15 21 17.25 21 12V7L12 2Z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 9v4M12 16h.01" strokeLinecap="round" />
                  </svg>
                </div>
                <h1 className="text-white font-bold text-xl">Access Denied</h1>
                <p className="text-white/50 text-xs mt-2 leading-relaxed">
                  Your account <span className="text-emerald-300 font-semibold">{user.emailAddresses[0]?.emailAddress}</span> does not have administrator privileges.
                </p>
              </div>

              <a href="/" className="block w-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-full py-2.5 transition-all border border-white/10">
                ← Back to Homepage
              </a>
            </div>
          </div>
        </div>
      );
    }
  }

  // Not signed in — show Clerk sign-in form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#061A10] via-[#0D3D22] to-[#0a2d1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-emerald-700/15 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
            <div className="relative bg-white/10 border border-white/20 rounded-2xl p-3 flex items-center justify-center space-x-3">
              <AppLogo alt="Admin Portal" width={110} height={36} className="h-9 w-auto object-contain" />
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-sm text-white leading-tight">XTRACITY</span>
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest">Executives</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-white font-bold text-xl tracking-tight">Admin Portal</h1>
            <p className="text-emerald-300/70 text-xs mt-0.5">Sign in with your admin account</p>
          </div>
        </div>

        <div className="flex justify-center">
          <SignIn
            routing="hash"
            forceRedirectUrl="/admin"
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-0',
                formButtonPrimary: 'bg-[#E03B0D] hover:bg-[#A12808] text-white rounded-full',
              }
            }}
          />
        </div>

        <p className="text-center text-xs text-white/25 hover:text-white/50 transition-colors">
          <a href="/">← Back to public site</a>
        </p>
      </div>
    </div>
  );
}
