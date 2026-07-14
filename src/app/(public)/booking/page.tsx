"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useUser } from '@clerk/nextjs';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, ShieldAlert, BedDouble, CheckCircle2, ChevronRight, ChevronLeft, Mail, Sparkles, Phone, ShieldCheck, GraduationCap, Building2, Wallet, MapPin, Clock3, CircleDollarSign } from 'lucide-react';
import Link from 'next/link';

interface RoomType {
  id: string;
  name: string;
  price_per_sem: number;
  capacity: number;
}

interface Room {
  id: string;
  room_number: string;
  room_type_id: string;
  status: string;
}

const DEFAULT_ROOM_TYPES: RoomType[] = [
  { id: "single-room", name: "Single Room", price_per_sem: 125000, capacity: 1 },
  { id: "two-in-a-room", name: "2-in-a-room", price_per_sem: 80000, capacity: 2 },
  { id: "three-in-a-room", name: "3-in-a-room", price_per_sem: 4800, capacity: 3 }
];

const DEFAULT_ROOMS: Room[] = [
  { id: 'R101', room_number: 'Room 101-A', room_type_id: 'single-room', status: 'Available' },
  { id: 'R102', room_number: 'Room 102-A', room_type_id: 'single-room', status: 'Available' },
  { id: 'R201', room_number: 'Room 201-B', room_type_id: 'two-in-a-room', status: 'Available' },
  { id: 'R202', room_number: 'Room 202-B', room_type_id: 'two-in-a-room', status: 'Available' },
  { id: 'R301', room_number: 'Room 301-C', room_type_id: 'three-in-a-room', status: 'Available' },
];

const computeAcademicYears = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const activeYear = currentMonth >= 6 ? `${currentYear}/${currentYear + 1}` : `${currentYear - 1}/${currentYear}`;
  const upcomingYear = currentMonth >= 6 ? `${currentYear + 1}/${currentYear + 2}` : `${currentYear}/${currentYear + 1}`;
  return { activeYear, upcomingYear };
};

const { activeYear, upcomingYear } = computeAcademicYears();

function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedRoomType = searchParams.get('roomType') || '';
  const { user, isLoaded } = useUser();

  // Steps: 1 = Profile, 2 = Emergency, 3 = Room Selection, 4 = Review, 5 = Confirmed Success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);

  const [existingBooking, setExistingBooking] = useState<{
    id: string;
    roomNumber: string;
    roomCategory: string;
    price: number;
  } | null>(null);

  // Database lists
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);

  // Form inputs state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    university: '',
    studentIdNum: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    academicYear: activeYear,
    semester: '1',
    roomTypeId: '',
    roomId: '',
  });

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // 1. Fetch Room Types & available rooms from Supabase on load
  useEffect(() => {
    async function loadData() {
      try {
        setInitialLoading(true);
        const { data: types, error: typesError } = await supabase
          .from('room_types')
          .select('id, name, price_per_sem, capacity');

        const loadedTypes = (types && types.length > 0) ? types : DEFAULT_ROOM_TYPES;
        setRoomTypes(loadedTypes as RoomType[]);
        if (loadedTypes.length > 0) {
          const defaultType = preselectedRoomType || loadedTypes[0].id;
          setFormData(prev => ({ ...prev, roomTypeId: defaultType }));
        }

        // Fetch existing student profile & booking from API if Clerk user is loaded
        if (isLoaded && user) {
          const res = await fetch('/api/booking');
          if (res.ok) {
            const data = await res.json();
            if (data.registered && data.student) {
              setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: data.student.phone_number || '',
                university: data.student.university || '',
                studentIdNum: data.student.student_id_num || '',
                emergencyName: data.student.emergency_contact?.name || '',
                emergencyRelationship: data.student.emergency_contact?.relationship || '',
                emergencyPhone: data.student.emergency_contact?.phone || '',
              }));

              if (data.booking) {
                setExistingBooking({
                  id: data.booking.id,
                  roomNumber: data.booking.roomNumber,
                  roomCategory: data.booking.roomCategory,
                  price: data.booking.price,
                });
                setStep(5);
              }
            } else {
              // Pre-fill names from Clerk profile if no student record yet
              setFormData(prev => ({
                ...prev,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
              }));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadData();
  }, [preselectedRoomType, user, isLoaded]);

  // 2. Fetch/Filter rooms based on selected Room Type
  useEffect(() => {
    if (!formData.roomTypeId) return;

    async function loadRooms() {
      try {
        const { data: rooms, error: roomsError } = await supabase
          .from('rooms')
          .select('id, room_number, room_type_id, status')
          .eq('room_type_id', formData.roomTypeId)
          .in('status', ['Available', 'Occupied']);

        if (roomsError) {
          console.error('Error fetching rooms:', roomsError);
        } else {
          const loadedRooms = (rooms && rooms.length > 0)
            ? rooms
            : DEFAULT_ROOMS.filter(r => r.room_type_id === formData.roomTypeId);
          
          setAvailableRooms(loadedRooms as Room[]);
          if (loadedRooms.length > 0) {
            setFormData(prev => ({ ...prev, roomId: loadedRooms[0].id }));
          } else {
            setFormData(prev => ({ ...prev, roomId: '' }));
          }
        }
      } catch (err) {
        console.error('Error loading rooms:', err);
      }
    }

    loadRooms();
  }, [formData.roomTypeId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const selectedRoomTypeInfo = roomTypes.find(t => t.id === formData.roomTypeId);
  const selectedRoomInfo = availableRooms.find(r => r.id === formData.roomId);

  const validateStep = () => {
    setDbError(null);
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber || !formData.university || !formData.studentIdNum) {
        setDbError('Please fill out all profile fields.');
        return false;
      }
    } else if (step === 2) {
      if (!formData.emergencyName || !formData.emergencyRelationship || !formData.emergencyPhone) {
        setDbError('Please fill out all emergency contact details.');
        return false;
      }
    } else if (step === 3) {
      if (!formData.roomId) {
        setDbError('Please select an available room.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
    setDbError(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setDbError(null);

    const price = selectedRoomTypeInfo?.price_per_sem || 0;

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: formData.roomId,
          academicYear: formData.academicYear,
          semester: Number(formData.semester),
          price: price,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          university: formData.university,
          studentIdNum: formData.studentIdNum,
          emergencyContact: {
            name: formData.emergencyName,
            relationship: formData.emergencyRelationship,
            phone: formData.emergencyPhone
          }
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Failed to submit booking request.');
      }

      // Transition directly to Step 5 success page
      setStep(5);

    } catch (err: any) {
      console.error('Submit booking error:', err);
      setDbError(err.message || 'An unexpected error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      {initialLoading && step === 1 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-[#E03B0D]/20 border-t-[#E03B0D] animate-spin" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-32 rounded-full bg-slate-200 dark:bg-slate-700" />
              <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />
            </div>
          </div>
        </div>
      )}
      {/* Step Indicator Progress Bar */}
      {step <= 4 && (
        <div className="mb-8 space-y-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && "Personal Profile"}
              {step === 2 && "Emergency Contacts"}
              {step === 3 && "Room Selection"}
              {step === 4 && "Review Application"}
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E03B0D] transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-md">
        <CardHeader className="space-y-1.5 border-b border-slate-100 dark:border-slate-700 p-6 md:p-8">
          <CardTitle className="text-xl md:text-2xl font-bold flex items-center space-x-2">
            <span className="text-slate-900 dark:text-white">Hostel Reservation</span>
          </CardTitle>
          {step <= 4 && (
            <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
              Academic Year {formData.academicYear} • Semester {formData.semester}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {dbError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-xs p-3.5 rounded-xl flex items-center space-x-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{dbError}</span>
            </div>
          )}

          {/* STEP 1: Personal Profile */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E03B0D] mb-2">
                <User className="h-4 w-4" />
                <span>Student Academic Details</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-bold text-slate-800 dark:text-slate-200">First Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-bold text-slate-800 dark:text-slate-200">Last Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-bold text-slate-800 dark:text-slate-200">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="jane.doe@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-sm font-bold text-slate-800 dark:text-slate-200">WhatsApp / Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="university" className="text-sm font-bold text-slate-800 dark:text-slate-200">University / Tertiary Institution <span className="text-red-500">*</span></Label>
                <Input
                  id="university"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="University of Ghana"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="studentIdNum" className="text-sm font-bold text-slate-800 dark:text-slate-200">Student ID / Index Number <span className="text-red-500">*</span></Label>
                <Input
                  id="studentIdNum"
                  name="studentIdNum"
                  value={formData.studentIdNum}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="10928434"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Emergency Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E03B0D] mb-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Next of Kin / Emergency Representative</span>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyName" className="text-sm font-bold text-slate-800 dark:text-slate-200">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="emergencyName"
                  name="emergencyName"
                  value={formData.emergencyName}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyRelationship" className="text-sm font-bold text-slate-800 dark:text-slate-200">Relationship to Student <span className="text-red-500">*</span></Label>
                <Input
                  id="emergencyRelationship"
                  name="emergencyRelationship"
                  value={formData.emergencyRelationship}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="Mother / Father / Guardian"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyPhone" className="text-sm font-bold text-slate-800 dark:text-slate-200">Emergency Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="emergencyPhone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm placeholder:text-slate-400 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Room Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E03B0D] mb-2">
                <BedDouble className="h-4 w-4" />
                <span>Choose Room Configuration</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Academic Year</Label>
                  <Select
                    value={formData.academicYear}
                    onValueChange={(val) => handleSelectChange('academicYear', val || '')}
                  >
                    <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200">
                      <SelectItem value={activeYear}>{activeYear}</SelectItem>
                      <SelectItem value={upcomingYear}>{upcomingYear}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Semester</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(val) => handleSelectChange('semester', val || '')}
                  >
                    <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm">
                      <SelectValue placeholder="Select Sem" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200">
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Room Type <span className="text-red-500">*</span></Label>
                <Select
                  value={formData.roomTypeId}
                  onValueChange={(val) => handleSelectChange('roomTypeId', val || '')}
                >
                  <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm">
                    <SelectValue placeholder="Select Room Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200">
                    {roomTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name} ({(type.price_per_sem).toLocaleString()} GHS)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-bold text-slate-800 dark:text-slate-200">Available Room Number <span className="text-red-500">*</span></Label>
                {availableRooms.length > 0 ? (
                  <Select
                    value={formData.roomId}
                    onValueChange={(val) => handleSelectChange('roomId', val || '')}
                  >
                    <SelectTrigger className="h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-sm">
                      <SelectValue placeholder="Select Room" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200">
                      {availableRooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.room_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-3 rounded-lg">
                    No physical rooms are currently available for this type. Please choose another type.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: Review & Submit */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold text-[#E03B0D]">
                <CheckCircle2 className="h-4 w-4" />
                <span>Verify Reservation Summary</span>
              </div>

              <div className="border border-slate-200 bg-slate-50/70 rounded-2xl p-5 space-y-4 text-xs shadow-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500"><User className="h-3.5 w-3.5" /> Student Name</div>
                    <div className="font-semibold text-slate-800">{formData.firstName} {formData.lastName}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500"><GraduationCap className="h-3.5 w-3.5" /> University</div>
                    <div className="font-semibold text-slate-800">{formData.university}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500"><Clock3 className="h-3.5 w-3.5" /> Academic Year</div>
                    <div className="font-semibold text-slate-800">{formData.academicYear}</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-1 flex items-center gap-2 text-slate-500"><Building2 className="h-3.5 w-3.5" /> Selected Room</div>
                    <div className="font-semibold text-slate-800">{selectedRoomInfo?.room_number || 'Not Selected'}</div>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600"><CircleDollarSign className="h-4 w-4 text-emerald-600" /> Rent Cost</div>
                    <div className="text-base font-black text-[#E03B0D]">{(selectedRoomTypeInfo?.price_per_sem || 0).toLocaleString()} GHS</div>
                  </div>
                </div>
              </div>

              <div className="border border-emerald-200 bg-emerald-50/30 p-4 rounded-xl flex items-start space-x-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-bold text-emerald-600 block mb-0.5">Direct Application Delivery</span>
                  Once you submit this reservation request, our administration team will receive an email detailing your academic profile and selected room number. We will contact you immediately on the phone number provided to verify your spot and finalize room keys.
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmed Success Screen */}
          {step === 5 && (
            <div className="space-y-6 text-center py-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 shadow-sm">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>

              <div className="mx-auto max-w-md space-y-2">
                <h1 className="text-2xl font-black text-slate-900">Application Submitted!</h1>
                <p className="text-xs leading-relaxed text-slate-600">
                  Your reservation request has been recorded and forwarded to the Xtracity Hostel team for confirmation.
                </p>
              </div>

              <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left text-xs shadow-sm space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-2 text-slate-500"><Building2 className="h-3.5 w-3.5" /> Room Requested</span>
                  <span className="font-semibold text-slate-800">
                    {existingBooking ? existingBooking.roomNumber : selectedRoomInfo?.room_number}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-2 text-slate-500"><BedDouble className="h-3.5 w-3.5" /> Room Category</span>
                  <span className="font-semibold text-slate-800">
                    {existingBooking ? existingBooking.roomCategory : selectedRoomTypeInfo?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500"><CircleDollarSign className="h-3.5 w-3.5" /> Rent Cost</span>
                  <span className="font-semibold text-[#E03B0D]">
                    {(existingBooking ? existingBooking.price : (selectedRoomTypeInfo?.price_per_sem || 0)).toLocaleString()} GHS
                  </span>
                </div>
              </div>

              <div className="mx-auto flex max-w-sm items-start space-x-2.5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-left text-xs">
                <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-blue-500" />
                <p className="text-[11px] leading-relaxed text-slate-600">
                  <span className="mb-0.5 block font-bold text-blue-600">What Happens Next?</span>
                  The hostel team will contact you via phone or WhatsApp within the next 4 hours to verify your details and explain the next steps.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4">
                <Link
                  href="/"
                  className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-6 py-2 hover:bg-[#A12808] shadow-sm transition-all"
                >
                  Return to Home
                </Link>

              </div>
            </div>
          )}
        </CardContent>

        {step <= 4 && (
          <div className="border-t border-slate-100 dark:border-slate-700 p-6 md:p-8 flex items-center justify-between">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="group/btn border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 font-semibold text-xs rounded-full px-5 py-2 transition-all duration-200"
                disabled={loading}
              >
                <ChevronLeft className="mr-1.5 h-4 w-4 transition-transform duration-200 group-hover/btn:-translate-x-1" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button
                onClick={nextStep}
                className="group/btn bg-[#E03B0D] text-white font-semibold text-sm rounded-full px-8 py-3 hover:bg-[#A12808] hover:shadow-lg hover:shadow-[#E03B0D]/20 hover:-translate-y-0.5 ml-auto cursor-pointer transition-all duration-200"
              >
                Next Step
                <ChevronRight className="ml-1.5 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-[#E03B0D] text-white font-bold text-sm rounded-full px-10 py-3 hover:bg-[#A12808] shadow shadow-[#E03B0D]/10 hover:shadow-lg hover:shadow-[#E03B0D]/30 hover:-translate-y-0.5 ml-auto cursor-pointer transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Registering Spot..." : "Submit Reservation"}
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[50vh] flex items-center justify-center text-slate-500 text-xs">
        Loading Reservation Engine...
      </div>
    }>
      <BookingForm />
    </Suspense>
  );
}
