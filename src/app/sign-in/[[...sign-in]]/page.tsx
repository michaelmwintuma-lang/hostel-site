'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin-login');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-3 text-white text-xs">
        <div className="h-7 w-7 rounded-full border-2 border-[#E03B0D]/30 border-t-[#E03B0D] animate-spin" />
        <span>Redirecting to sign-in…</span>
      </div>
    </div>
  );
}
