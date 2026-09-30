"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Search, Edit2, CheckCircle, FileText, UserPlus, Trash } from 'lucide-react';

interface StudentResident {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  university: string;
  student_id_num: string;
  disciplinary_notes?: string;
  bookings?: {
    id: string;
    academic_year: string;
    semester: number;
    status: string;
    rooms: {
      room_number: string;
    };
  }[];
}

export default function ResidentsDirectoryPage() {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<StudentResident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state for Editing
  const [selectedResident, setSelectedResident] = useState<StudentResident | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');

  // Dialog state for Registering a New Resident
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [newResident, setNewResident] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    university: '',
    student_id_num: '',
    room_number: 'Room 101-A',
    disciplinary_notes: 'None'
  });

  async function loadResidents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          id,
          first_name,
          last_name,
          email,
          phone_number,
          university,
          student_id_num,
          disciplinary_notes,
          bookings (
            id,
            academic_year,
            semester,
            status,
            rooms (room_number)
          )
        `);

      if (error || !data) {
        setResidents([]);
      } else {
        const confirmedStudents = data.filter((std: any) => 
          std.bookings && std.bookings.some((b: any) => b.status === 'Confirmed')
        );

        const formatted = confirmedStudents.map((std: any) => ({
          ...std,
          disciplinary_notes: std.disciplinary_notes || 'None',
          bookings: std.bookings || []
        }));
        setResidents(formatted);
      }
    } catch (err) {
      console.error('Error loading residents:', err);
      setResidents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResidents();
  }, []);

  const openEditDialog = (resident: StudentResident) => {
    setSelectedResident(resident);
    setEditNotes(resident.disciplinary_notes || 'None');
    const currentStatus = resident.bookings?.[0]?.status || 'Pending';
    setEditStatus(currentStatus);
    setIsEditDialogOpen(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedResident) return;

    try {
      // 1. Update Student Disciplinary Notes in Supabase
      await supabase
        .from('students')
        .update({
          disciplinary_notes: editNotes
        })
        .eq('id', selectedResident.id);

      // 2. Update Booking Status
      const bookingId = selectedResident.bookings?.[0]?.id;
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: editStatus })
          .eq('id', bookingId);
      }

      // Update state locally
      setResidents(prev =>
        prev.map(r => {
          if (r.id === selectedResident.id) {
            const updatedBookings = r.bookings ? [...r.bookings] : [];
            if (updatedBookings[0]) {
              updatedBookings[0] = { ...updatedBookings[0], status: editStatus };
            }
            return {
              ...r,
              disciplinary_notes: editNotes,
              bookings: updatedBookings
            };
          }
          return r;
        })
      );

      setIsEditDialogOpen(false);
    } catch (err) {
      console.error('Error saving resident status edits:', err);
    }
  };

  // Register New Student Form Submission
  const handleRegisterResident = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResident.first_name || !newResident.last_name || !newResident.email) return;

    const mockId = 's_' + Math.random().toString(36).substr(2, 9);
    const mockBookingId = 'b_' + Math.random().toString(36).substr(2, 9);

    const newStudentObj: StudentResident = {
      id: mockId,
      first_name: newResident.first_name,
      last_name: newResident.last_name,
      email: newResident.email,
      phone_number: newResident.phone_number || '+233 50 000 0000',
      university: newResident.university || 'University of Ghana',
      student_id_num: newResident.student_id_num || '10900000',
      disciplinary_notes: newResident.disciplinary_notes || 'None',
      bookings: [{
        id: mockBookingId,
        academic_year: '2026/2027',
        semester: 1,
        status: 'Confirmed',
        rooms: { room_number: newResident.room_number }
      }]
    };

    try {
      const manualClerkId = `manual_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const { data: stdData, error: stdError } = await supabase
        .from('students')
        .insert({
          clerk_id: manualClerkId,
          first_name: newResident.first_name,
          last_name: newResident.last_name,
          email: newResident.email,
          phone_number: newResident.phone_number,
          university: newResident.university,
          student_id_num: newResident.student_id_num,
          disciplinary_notes: newResident.disciplinary_notes
        })
        .select()
        .single();

      if (!stdError && stdData) {
        const { data: roomData } = await supabase
          .from('rooms')
          .select('id')
          .eq('room_number', newResident.room_number)
          .single();

        if (roomData) {
          await supabase.from('bookings').insert({
            student_id: stdData.id,
            room_id: roomData.id,
            academic_year: '2026/2027',
            semester: 1,
            price: 7500,
            status: 'Confirmed'
          });
        }
      }
    } catch (err) {
      console.error('Database registration error, proceeding with state only:', err);
    }

    setResidents(prev => [newStudentObj, ...prev]);
    setIsRegisterDialogOpen(false);
    setNewResident({
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      university: '',
      student_id_num: '',
      room_number: 'Room 101-A',
      disciplinary_notes: 'None'
    });
  };

  const handleDeleteResident = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student resident profile and all their room bookings?")) {
      return;
    }

    try {
      const residentToDelete = residents.find(r => r.id === id);
      const bookingId = residentToDelete?.bookings?.[0]?.id;
      if (bookingId && !bookingId.startsWith('b_')) {
        await supabase.from('bookings').delete().eq('id', bookingId);
      }
      if (!id.startsWith('s_')) {
        await supabase.from('students').delete().eq('id', id);
      }
    } catch (err) {
      console.error('DB delete error, removing from local state:', err);
    }

    setResidents(prev => prev.filter(r => r.id !== id));
  };

  const filteredResidents = residents.filter(r => {
    const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
    const email = r.email.toLowerCase();
    const query = searchTerm.toLowerCase();
    return fullName.includes(query) || email.includes(query) || r.student_id_num.toLowerCase().includes(query);
  });

  return (
    <div className="space-y-8 bg-transparent text-slate-900 dark:text-zinc-100">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center space-x-2">
            <Users className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
            <span>Resident Management</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">
            Search, view, register, and manage student records and room placements.
          </p>
        </div>

        {/* Register Button */}
        <Button
          onClick={() => setIsRegisterDialogOpen(true)}
          className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl px-4 py-2 flex items-center space-x-1.5 cursor-pointer shadow-sm w-full sm:w-auto justify-center"
        >
          <UserPlus className="h-3.5 w-3.5" />
          <span>Register Student</span>
        </Button>
      </div>

      {/* Directory Count Info Cards — Compact & Sizable for Mobile & Desktop */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 sm:p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
          <div className="p-1.5 sm:p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-700 dark:text-zinc-300 w-fit mx-auto sm:mx-0">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold block truncate">
              Registered
            </span>
            <span className="text-sm sm:text-xl font-bold text-slate-900 dark:text-zinc-100 block">
              {residents.length}
            </span>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 sm:p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
          <div className="p-1.5 sm:p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-700 dark:text-zinc-300 w-fit mx-auto sm:mx-0">
            <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold block truncate">
              Placed
            </span>
            <span className="text-sm sm:text-xl font-bold text-slate-900 dark:text-zinc-100 block">
              {residents.filter(r => r.bookings?.[0]?.status === 'Confirmed').length}
            </span>
          </div>
        </div>

        <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 sm:p-4 rounded-xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-center sm:text-left">
          <div className="p-1.5 sm:p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg text-slate-700 dark:text-zinc-300 w-fit mx-auto sm:mx-0">
            <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold block truncate">
              Pending
            </span>
            <span className="text-sm sm:text-xl font-bold text-slate-900 dark:text-zinc-100 block">
              {residents.filter(r => r.bookings?.[0]?.status === 'Pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
          <Input
            placeholder="Search by student name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 text-xs w-full rounded-xl shadow-sm"
          />
        </div>
      </div>

      {/* Table grid */}
      <Card className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-widest font-semibold text-[10px]">
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">ID / University</th>
                  <th className="px-6 py-4">Assigned Room</th>
                  <th className="px-6 py-4">Booking Status</th>
                  <th className="px-6 py-4">Disciplinary Log</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                {loading ? (
                  <tr className="h-14 animate-pulse"><td colSpan={6}></td></tr>
                ) : filteredResidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
                      No matching student residents found.
                    </td>
                  </tr>
                ) : (
                  filteredResidents.map((resident) => {
                    const activeBooking = resident.bookings?.[0];
                    return (
                      <tr key={resident.id} className="bg-white dark:bg-zinc-900">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 dark:text-zinc-100">
                            {resident.first_name} {resident.last_name}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-zinc-400">{resident.email}</div>
                          <div className="text-[10px] text-slate-500 dark:text-zinc-400">{resident.phone_number}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-700 dark:text-zinc-300">{resident.student_id_num}</div>
                          <div className="text-[10px] text-slate-500 dark:text-zinc-400">{resident.university}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700 dark:text-zinc-300">
                          {activeBooking?.rooms?.room_number || (
                            <span className="text-slate-400 dark:text-zinc-500 italic text-[10px]">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`rounded-md px-2 py-0.5 text-[9px] font-semibold border ${
                              activeBooking?.status === 'Confirmed'
                                ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent'
                                : activeBooking?.status === 'Pending'
                                ? 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700'
                                : 'bg-transparent text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-700'
                            }`}
                          >
                            {activeBooking?.status || 'No Booking'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate text-slate-500 dark:text-zinc-400 text-[10px]">
                          {resident.disciplinary_notes || 'None'}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end space-x-1.5 h-14">
                          <Button
                            variant="ghost"
                            onClick={() => openEditDialog(resident)}
                            className="text-slate-700 dark:text-zinc-300 rounded-lg p-2 h-auto cursor-pointer border border-slate-200 dark:border-zinc-700"
                            title="Edit Student Files"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteResident(resident.id)}
                            className="text-slate-500 dark:text-zinc-400 rounded-lg p-2 h-auto cursor-pointer border border-slate-200 dark:border-zinc-700"
                            title="Delete Student"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Register New Resident Dialog */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-zinc-100">
              <UserPlus className="h-5 w-5 text-slate-700 dark:text-zinc-300" />
              <span>Register New Student Resident</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400 text-xs">
              Directly input an authenticated student record and allocate hostel rooms.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterResident} className="space-y-3.5 py-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="fname" className="text-slate-700 dark:text-zinc-300 font-semibold">First Name</Label>
                <Input
                  id="fname"
                  required
                  value={newResident.first_name}
                  onChange={(e) => setNewResident(prev => ({ ...prev, first_name: e.target.value }))}
                  className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                  placeholder="E.g. Michael"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lname" className="text-slate-700 dark:text-zinc-300 font-semibold">Last Name</Label>
                <Input
                  id="lname"
                  required
                  value={newResident.last_name}
                  onChange={(e) => setNewResident(prev => ({ ...prev, last_name: e.target.value }))}
                  className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                  placeholder="E.g. Mensah"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-slate-700 dark:text-zinc-300 font-semibold">Institutional Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={newResident.email}
                onChange={(e) => setNewResident(prev => ({ ...prev, email: e.target.value }))}
                className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                placeholder="michael@university.edu.gh"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone" className="text-slate-700 dark:text-zinc-300 font-semibold">Phone Contact Number</Label>
              <Input
                id="phone"
                value={newResident.phone_number}
                onChange={(e) => setNewResident(prev => ({ ...prev, phone_number: e.target.value }))}
                className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                placeholder="+233 50 123 4567"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="uni" className="text-slate-700 dark:text-zinc-300 font-semibold">University</Label>
                <Input
                  id="uni"
                  value={newResident.university}
                  onChange={(e) => setNewResident(prev => ({ ...prev, university: e.target.value }))}
                  className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                  placeholder="Academic City"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="studId" className="text-slate-700 dark:text-zinc-300 font-semibold">Student ID Num</Label>
                <Input
                  id="studId"
                  value={newResident.student_id_num}
                  onChange={(e) => setNewResident(prev => ({ ...prev, student_id_num: e.target.value }))}
                  className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                  placeholder="E.g. 10924823"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regRoom" className="text-slate-700 dark:text-zinc-300 font-semibold">Assign Room Placement</Label>
              <select
                id="regRoom"
                value={newResident.room_number}
                onChange={(e) => setNewResident(prev => ({ ...prev, room_number: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none"
              >
                <option value="Room 101-A">Room 101-A (Single Room)</option>
                <option value="Room 102-A">Room 102-A (Single Room)</option>
                <option value="Room 201-B">Room 201-B (2-in-a-room)</option>
                <option value="Room 202-B">Room 202-B (2-in-a-room)</option>
                <option value="Room 301-C">Room 301-C (3-in-a-room)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regNotes" className="text-slate-700 dark:text-zinc-300 font-semibold">Initial Conduct/Disciplinary Notes</Label>
              <textarea
                id="regNotes"
                value={newResident.disciplinary_notes}
                onChange={(e) => setNewResident(prev => ({ ...prev, disciplinary_notes: e.target.value }))}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none"
                rows={2}
                placeholder="Disciplinary notes..."
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterDialogOpen(false)}
                className="border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold rounded-xl px-5 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold rounded-xl px-6 py-2 cursor-pointer shadow-sm"
              >
                Create Resident
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Resident Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-zinc-100">
              <span>Manage Student File</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400 text-xs">
              Update check-in booking status or edit student conduct records.
            </DialogDescription>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-500 dark:text-zinc-400 block">Student Resident:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                  {selectedResident.first_name} {selectedResident.last_name}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editStatus" className="text-slate-700 dark:text-zinc-300 font-semibold">Booking & Check-in Status</Label>
                <select
                  id="editStatus"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="Pending">Pending Validation</option>
                  <option value="Confirmed">Confirmed / Checked-In</option>
                  <option value="Cancelled">Cancelled / Checked-Out</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editNotes" className="text-slate-700 dark:text-zinc-300 font-semibold">Conduct & Disciplinary Notes</Label>
                <textarea
                  id="editNotes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-900 dark:text-zinc-100 text-xs focus:outline-none"
                  placeholder="Record curfew violations, roommates reports, or warning notes..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-xs rounded-xl px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl px-5 py-2 cursor-pointer shadow-sm"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
