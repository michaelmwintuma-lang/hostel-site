import Link from 'next/link';
import { getAuthSession, isClerkConfigured } from '@/lib/auth-compat';
import Header from '@/components/Header';
import AppLogo from '@/components/AppLogo';

/* ── Layout Header / Footer Icons ── */

const VerifiedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-500/80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L3 7V12C3 17.25 6.84 22.15 12 23.5C17.16 22.15 21 17.25 21 12V7L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21s-6-5.35-6-10a6 6 0 1 1 12 0c0 4.65-6 10-6 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4h3l1 4-2 2a15 15 0 0 0 6 6l2-2 4 1v3a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
    <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await getAuthSession();
  const isUserSignedIn = !!userId;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header isUserSignedIn={isUserSignedIn} isClerkConfigured={Boolean(isClerkConfigured)} />

      {/* Page Content */}
      <main className="flex-grow">{children}</main>

      {/* Premium Footer */}
      <footer className="border-t border-slate-200/60 dark:border-slate-800 bg-slate-900 dark:bg-slate-950 py-12 text-sm text-slate-400">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <AppLogo
                alt="Xtracity Hostel Logo"
                width={150}
                height={40}
                className="h-10 w-auto object-contain rounded-md shadow-sm"
              />
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Accra's premier luxury student housing. Bridging academic success with premium, hassle-free lifestyle support.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/rooms" className="hover:text-white transition-colors">Rooms & Rates</Link></li>
              <li><Link href="/booking" className="hover:text-white transition-colors">Book Now</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-widest text-white mb-4">Information</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/rules" className="hover:text-white transition-colors">House Rules</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Location & Directions</Link></li>
              <li><Link href="/contact#faq" className="hover:text-white transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-xs uppercase tracking-widest text-white mb-4">Contact Info</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2"><LocationIcon /> <span>Cosway St, Agbogba, Near Academic City University, Accra</span></li>
              <li className="flex items-start gap-2"><PhoneIcon /> <span>General Manager: +233 244526110</span></li>
              <li className="flex items-start gap-2"><MailIcon /> <span>xtracityhostels@gmail.com</span></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Xtracity Hostel Ghana. All rights reserved.</p>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 text-slate-500">
            <VerifiedIcon />
            <span>Xtracity Verified Applications</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
