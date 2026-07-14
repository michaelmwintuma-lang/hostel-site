"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Users, BookOpen, CreditCard, Clock, Activity, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface StatItem {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<any>;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled' | 'Rejected'>('Pending');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
        // Query actual bookings count
        const { data: bookingsData } = await supabase.from('bookings').select('id, status, balance_due');
        const { data: roomsData } = await supabase.from('rooms').select('id, status');
        const { data: paymentsData } = await supabase.from('payments').select('amount_paid, status');

        // Occupancy calculation
        const totalRooms = roomsData?.length || 0;
        const fullyOccupiedRooms = roomsData?.filter((r: any) => r.status === 'Fully_Occupied' || r.status === 'Occupied').length || 0;
        const occupancyRate = totalRooms > 0 ? ((fullyOccupiedRooms / totalRooms) * 100).toFixed(1) : "0.0";

        // Revenue calculation
        const totalRevenue = paymentsData
          ?.filter((p: any) => p.status === 'Successful')
          ?.reduce((acc: number, curr: any) => acc + Number(curr.amount_paid), 0) || 0;

        // Outstanding balance
        const outstanding = bookingsData
          ?.filter((b: any) => b.status === 'Confirmed' || b.status === 'Pending')
          ?.reduce((acc: number, curr: any) => acc + Number(curr.balance_due), 0) || 0;

        // Active students (confirmed bookings)
        const activeStudents = bookingsData?.filter((b: any) => b.status === 'Confirmed').length || 0;

        setStats([
          { title: "Occupancy Rate", value: `${occupancyRate}%`, description: `${fullyOccupiedRooms} of ${totalRooms} rooms occupied`, icon: BookOpen },
          { title: "Total Revenue", value: `${totalRevenue.toLocaleString()} GHS`, description: "Total payments processed", icon: CreditCard },
          { title: "Outstanding Balance", value: `${outstanding.toLocaleString()} GHS`, description: "Pending student payments", icon: Clock },
          { title: "Active Residents", value: `${activeStudents} Student${activeStudents !== 1 ? 's' : ''}`, description: "Confirmed hostel residents", icon: Users }
        ]);

        // Load recent bookings
        const { data: recent, error: recentError } = await supabase
          .from('bookings')
          .select(`
            id,
            status,
            balance_due,
            created_at,
            students (first_name, last_name, email),
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
          { title: "Occupancy Rate", value: "0.0%", description: "No rooms occupied", icon: BookOpen },
          { title: "Total Revenue", value: "0 GHS", description: "No payments processed", icon: CreditCard },
          { title: "Outstanding Balance", value: "0 GHS", description: "No pending payments", icon: Clock },
          { title: "Active Residents", value: "0 Students", description: "No confirmed residents", icon: Users }
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
        loadDashboardData(); // Refresh stats dynamically
      } else {
        console.error('Failed to confirm booking:', error);
        alert('Failed to confirm booking. Please try again.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6 text-[#E03B0D]" />
            <span>Dashboard Overview</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Real-time management metrics, inventory statuses, and recent ledger activities.
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full text-xs text-slate-500 shadow-sm">
          <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span>System Live</span>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Card key={idx} className="border-slate-200 bg-white h-[120px] animate-pulse shadow-sm" />
          ))
        ) : (
          stats.map((stat, idx) => (
            <Card key={idx} className="group border-slate-200 bg-white text-slate-800 shadow-sm transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">{stat.title}</span>
                <stat.icon className="h-5 w-5 text-[#E03B0D] transition-transform duration-300 group-hover:scale-125" />
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-0">
                <div className="text-2xl md:text-3xl font-extrabold text-[#E03B0D] group-hover:text-[#10B981] transition-colors duration-300">{stat.value}</div>
                <p className="text-[10px] text-slate-500 leading-none">{stat.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Activity Table */}
      <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
        <CardHeader className="p-6 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <span>Bookings Overview</span>
              </CardTitle>
              <CardDescription className="text-slate-500 text-xs mt-1">
                Filter and review student applications.
              </CardDescription>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-lg self-start md:self-auto">
              {['Pending', 'Confirmed', 'Cancelled', 'All'].map(status => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    statusFilter === status 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Selected Room</th>
                  <th className="px-6 py-4">Outstanding</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Applied At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} className="h-14 animate-pulse"><td colSpan={6}></td></tr>
                  ))
                ) : (() => {
                  const filteredBookings = recentBookings.filter(b => 
                    statusFilter === 'All' ? true : b.status === statusFilter
                  );
                  
                  if (filteredBookings.length === 0) {
                    return (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium text-xs">
                          {statusFilter === 'Pending' 
                            ? '🎉 All booking applications have been successfully processed!'
                            : `No ${statusFilter.toLowerCase()} bookings found.`}
                        </td>
                      </tr>
                    );
                  }
                  return filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {booking.students?.first_name} {booking.students?.last_name}
                        </div>
                        <div className="text-[10px] text-slate-500">{booking.students?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {booking.rooms?.room_number || 'N/A'}
                      </td>
                      <td className="px-6 py-4 font-semibold text-[#E03B0D]">
                        {Number(booking.balance_due).toLocaleString()} GHS
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                            booking.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : booking.status === 'Pending'
                              ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                              : 'bg-red-500/10 text-red-600 border border-red-500/20'
                          }`}
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(booking.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === 'Pending' && (
                          <button
                            onClick={() => handleConfirm(booking.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-1.5 px-4 rounded-full text-[10px] transition-colors shadow-sm"
                          >
                            Confirm
                          </button>
                        )}
                        {booking.status === 'Confirmed' && (
                          <span className="text-[10px] font-semibold text-slate-400">Processed</span>
                        )}
                      </td>
                    </tr>
                  ));
                })()}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
