export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Users, Check, Flame, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface RoomType {
  id: string;
  name: string;
  tagline: string;
  price_per_sem?: number;
  price?: number;
  popular?: boolean;
  capacity: number;
  amenities: string[];
}

const DEFAULT_ROOM_TYPES: RoomType[] = [
  {
    id: "single-room",
    name: "Single Room",
    price_per_sem: 125000,
    price: 125000,
    capacity: 1,
    amenities: [
      "Private Study Desk",
      "Air Conditioning",
      "En-suite Bathroom",
      "High-speed Internet",
      "Personal Wardrobe",
      "24/7 Security Access"
    ],
    popular: true,
    tagline: "Private, quiet space for students who value independence and comfort."
  },
  {
    id: "two-in-a-room",
    name: "2-in-a-room",
    price_per_sem: 80000,
    price: 80000,
    capacity: 2,
    amenities: [
      "Study Desks",
      "Air Conditioning",
      "Shared Bathroom",
      "High-speed Internet",
      "Spacious Wardrobe",
      "Common Lounge Access"
    ],
    popular: false,
    tagline: "A balanced shared option with personal comfort and community feel."
  },
  {
    id: "three-in-a-room",
    name: "3-in-a-room",
    price_per_sem: 4800,
    price: 4800,
    capacity: 3,
    amenities: [
      "Wardrobes",
      "Air Conditioning",
      "Shared Bathroom",
      "Power Outlets",
      "Study Area Access",
      "Secure Building Entry"
    ],
    popular: false,
    tagline: "A practical shared arrangement for students seeking value and convenience."
  }
];

export default async function RoomsPage() {
  const { data: roomsData } = await supabase.from('room_types').select('*');
  const ROOM_TYPES = (roomsData && roomsData.length > 0)
    ? (roomsData as unknown as RoomType[])
    : DEFAULT_ROOM_TYPES;

  return (
    <div className="container mx-auto px-4 md:px-6 py-16 space-y-16 max-w-7xl">
      {/* Page Title */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Our Rooms & Rates
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          The hostel currently features 7 apartments, each containing 3 main bedrooms. Within each apartment, two bedrooms are configured as 2-in-a-room, and the third is a 3-in-a-room setup. We also offer private single rooms within the apartments. Choose a room configuration that fits your budget and lifestyle. All options include access to constant power, water flow, and our high-speed fiber internet infrastructure.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {ROOM_TYPES.map((type) => (
          <Card
            key={type.id}
            className={`group border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex flex-col justify-between relative overflow-hidden
              transition-all duration-300 ease-out
              hover:-translate-y-2 hover:shadow-xl hover:shadow-[#E03B0D]/10 hover:border-[#E03B0D]/50 dark:hover:border-emerald-500/50
              shadow-sm
              ${type.popular ? 'border-[#E03B0D]/60 ring-1 ring-[#E03B0D]/20 shadow-md shadow-[#E03B0D]/5' : ''}`}
          >
            {type.popular && (
              <div className="absolute top-0 right-0 bg-[#E03B0D] text-white font-bold text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-bl-xl flex items-center space-x-1">
                <Sparkles className="h-3 w-3" />
                <span>Most Popular</span>
              </div>
            )}

            <CardHeader className="space-y-2 p-6 md:p-8 text-center mt-2">
              <CardTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center">
                {type.name}
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {type.tagline}
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 md:px-8 pb-6 space-y-6 flex-grow flex flex-col items-center">
              {/* Pricing */}
              <div className="space-y-1 border-y border-slate-100 dark:border-slate-700 py-4 w-full text-center">
                <div className="text-3xl font-extrabold text-[#E03B0D]">
                  {(type.price_per_sem || type.price || 0).toLocaleString()} GHS
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Per Student / Academic Semester
                </div>
              </div>

              {/* Specs & Capacity */}
              <div className="flex flex-col items-center space-y-3 text-xs text-slate-700 dark:text-slate-300 w-full pt-2">
                <div className="flex items-center justify-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md w-full max-w-[200px]">
                  <Users className="h-3.5 w-3.5 text-[#E03B0D]" />
                  <span>Max {type.capacity} Student{type.capacity > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-center space-x-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md w-full max-w-[200px]">
                  <Flame className="h-3.5 w-3.5 text-[#E03B0D]" />
                  <span>AC Equipped</span>
                </div>
              </div>

              {/* Amenities List */}
              <div className="space-y-3 w-full text-center pt-2">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Included Features</h4>
                <ul className="flex flex-col items-center gap-2.5">
                  {type.amenities.map((amenity, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <Check className="h-4 w-4 text-[#E03B0D] shrink-0" />
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>

            <CardFooter className="px-6 md:px-8 py-6">
              <Link
                href={`/booking?roomType=${type.id}`}
                className="group/btn w-full text-center flex items-center justify-center space-x-2 font-bold rounded-full py-3.5 transition-all duration-200 text-xs cursor-pointer bg-[#E03B0D] text-white hover:bg-[#A12808] hover:shadow-lg hover:shadow-[#E03B0D]/25"
              >
                <span>Select &amp; Book Room</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Booking Notice */}
      <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl max-w-3xl mx-auto space-y-4 shadow-sm">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">⚠️ Important Booking Terms</h4>
        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
          Bookings are on a first-come, first-served basis. To secure a room, you must complete your online application. Our administration team will receive an email immediately with your registration details and will contact you directly to finalize your room assignment and keys.
        </p>
      </div>
    </div>
  );
}
