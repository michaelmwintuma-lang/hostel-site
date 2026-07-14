"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, Search, Edit2, FileText, CheckCircle, XCircle, UserPlus, Trash, Plus } from 'lucide-react';

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
    balance_due?: number;
    rooms: {
      room_number: string;
    };
  }[];
}

export default function ResidentsDirectoryPage() {
  const [loading, setLoading] = useState(true);
  const [residents, setResidents] = useState<StudentResident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOutstandingOnly, setShowOutstandingOnly] = useState(false);
  
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
      const { error: studentUpdateError } = await supabase
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
      // Try DB insert with a placeholder clerk_id for manual registrations
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
        // Find matching room in DB
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
            status: 'Confirmed',
            balance_due: 7500
          });
        }
      }
    } catch (err) {
      console.error('Database registration error, proceeding with state only:', err);
    }

    // Always update local state for preview demo
    setResidents(prev => [newStudentObj, ...prev]);
    setIsRegisterDialogOpen(false);
    // Reset Form
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

  // Delete Resident
  const handleDeleteResident = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this student resident profile and all their room bookings?")) {
      return;
    }

    try {
      // Delete bookings first due to foreign key constraints
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

    // Always remove from local state
    setResidents(prev => prev.filter(r => r.id !== id));
  };

  // Filter residents list by search term
  const filteredResidents = residents.filter(r => {
    const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
    const email = r.email.toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query) || r.student_id_num.toLowerCase().includes(query);
    
    if (showOutstandingOnly) {
      const balance = r.bookings?.[0]?.balance_due || 0;
      return matchesSearch && balance > 0;
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-8 bg-slate-50 text-slate-800">
      
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
            <Users className="h-6 w-6 text-[#E03B0D]" />
            <span>Resident Management</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Search, view, register and manage student records and room placements.
          </p>
        </div>

        {/* Register Button */}
        <Button
          onClick={() => setIsRegisterDialogOpen(true)}
          className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-5 py-2.5 hover:bg-[#A12808] flex items-center space-x-2 cursor-pointer shadow-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Register Student</span>
        </Button>
      </div>

      {/* Directory Count Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-[#E03B0D]/10 rounded-xl text-[#E03B0D]">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Total Registered</span>
            <span className="text-2xl font-black text-slate-900">{residents.length} Student(s)</span>
          </div>
        </Card>
        
        <Card className="border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-emerald-500/10 rounded-xl text-emerald-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Active Rooms Placed</span>
            <span className="text-2xl font-black text-slate-900">
              {residents.filter(r => r.bookings?.[0]?.status === 'Confirmed').length} Resident(s)
            </span>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3.5 bg-amber-500/10 rounded-xl text-amber-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Pending Inquiries</span>
            <span className="text-2xl font-black text-slate-900">
              {residents.filter(r => r.bookings?.[0]?.status === 'Pending').length} Pending
            </span>
          </div>
        </Card>
      </div>

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by student name, ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200 text-slate-800 text-xs w-full rounded-xl"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="outstandingToggle"
            checked={showOutstandingOnly}
            onChange={(e) => setShowOutstandingOnly(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#E03B0D] focus:ring-[#E03B0D]"
          />
          <Label htmlFor="outstandingToggle" className="text-xs font-semibold text-slate-600 cursor-pointer">
            Show Outstanding Balances Only
          </Label>
        </div>
      </div>

      {/* Table grid */}
      <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                  <th className="px-6 py-4">Student Info</th>
                  <th className="px-6 py-4">ID / University</th>
                  <th className="px-6 py-4">Assigned Room</th>
                  <th className="px-6 py-4">Booking Status</th>
                  <th className="px-6 py-4">Disciplinary Log</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr className="h-14 animate-pulse"><td colSpan={6}></td></tr>
                ) : filteredResidents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-xs">
                      No matching student residents found.
                    </td>
                  </tr>
                ) : (
                  filteredResidents.map((resident) => {
                    const activeBooking = resident.bookings?.[0];
                    return (
                      <tr key={resident.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">
                            {resident.first_name} {resident.last_name}
                          </div>
                          <div className="text-[10px] text-slate-500">{resident.email}</div>
                          <div className="text-[10px] text-slate-500">{resident.phone_number}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-700">{resident.student_id_num}</div>
                          <div className="text-[10px] text-slate-500">{resident.university}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">
                          {activeBooking?.rooms?.room_number || (
                            <span className="text-slate-400 italic text-[10px]">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              activeBooking?.status === 'Confirmed'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : activeBooking?.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-red-500/10 text-red-600 border border-red-500/20'
                            }`}
                          >
                            {activeBooking?.status || 'No Booking'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate text-slate-500 text-[10px]">
                          {resident.disciplinary_notes || 'None'}
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end space-x-1.5 h-14">
                          <Button
                            variant="ghost"
                            onClick={() => openEditDialog(resident)}
                            className="text-[#E03B0D] hover:bg-[#E03B0D]/10 rounded-lg p-2 h-auto cursor-pointer"
                            title="Edit Student Files"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => handleDeleteResident(resident.id)}
                            className="text-red-500 hover:bg-red-50 rounded-lg p-2 h-auto cursor-pointer"
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

      {/* Register Resident Dialog Modal */}
      <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-800 max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-[#E03B0D]" />
              <span>Register New Student Resident</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Manually register a student profile and assign them a room placement.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRegisterResident} className="space-y-4 py-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="regFirstName" className="text-slate-600 font-semibold">First Name</Label>
                <Input
                  id="regFirstName"
                  required
                  value={newResident.first_name}
                  onChange={(e) => setNewResident(prev => ({ ...prev, first_name: e.target.value }))}
                  className="bg-slate-50 border-slate-200 text-slate-800"
                  placeholder="Kofi"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regLastName" className="text-slate-600 font-semibold">Last Name</Label>
                <Input
                  id="regLastName"
                  required
                  value={newResident.last_name}
                  onChange={(e) => setNewResident(prev => ({ ...prev, last_name: e.target.value }))}
                  className="bg-slate-50 border-slate-200 text-slate-800"
                  placeholder="Mensah"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regEmail" className="text-slate-600 font-semibold">Email Address</Label>
              <Input
                id="regEmail"
                type="email"
                required
                value={newResident.email}
                onChange={(e) => setNewResident(prev => ({ ...prev, email: e.target.value }))}
                className="bg-slate-50 border-slate-200 text-slate-800"
                placeholder="kofimensah@gmail.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regPhone" className="text-slate-600 font-semibold">Phone Contact</Label>
              <Input
                id="regPhone"
                value={newResident.phone_number}
                onChange={(e) => setNewResident(prev => ({ ...prev, phone_number: e.target.value }))}
                className="bg-slate-50 border-slate-200 text-slate-800"
                placeholder="E.g. +233 50 111 2222"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="regUniv" className="text-slate-600 font-semibold">University</Label>
                <Input
                  id="regUniv"
                  value={newResident.university}
                  onChange={(e) => setNewResident(prev => ({ ...prev, university: e.target.value }))}
                  className="bg-slate-50 border-slate-200 text-slate-800"
                  placeholder="E.g. University of Ghana"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regID" className="text-slate-600 font-semibold">Student ID Num</Label>
                <Input
                  id="regID"
                  value={newResident.student_id_num}
                  onChange={(e) => setNewResident(prev => ({ ...prev, student_id_num: e.target.value }))}
                  className="bg-slate-50 border-slate-200 text-slate-800"
                  placeholder="E.g. 10924823"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regRoom" className="text-slate-600 font-semibold">Assign Room Placement</Label>
              <select
                id="regRoom"
                value={newResident.room_number}
                onChange={(e) => setNewResident(prev => ({ ...prev, room_number: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
              >
                <option value="Room 101-A">Room 101-A (Single Room)</option>
                <option value="Room 102-A">Room 102-A (Single Room)</option>
                <option value="Room 201-B">Room 201-B (2-in-a-room)</option>
                <option value="Room 202-B">Room 202-B (2-in-a-room)</option>
                <option value="Room 301-C">Room 301-C (3-in-a-room)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="regNotes" className="text-slate-600 font-semibold">Initial Conduct/Disciplinary Notes</Label>
              <textarea
                id="regNotes"
                value={newResident.disciplinary_notes}
                onChange={(e) => setNewResident(prev => ({ ...prev, disciplinary_notes: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
                rows={2}
                placeholder="Disciplinary notes..."
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRegisterDialogOpen(false)}
                className="border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold rounded-full px-5 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#E03B0D] text-white font-semibold rounded-full px-6 py-2 hover:bg-[#A12808] cursor-pointer"
              >
                Create Resident
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Resident Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-800 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center space-x-2 text-slate-900">
              <span>Manage Student File</span>
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Update check-in booking status or edit student conduct records.
            </DialogDescription>
          </DialogHeader>

          {selectedResident && (
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1.5">
                <span className="text-slate-500 block">Student Resident:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedResident.first_name} {selectedResident.last_name}
                </span>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editStatus" className="text-slate-600 font-semibold">Booking & Check-in Status</Label>
                <select
                  id="editStatus"
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
                >
                  <option value="Pending">Pending Validation</option>
                  <option value="Confirmed">Confirmed / Checked-In</option>
                  <option value="Cancelled">Cancelled / Checked-Out</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="editNotes" className="text-slate-600 font-semibold">Conduct & Disciplinary Notes</Label>
                <textarea
                  id="editNotes"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
                  placeholder="Record curfew violations, roommates reports, or warning notes..."
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-full px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-5 py-2 hover:bg-[#A12808] cursor-pointer"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
