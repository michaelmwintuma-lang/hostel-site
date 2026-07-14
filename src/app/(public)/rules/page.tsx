import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/* ── Clean Green Outline Icons for Rules ── */
const QuietHoursIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M24 14V24L30 30" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36 8L42 14" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const VisitorIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="16" r="7" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M6 40C6 33 12 28 20 28C28 28 34 33 34 40" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M34 16L42 16" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 12L38 20" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const NoiseIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 20H14L24 10V38L14 28H8V20Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 18C34 20 35 22 35 24C35 26 34 28 32 30" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M36 14C39 17 41 20 41 24C41 28 39 31 36 34" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SecurityIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4L8 12V22C8 32 14.5 40.5 24 44C33.5 40.5 40 32 40 22V12L24 4Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 24L22 29L31 20" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FireSafetyIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 4C24 4 14 16 14 28C14 33.52 18.48 38 24 38C29.52 38 34 33.52 34 28C34 16 24 4 24 4Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 38C24 38 20 34 20 30C20 26 24 22 24 22C24 22 28 26 28 30C28 34 24 38 24 38Z" stroke="#E03B0D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CleanlinessIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12H36V40C36 42 34 44 32 44H16C14 44 12 42 12 40V12Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 12V8C18 6 20 4 24 4C28 4 30 6 30 8V12" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 12H40" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const MaintenanceIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="8" stroke="#E03B0D" strokeWidth="2.5" />
    <path d="M24 8V12M24 36V40M12.68 12.68L15.51 15.51M32.49 32.49L35.32 35.32M8 24H12M36 24H40M12.68 35.32L15.51 32.49M32.49 15.51L35.32 12.68" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const ConservationIcon = () => (
  <svg viewBox="0 0 48 48" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 44V34" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M24 34C14 34 10 24 10 14C20 14 38 14 38 14C38 24 34 34 24 34Z" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 34L30 22" stroke="#E03B0D" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const RULES = [
  {
    icon: QuietHoursIcon,
    title: "1. Academic Hours & Curfew",
    description: "Quiet hours are observed from 10:00 PM to 6:00 AM daily to facilitate a study-friendly environment. Main gates close at 11:30 PM on weekdays and 1:00 AM on weekends for student safety."
  },
  {
    icon: VisitorIcon,
    title: "2. Visitation & Guest Policy",
    description: "Outside visitors are permitted in study lounges and gardens from 8:00 AM to 9:00 PM. No overnight stay of visitors is allowed in private rooms to ensure the privacy of roommates."
  },
  {
    icon: NoiseIcon,
    title: "3. Noise & Social Conduct",
    description: "Personal audio systems, televisions, and instruments must be kept at a level that does not disturb neighbors. Violent behavior, harassment, and illegal substances are strictly prohibited."
  },
  {
    icon: SecurityIcon,
    title: "4. Security & Access Control",
    description: "Students must carry their physical RFID cards / room keys for entry. Keys must not be shared under any circumstances. Report lost keys or lock issues to reception immediately."
  },
  {
    icon: FireSafetyIcon,
    title: "5. Fire Safety & Electrical Appliances",
    description: "High-power appliances like hot plates and electric heaters are not allowed in bedrooms. Cooking must only be done in the dedicated floor kitchenettes. Smoke alarms must never be tampered with."
  },
  {
    icon: CleanlinessIcon,
    title: "6. Cleanliness & Hygiene",
    description: "Students are expected to keep their rooms tidy and dispose of personal trash in the designated outdoor bins. This prevents pests and ensures a clean, healthy living environment for everyone."
  },
  {
    icon: MaintenanceIcon,
    title: "7. Prompt Maintenance Reporting",
    description: "Residents must promptly report any plumbing leaks, electrical faults, or structural issues via the management portal. This helps us ensure your room remains in perfect condition and prevents minor issues from becoming major inconveniences."
  },
  {
    icon: ConservationIcon,
    title: "8. Energy & Water Conservation",
    description: "Please turn off lights, fans, AC units, and taps when leaving your room or when not in use. Conscious consumption keeps our community sustainable and guarantees reliable utility availability for all students."
  }
];

export default function RulesPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16 max-w-5xl space-y-16 bg-slate-50 text-slate-800">
      {/* Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
          Code of Conduct & House Rules
        </h1>
        <p className="text-slate-600 text-sm md:text-base">
          Living in a shared Xtracity environment requires mutual respect and adherence to common guidelines. Read our guidelines below.
        </p>
      </div>

      {/* Rules list */}
      <div className="grid md:grid-cols-2 gap-6">
        {RULES.map((rule, idx) => (
          <Card key={idx} className="border-slate-200 bg-white text-slate-800 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-start space-x-4 space-y-0 p-6">
              <div className="p-3 bg-[#E03B0D]/10 rounded-xl text-[#E03B0D] shrink-0">
                <rule.icon />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-slate-900">{rule.title}</CardTitle>
                <CardDescription className="text-slate-600 text-sm mt-2 leading-relaxed">
                  {rule.description}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Bottom Agreement Notice */}
      <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-2xl space-y-4 text-center shadow-sm">
        <h4 className="text-sm font-semibold text-[#E03B0D]"> Student Agreement Acknowledgement</h4>
        <p className="text-slate-600 text-xs max-w-2xl mx-auto leading-relaxed">
          By proceeding with a room booking and direct registration, you agree to comply fully with these house rules and any subsequent amendments published by Xtracity Hostel management. Violations may result in disciplinary action up to lease termination.
        </p>
      </div>
    </div>
  );
}
