'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_KEY = 'admin_authenticated';

/**
 * AdminAuthGuard
 * ──────────────
 * Wraps admin layout content in demo/offline mode.
 * Reads sessionStorage to decide if the passcode was already entered.
 * Redirects to /admin-login if not, renders children if yes.
 */
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authenticated = sessionStorage.getItem(SESSION_KEY) === 'true';
    if (!authenticated) {
      router.replace('/admin-login');
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    // Subtle loading state while checking sessionStorage
    return (
      <div className="min-h-screen bg-[#061A10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-400/30 border-t-emerald-400 animate-spin" />
          <span className="text-emerald-300/50 text-xs">Verifying access…</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
