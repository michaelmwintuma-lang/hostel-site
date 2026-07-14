"use client";

import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-slate-200 bg-white rounded-2xl p-8 space-y-6 text-center text-slate-800 shadow-md">
        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
          <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.172 9.172a4 4 0 015.656 0M5.636 5.636a9 9 0 0112.728 0M12 14a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900">You are offline</h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            It looks like you've lost your internet connection. Some parts of Xtracity Hostels require an active connection to load.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="block w-full bg-[#E03B0D] text-white font-semibold text-sm rounded-full py-3 hover:bg-[#A12808] transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
