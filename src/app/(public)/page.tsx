import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';

/* ── Clean Green Outline Icons (matching user reference style) ── */
const PowerIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 6L12 26H24L22 42L38 22H26L28 6Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WifiIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="38" r="2.5" fill="#E03B0D" />
    <path d="M16 32C19 29 21 28 24 28C27 28 29 29 32 32" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 25C15 20 19 18 24 18C29 18 33 20 38 25" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M4 18C11 11 17 8 24 8C31 8 37 11 44 18" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const WaterIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C24 4 10 18 10 28C10 35.73 16.27 42 24 42C31.73 42 38 35.73 38 28C38 18 24 4 24 4Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 30C18 26.69 20.69 24 24 24" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ShuttleIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="12" width="40" height="18" rx="4" stroke="#E03B0D" strokeWidth="2.5" />
    <rect x="10" y="16" width="8" height="7" rx="1.5" stroke="#E03B0D" strokeWidth="2" />
    <rect x="22" y="16" width="8" height="7" rx="1.5" stroke="#E03B0D" strokeWidth="2" />
    <circle cx="13" cy="36" r="4" stroke="#E03B0D" strokeWidth="2.5" />
    <circle cx="35" cy="36" r="4" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M4 26H44" stroke="#E03B0D" strokeWidth="2" />
  </svg>
);

const HousekeepingIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 20C14 20 18 16 24 16C30 16 34 20 34 20V40H14V20Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 6V16" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M18 30H30" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 35H30" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 8L40 4L42 8L46 10L42 12L40 16L38 12L34 10L38 8Z" stroke="#E03B0D" strokeWidth="1.5" />
  </svg>
);

const AcIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="10" width="40" height="16" rx="3" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M10 22H38" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 30C15.5 33 15.5 36 14 39" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 30C25.5 33 25.5 36 24 39" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
    <path d="M34 30C35.5 33 35.5 36 34 39" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const KitchenIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="8" y="24" width="32" height="18" rx="2" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M8 24V14C8 12.8954 8.89543 12 10 12H38C39.1046 12 40 12.8954 40 14V24" stroke="#E03B0D" strokeWidth="2.5" />
    <circle cx="16" cy="33" r="3" stroke="#E03B0D" strokeWidth="2" />
    <circle cx="32" cy="33" r="3" stroke="#E03B0D" strokeWidth="2" />
    <rect x="14" y="16" width="20" height="4" rx="1" stroke="#E03B0D" strokeWidth="2" />
  </svg>
);

/* ── Social Proof / Highlight Icons ── */
const PersonIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="16" r="8" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M8 42C8 34.27 15.16 28 24 28C32.84 28 40 34.27 40 42" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const SmileyIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="#E03B0D" strokeWidth="2.5" />
    <circle cx="17" cy="20" r="2" fill="#E03B0D" />
    <circle cx="31" cy="20" r="2" fill="#E03B0D" />
    <path d="M16 30C18 34 22 36 24 36C26 36 30 34 32 30" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const GroupIcon = () => (
  <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="14" r="6" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M6 36C6 30 11 25 18 25C25 25 30 30 30 36" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="34" cy="16" r="5" stroke="#E03B0D" strokeWidth="2" />
    <path d="M42 36C42 31 38.5 27 34 27C31.5 27 29.5 28 28 29.5" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const AMENITIES = [
  {
    icon: PowerIcon,
    title: "Constant Power",
    description: "Uninterrupted electricity with our primary grid line and heavy-duty automatic generator backup."
  },
  {
    icon: WifiIcon,
    title: "Ultra-Fast Wi-Fi",
    description: "Dedicated high-speed fiber internet covering all rooms, studying lounges, and outdoor gardens."
  },
  {
    icon: WaterIcon,
    title: "Constant Water Flow",
    description: "Continuous clean running water supplied by our private borehole and pressurized multi-stage tank systems."
  },
  {
    icon: ShuttleIcon,
    title: "Shuttle Van",
    description: "Hourly private shuttles transporting students directly to Academic City University and nearby campuses."
  },
  {
    icon: HousekeepingIcon,
    title: "Weekly Housekeeping",
    description: "Professional cleaning of common spaces, en-suite bathrooms, and kitchenettes included."
  },
  {
    icon: AcIcon,
    title: "Fully Air-Conditioned",
    description: "Stay cool and comfortable with state-of-the-art silent AC units in every single room."
  },
  {
    icon: KitchenIcon,
    title: "Fully Furnished Kitchen",
    description: "Modern kitchens equipped with gas cylinders and microwaves for your culinary needs."
  }
];

const computeAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const activeYear = currentMonth >= 6 ? `${currentYear}/${currentYear + 1}` : `${currentYear - 1}/${currentYear}`;
  const upcomingYear = currentMonth >= 6 ? `${currentYear + 1}/${currentYear + 2}` : `${currentYear}/${currentYear + 1}`;
  return { activeYear, upcomingYear };
};

export default function HomePage() {
  const { activeYear } = computeAcademicYears();

  return (
    <div className="flex flex-col space-y-24 pb-20 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Hero & Stats Wrapper (removes massive gap between them) */}
      <div className="flex flex-col">
        {/* 1. Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-12 lg:pt-20 lg:pb-16">
          <div className="container mx-auto px-4 md:px-6 relative flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-5xl text-center space-y-10 flex flex-col items-center">
              
              <div className="inline-flex items-center justify-center space-x-2 border border-[#E03B0D]/20 dark:border-emerald-500/30 bg-[#E03B0D]/5 dark:bg-emerald-500/10 px-4 py-2 rounded-full text-sm font-bold text-[#E03B0D] dark:text-emerald-400 uppercase tracking-widest mx-auto shadow-sm">
                <Sparkles className="h-4 w-4 text-[#E03B0D] dark:text-emerald-500" />
                <span>Academic Year {activeYear} Bookings Open</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
                Welcome to Xtracity Hostels: <br className="hidden md:block" />
                <span className="text-[#E03B0D] dark:text-emerald-400">
                  The New Standard
                </span> <br className="hidden sm:inline" />
                of Student Luxury
              </h1>

              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                Experience a premium student residence offering 5-star comfort, high-speed connectivity, and uninterrupted backup utilities in Agbogba, just minutes from <span className="font-extrabold text-[#E03B0D] dark:text-emerald-400 underline decoration-2 underline-offset-4">Academic City University, Wisconsin University, and University of Ghana</span>.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full pt-4">
                <Link
                  href="/booking"
                  className="group w-full sm:w-auto bg-[#E03B0D] text-white font-bold rounded-full px-10 py-4
                    hover:bg-[#A12808] hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#E03B0D]/40
                    shadow-xl shadow-[#E03B0D]/20 transition-all duration-300 text-base text-center flex items-center justify-center space-x-3 cursor-pointer"
                >
                  <span>Book Your Room</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
                <Link
                  href="/rooms"
                  className="w-full sm:w-auto border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200
                    hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-[#E03B0D]/30 dark:hover:border-emerald-500/30 hover:text-[#E03B0D] dark:hover:text-emerald-400 hover:-translate-y-1
                    font-bold rounded-full px-10 py-4 transition-all duration-300 text-base text-center cursor-pointer shadow-sm hover:shadow-md"
                >
                  View Rooms &amp; Rates
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-slate-600 dark:text-slate-400 text-sm font-semibold">
                <span className="flex items-center space-x-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span>24/7 Gated Security &amp; CCTV</span>
                </span>
                <span className="flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>100% Water &amp; Power Backup</span>
                </span>
                <span className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <span>Accra's Top Rated Student Housing</span>
                </span>
              </div>
              
              {/* Decorative background elements for centered layout */}
              <div className="absolute top-10 right-20 w-64 h-64 bg-[#E03B0D]/5 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-10 left-20 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
            </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="relative py-12 md:py-16 bg-slate-900 overflow-hidden border-y border-white/10 shadow-2xl">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-[#E03B0D]/20 to-slate-900 opacity-90" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-center items-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center py-6 md:py-0 md:px-20 text-center w-full md:w-auto">
              <span className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tight">
                <AnimatedCounter end={80} suffix="+" duration={2000} />
              </span>
              <span className="text-sm font-medium text-white/90 tracking-wide uppercase">Students</span>
            </div>
            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center py-6 md:py-0 md:px-20 text-center w-full md:w-auto">
              <span className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tight">
                <AnimatedCounter start={1990} end={2023} duration={2500} />
              </span>
              <span className="text-sm font-medium text-white/90 tracking-wide uppercase">Founded</span>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* 2. Highlights / Amenities Grid */}
      <section className="container mx-auto px-4 md:px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Premium Amenities Included
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            Every residency comes with full access to premium student services and utility redundancy.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {AMENITIES.map((amenity, idx) => (
            <div
              key={idx}
              className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.333rem)] border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 rounded-2xl space-y-4 hover:border-[#E03B0D]/40 dark:hover:border-emerald-500/40 transition-all group shadow-sm hover:shadow text-center"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-[#FDECE8] dark:bg-emerald-900/30 rounded-2xl inline-block group-hover:bg-[#DCF2E3] dark:group-hover:bg-emerald-900/50 transition-colors">
                  <amenity.icon />
                </div>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">{amenity.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{amenity.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2.5. Icon Highlight Strip */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Our Core Student Experience
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
            Providing more than just a place to sleep. We manage a framework for academic success and luxury living.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              icon: PersonIcon,
              label: "Personalized Support",
              desc: "A dedicated warden and supervisor on-site for every student to ensure absolute comfort and security.",
              num: "01"
            },
            {
              icon: SmileyIcon,
              label: "Student Satisfaction",
              desc: "98% positive experience rating from over 80+ past students who completed their degrees with us.",
              num: "02"
            },
            {
              icon: GroupIcon,
              label: "Community Living",
              desc: "A vibrant network of ambitious international and local students sharing study tables and lounge chats.",
              num: "03"
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[#E03B0D]/20 dark:hover:border-emerald-500/30 group"
            >
              {/* Top Row: Icon and Faded Index */}
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50/50 dark:bg-emerald-900/30 text-[#E03B0D] transition-colors group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/50">
                  <item.icon />
                </div>
                <span className="text-4xl font-black text-[#E03B0D]/5 select-none font-sans group-hover:text-[#E03B0D]/10 transition-colors">
                  {item.num}
                </span>
              </div>

              {/* Content */}
              <h4 className="mt-8 text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-[#E03B0D] dark:group-hover:text-emerald-400 transition-colors">
                {item.label}
              </h4>
              <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Social Proof Section */}
      <section className="bg-gradient-to-b from-slate-50/50 dark:from-slate-950/50 to-white dark:to-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-20">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
              Why Students Choose Us Every Semester
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              We manage premium student housing with a focus on safety, convenience, and community. Rest assured that utilities are always on, help is always present, and campus is never too far away.
            </p>

            <ul className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-[#E03B0D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">98% Student Occupancy Rate Year-Over-Year</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-[#E03B0D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">On-site Maintenance Team available 24/7</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="h-5 w-5 text-[#E03B0D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Secured Booking with Direct Booking Confirmation</span>
              </li>
            </ul>
          </div>

          {/* Testimonial Boxes */}
          <div className="space-y-6">
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#E03B0D]/5 rounded-full blur-[30px]" />
              <p className="text-slate-700 dark:text-slate-300 text-sm italic relative leading-relaxed">
                "Living at Xtracity Hostel has provided the perfect environment during my residency. Having reliable high-speed internet and no power outages after long working hours makes all the difference. Plus, the shuttle service makes commuting completely stress-free!"
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                <div className="h-10 w-10 rounded-full bg-[#E03B0D]/10 flex items-center justify-center font-bold text-[#E03B0D] text-xs">
                  DA
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Dr. Afiba</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Contact: 0596037127</p>
                </div>
              </div>
            </div>
            
            <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 rounded-2xl space-y-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-[#E03B0D]/5 rounded-full blur-[30px]" />
              <p className="text-slate-700 dark:text-slate-300 text-sm italic relative leading-relaxed">
                "The environment is very conducive for learning and the facilities are top-notch. I highly recommend Xtracity to any student looking for comfort and peace of mind."
              </p>
              <div className="flex items-center space-x-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                <div className="h-10 w-10 rounded-full bg-[#E03B0D]/10 flex items-center justify-center font-bold text-[#E03B0D] text-xs">
                  MM
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Michael Mwintuma</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Academic City University | Contact: 0592566487</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Multi-Step Portal CTA Banner */}
      <section className="container mx-auto px-4 md:px-6">
        <div className="border border-[#E03B0D]/20 dark:border-emerald-500/20 bg-gradient-to-r from-white dark:from-slate-900 to-[#F4FAF6] dark:to-emerald-950/30 p-8 md:p-12 rounded-3xl grid grid-cols-1 lg:grid-cols-5 gap-8 items-center relative overflow-hidden shadow-sm">
          <div className="absolute bottom-0 left-10 w-[200px] h-[200px] bg-[#E03B0D]/5 rounded-full blur-[80px]" />

          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ready to Secure Your Premium Room?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
              Skip the long queues and stressful registration processes. Use our secure online booking portal to select your preferred room configuration, verify your details, and get your room confirmation.
            </p>
          </div>

          <div className="lg:col-span-2 flex justify-end">
            <Link
              href="/booking"
              className="w-full lg:w-auto text-center bg-[#E03B0D] text-white font-bold rounded-full px-10 py-4 hover:bg-[#A12808] shadow-lg transition-all text-sm uppercase tracking-wide cursor-pointer"
            >
              Start Online Application
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
