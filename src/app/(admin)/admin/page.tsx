"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Inbox } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

interface StatItem {
  title: string;
  value: string;
  description: string;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('Pending');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const { data: bookingsData } = await supabase.from('bookings').select('id, status, created_at');
      const { data: roomsData } = await supabase.from('rooms').select('id, status');

      // Occupancy calculation
      const totalRooms = roomsData?.length || 0;
      const fullyOccupiedRooms = roomsData?.filter((r: any) => r.status === 'Fully_Occupied' || r.status === 'Occupied').length || 0;
      const occupancyRate = totalRooms > 0 ? ((fullyOccupiedRooms / totalRooms) * 100).toFixed(1) : "0.0";
      const availableRooms = Math.max(0, totalRooms - fullyOccupiedRooms);

      // Active students (confirmed bookings)
      const activeStudents = bookingsData?.filter((b: any) => b.status === 'Confirmed').length || 0;

      // Pending applications
      const pendingApplications = bookingsData?.filter((b: any) => b.status === 'Pending').length || 0;

      setStats([
        { 
          title: "Occupancy Rate", 
          value: `${occupancyRate}%`, 
          description: `${fullyOccupiedRooms} of ${totalRooms} rooms occupied`
        },
        { 
          title: "Room Capacity", 
          value: `${totalRooms}`, 
          description: `${availableRooms} room${availableRooms !== 1 ? 's' : ''} currently available`
        },
        { 
          title: "Active Residents", 
          value: `${activeStudents}`, 
          description: "Confirmed student residents"
        },
        { 
          title: "Pending Applications", 
          value: `${pendingApplications}`, 
          description: "Awaiting review and approval"
        }
      ]);

      // Load recent bookings (operational student bookings, no financial columns)
      const { data: recent, error: recentError } = await supabase
        .from('bookings')
        .select(`
          id,
          status,
          created_at,
          students (first_name, last_name, email, phone),
          rooms (room_number)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!recentError && recent) {
        setRecentBookings(recent);
      } else {
        setRecentBookings([]);
      }

    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setStats([
        { title: "Occupancy Rate", value: "0.0%", description: "No rooms occupied" },
        { title: "Room Capacity", value: "0", description: "No rooms registered" },
        { title: "Active Residents", value: "0", description: "No confirmed residents" },
        { title: "Pending Applications", value: "0", description: "No applications pending" }
      ]);
      setRecentBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleConfirm = async (bookingId: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'Confirmed' })
        .eq('id', bookingId);
        
      if (!error) {
        setRecentBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Confirmed' } : b));
        loadDashboardData();
      } else {
        console.error('Failed to confirm booking:', error);
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 bg-transparent text-slate-900 dark:text-zinc-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center gap-2.5">
            <LayoutDashboard className="h-6 w-6 text-slate-700 dark:text-zinc-300" />
            <span>Dashboard Overview</span>
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
            Real-time hostel management, room occupancy, and student residence applications.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <ThemeToggle />
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-zinc-300 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-slate-400 dark:bg-zinc-500" />
            <span>System Active</span>
          </div>
        </div>
      </div>

      {/* Grid Stats — Operational Metrics, Sizable & Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-3 sm:p-4 h-[80px] sm:h-[95px] animate-pulse shadow-sm" />
          ))
        ) : (
          stats.map((stat, idx) => (
            <div 
              key={idx} 
              className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block truncate">
                  {stat.title}
                </span>
              </div>
              <div className="mt-2">
                <div className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
                  {stat.value}
                </div>
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium line-clamp-1">
                  {stat.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bookings Overview Table */}
      <div className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
              Applications & Bookings
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 text-xs mt-0.5">
              Review and process student residence applications.
            </p>
          </div>
          
          {/* Filter Tabs */}
          <div className="inline-flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl self-start sm:self-auto border border-slate-200 dark:border-zinc-700">
            {(['Pending', 'Confirmed', 'Cancelled', 'All'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg ${
                  statusFilter === status 
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                <th className="px-6 py-3.5">Student</th>
                <th className="px-6 py-3.5">Assigned Room</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Applied Date</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="h-16 animate-pulse"><td colSpan={5}></td></tr>
                ))
              ) : (() => {
                const filteredBookings = recentBookings.filter(b => 
                  statusFilter === 'All' ? true : b.status === statusFilter
                );
                
                if (filteredBookings.length === 0) {
                  return (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500 dark:text-zinc-400">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                            <Inbox className="h-5 w-5" />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-zinc-300 text-sm">
                            {statusFilter === 'Pending' 
                              ? 'All student applications processed' 
                              : `No ${statusFilter.toLowerCase()} bookings found`}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-zinc-500">
                            {statusFilter === 'Pending' 
                              ? 'There are currently no new student applications awaiting review.'
                              : 'No records match the current filter selection.'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                }
                return filteredBookings.map((booking) => (
                  <tr key={booking.id} className="bg-white dark:bg-zinc-900">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm">
                        {booking.students?.first_name} {booking.students?.last_name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-zinc-400">{booking.students?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-zinc-200 text-xs">
                      {booking.rooms?.room_number ? `Room ${booking.rooms.room_number}` : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`rounded-md px-2.5 py-0.5 text-[10px] font-semibold border ${
                          booking.status === 'Confirmed'
                            ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent'
                            : booking.status === 'Pending'
                            ? 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                            : 'bg-transparent text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-700'
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-zinc-400 text-xs font-medium">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {booking.status === 'Pending' && (
                        <button
                          type="button"
                          onClick={() => handleConfirm(booking.id)}
                          className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold py-1.5 px-4 rounded-lg text-xs shadow-sm cursor-pointer"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status === 'Confirmed' && (
                        <span className="text-xs font-medium text-slate-400 dark:text-zinc-500">Processed</span>
                      )}
                    </td>
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
