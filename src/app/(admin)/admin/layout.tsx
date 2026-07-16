import Link from 'next/link';
import { getAuthUser } from '@/lib/auth-compat';
import { UserButton } from '@clerk/nextjs';
import React from 'react';
import AppLogo from '@/components/AppLogo';
import AdminSidebar from './AdminSidebar';

const ShieldAlertIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.25 6.84 22.15 12 23.5C17.16 22.15 21 17.25 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16" r="0.8" fill="currentColor" />
  </svg>
);

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  // Not signed in at all → redirect to admin login
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-slate-200 bg-white rounded-2xl p-8 space-y-6 text-center text-slate-800 shadow-md">
          <ShieldAlertIcon className="h-14 w-14 text-amber-500 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Sign In Required</h1>
            <p className="text-slate-600 text-xs leading-relaxed">
              You must be signed in with an admin account to access these dashboards.
            </p>
          </div>
          <Link
            href="/admin-login"
            className="block w-full bg-[#E03B0D] text-white font-semibold text-xs rounded-full py-2.5 hover:bg-[#A12808] text-center"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  // Signed in but not admin → show access denied
  const userRole = user?.publicMetadata?.role || '';
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const isAdmin = userRole === 'admin' || userEmail === 'xtracityhostels@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-slate-200 bg-white rounded-2xl p-8 space-y-6 text-center text-slate-800 shadow-md">
          <ShieldAlertIcon className="h-14 w-14 text-amber-500 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-xl font-bold">Admin Portal Access Restricted</h1>
            <p className="text-slate-600 text-xs leading-relaxed">
              Your account <span className="font-bold text-slate-900">{user.emailAddresses[0]?.emailAddress}</span> lacks the administrative privileges required to view these dashboards.
            </p>
          </div>
          <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-xl text-left text-[11px] text-slate-700 leading-relaxed">
            <span className="font-bold text-amber-600 block mb-0.5">Setup Note</span>
            Go to your Clerk Dashboard → Users → select your account → Public Metadata → set <code className="text-[#E03B0D]">{"{ \"role\": \"admin\" }"}</code>.
          </div>
          <Link
            href="/"
            className="block w-full bg-[#E03B0D] text-white font-semibold text-xs rounded-full py-2.5 hover:bg-[#A12808] text-center"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // ── Shared sidebar layout shell (used in both demo and Clerk-authenticated modes) ──
  let firstName = user?.firstName;
  let lastName = user?.lastName;

  if (userEmail === 'xtracityhostels@gmail.com') {
    firstName = 'Mr. Bismark';
    lastName = 'Ofosu';
  }

  const shell = (content: React.ReactNode) => (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-slate-800">
      <AdminSidebar userFirstName={firstName} userLastName={lastName} />

      {/* 2. Main content viewport */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full space-y-10">
        {content}
      </main>
    </div>
  );
  // Clerk-authenticated admin — render the dashboard
  return shell(children);
}
