'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import React from 'react';
import AdminSidebar from './AdminSidebar';

const ADMIN_EMAILS = [
  'xtracityhostels@gmail.com'
];

const ShieldAlertIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.25 6.84 22.15 12 23.5C17.16 22.15 21 17.25 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="16" r="0.8" fill="currentColor" />
  </svg>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();

  // 1. Loading state while Clerk initializes session in browser
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-slate-300 dark:border-zinc-700 border-t-slate-800 dark:border-t-zinc-200 animate-spin" />
          <span className="text-slate-500 dark:text-zinc-400 text-xs font-medium">Verifying administrator access…</span>
        </div>
      </div>
    );
  }

  // 2. Not signed in at all → redirect to admin login
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-8 space-y-6 text-center text-slate-800 dark:text-zinc-200 shadow-sm">
          <ShieldAlertIcon className="h-12 w-12 text-slate-700 dark:text-zinc-300 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Sign In Required</h1>
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
              You must be signed in with an admin account to access these dashboards.
            </p>
          </div>
          <Link
            href="/admin-login"
            className="block w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl py-3 text-center shadow-sm"
          >
            Go to Admin Login
          </Link>
        </div>
      </div>
    );
  }

  // 3. Signed in but not admin → show access denied
  const userRole = (user.publicMetadata as any)?.role || '';
  const userEmail = (user.emailAddresses?.[0]?.emailAddress || '').toLowerCase();
  const isAdmin = userRole === 'admin' || ADMIN_EMAILS.includes(userEmail);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl p-8 space-y-6 text-center text-slate-800 dark:text-zinc-200 shadow-sm">
          <ShieldAlertIcon className="h-12 w-12 text-slate-700 dark:text-zinc-300 mx-auto" />
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-100">Admin Portal Access Restricted</h1>
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
              Your account <span className="font-bold text-slate-900 dark:text-zinc-100">{user.emailAddresses[0]?.emailAddress}</span> lacks the administrative privileges required to view these dashboards.
            </p>
          </div>
          <Link
            href="/"
            className="block w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl py-3 text-center shadow-sm"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // 4. Authenticated admin shell
  let firstName = user.firstName;
  let lastName = user.lastName;

  if (userEmail === 'xtracityhostels@gmail.com') {
    firstName = 'Mr. Bismark';
    lastName = 'Ofosu';
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col md:flex-row text-slate-900 dark:text-zinc-100">
      <AdminSidebar userFirstName={firstName} userLastName={lastName} />
      <main className="flex-grow p-3.5 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        {children}
      </main>
    </div>
  );
}
