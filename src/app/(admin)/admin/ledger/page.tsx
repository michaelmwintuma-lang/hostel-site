"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CreditCard, Search, ArrowDownCircle, Plus, ShieldCheck, DollarSign } from 'lucide-react';

interface PaymentRecord {
  id: string;
  amount_paid: number;
  payment_method: string;
  gateway_ref: string;
  status: string;
  paid_at: string;
  booking: {
    id: string;
    student: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

interface StudentForCash {
  id: string;
  first_name: string;
  last_name: string;
  bookings: {
    id: string;
    balance_due: number;
  }[];
}

export default function FinancialLedgerPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [students, setStudents] = useState<StudentForCash[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [cashStudentId, setCashStudentId] = useState('');
  const [cashAmount, setCashAmount] = useState(0);
  const [cashRef, setCashRef] = useState('');

  async function loadLedgerData() {
    try {
      // Fetch payments
      const { data: payData, error: payError } = await supabase
        .from('payments')
        .select(`
          id,
          amount_paid,
          payment_method,
          gateway_ref,
          status,
          paid_at,
          bookings (
            id,
            students (first_name, last_name, email)
          )
        `);

      // Fetch students with active bookings to log manual cash payments against
      const { data: stdData } = await supabase
        .from('students')
        .select(`
          id,
          first_name,
          last_name,
          bookings (id, balance_due)
        `);

      if (payError || !payData) {
        setPayments([]);
      } else {
        const formatted = payData.map((p: any) => ({
          id: p.id,
          amount_paid: Number(p.amount_paid),
          payment_method: p.payment_method,
          gateway_ref: p.gateway_ref || 'N/A',
          status: p.status,
          paid_at: p.paid_at || p.created_at,
          booking: {
            id: p.bookings?.id || '',
            student: {
              first_name: p.bookings?.students?.first_name || 'Deleted',
              last_name: p.bookings?.students?.last_name || 'User',
              email: p.bookings?.students?.email || ''
            }
          }
        }));
        setPayments(formatted);
      }

      if (stdData) {
        const formattedStd = stdData.map((s: any) => ({
          id: s.id,
          first_name: s.first_name,
          last_name: s.last_name,
          bookings: s.bookings || []
        }));
        setStudents(formattedStd);
      } else {
        setStudents([]);
      }

    } catch (err) {
      console.error('Error loading ledger data:', err);
      setPayments([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLedgerData();
  }, []);

  const handleLogCash = async () => {
    if (!cashStudentId || cashAmount <= 0) return;

    try {
      const selectedStudent = students.find(s => s.id === cashStudentId);
      const activeBooking = selectedStudent?.bookings?.[0];

      if (!activeBooking) {
        alert('This student does not have an active booking to log payments against.');
        return;
      }

      const generatedRef = cashRef || `CASH-REC-${Math.floor(10000 + Math.random() * 90000)}`;

      // 1. Insert successful cash payment record in Supabase
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          booking_id: activeBooking.id,
          amount_paid: cashAmount,
          payment_method: 'Cash',
          gateway_ref: generatedRef,
          status: 'Successful',
          paid_at: new Date().toISOString()
        });

      // 2. Reduce the outstanding balance on the booking
      const newBalance = Math.max(0, Number(activeBooking.balance_due) - cashAmount);
      await supabase
        .from('bookings')
        .update({ balance_due: newBalance })
        .eq('id', activeBooking.id);

      // Refresh data
      loadLedgerData();
      setIsDialogOpen(false);
      setCashStudentId('');
      setCashAmount(0);
      setCashRef('');
      setStudentSearch('');
    } catch (err) {
      console.error('Error logging cash payment:', err);
    }
  };

  // Filter payments by search query
  const filteredPayments = payments.filter(p => {
    const name = `${p.booking?.student?.first_name} ${p.booking?.student?.last_name}`.toLowerCase();
    const query = searchTerm.toLowerCase();
    return name.includes(query) || p.gateway_ref.toLowerCase().includes(query);
  });

  const totalProcessed = payments
    .filter(p => p.status === 'Successful')
    .reduce((acc, curr) => acc + curr.amount_paid, 0);

  return (
    <div className="space-y-8 bg-slate-50 text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-[#E03B0D]" />
            <span>Financial Ledger</span>
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Track card & mobile money receipts, or log manual cash rent receipts.
          </p>
        </div>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-5 py-2 hover:bg-[#A12808] flex items-center space-x-1.5 self-start md:self-auto cursor-pointer shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Log Cash Payment</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
          <CardHeader className="p-6">
            <CardDescription className="text-slate-500 text-xs uppercase tracking-wider">Processed Funds (Net)</CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600 mt-1">
              {totalProcessed.toLocaleString()} GHS
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
          <CardHeader className="p-6">
            <CardDescription className="text-slate-500 text-xs uppercase tracking-wider">Receivables / Outstanding</CardDescription>
            <CardTitle className="text-2xl font-black text-[#E03B0D] mt-1">
              {students.reduce((acc, curr) => acc + (curr.bookings?.[0]?.balance_due || 0), 0).toLocaleString()} GHS
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Control bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by student name or transaction reference..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-white border-slate-200 text-slate-800 text-xs w-full rounded-xl"
        />
      </div>

      {/* Table grid */}
      <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Transaction Reference</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount Paid</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr className="h-14 animate-pulse"><td colSpan={6}></td></tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-xs">
                      No transaction receipts matching query.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">
                          {p.booking?.student?.first_name} {p.booking?.student?.last_name}
                        </div>
                        <div className="text-[10px] text-slate-500">{p.booking?.student?.email}</div>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-700">
                        {p.gateway_ref}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className="text-slate-500 border-slate-200 uppercase tracking-widest text-[9px] rounded-md px-2 py-0.5">
                          {p.payment_method.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#E03B0D]">
                        {p.amount_paid.toLocaleString()} GHS
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            p.status === 'Successful'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-600 border border-red-500/20'
                          }`}
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(p.paid_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Log Manual Cash Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-800 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Log Manual Cash Rent</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Confirm receiving physical cash from a registered student and deduct from balance.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-xs">
            <div className="space-y-1.5">
              <Label htmlFor="cashStudent" className="text-slate-600 font-semibold">Select Student Resident</Label>
              <Input
                placeholder="Search student by name..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="mb-2 bg-slate-50 border-slate-200 text-slate-800 focus:border-[#E03B0D] focus:ring-[#E03B0D]"
              />
              <select
                id="cashStudent"
                value={cashStudentId}
                onChange={(e) => setCashStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
              >
                <option value="">Select Student...</option>
                {students
                  .filter(s => {
                    const fullName = `${s.first_name} ${s.last_name}`.toLowerCase();
                    return fullName.includes(studentSearch.toLowerCase());
                  })
                  .map(s => {
                  const balance = s.bookings?.[0]?.balance_due || 0;
                  return (
                    <option key={s.id} value={s.id} disabled={balance <= 0}>
                      {s.first_name} {s.last_name} (Owes: {balance.toLocaleString()} GHS)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cashAmount" className="text-slate-600 font-semibold">Cash Amount Received (GHS)</Label>
              <Input
                id="cashAmount"
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                className="bg-slate-50 border-slate-200 text-slate-800"
                placeholder="E.g. 4000"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cashRef" className="text-slate-600 font-semibold">Receipt Reference (Optional)</Label>
              <Input
                id="cashRef"
                value={cashRef}
                onChange={(e) => setCashRef(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-800"
                placeholder="E.g. CASH-REC-XYZ"
              />
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-full px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogCash}
              className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-5 py-2 hover:bg-[#A12808] cursor-pointer"
            >
              Log Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
