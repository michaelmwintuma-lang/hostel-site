"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, UserPlus, Save, ShieldCheck, Mail, Key, Trash } from 'lucide-react';

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function SystemSettingsPage() {
  const [successMsg, setSuccessMsg] = useState('');

  // Website Content states
  const [contactEmail, setContactEmail] = useState('xtracityhostels@gmail.com');
  const [contactPhone, setContactPhone] = useState('+233 (0) 50 123 4567');
  const [curfewTime, setCurfewTime] = useState('11:30 PM');

  // Staff states
  const defaultStaff = [
    { id: 'st1', name: 'James Kojo', email: 'kojo.j@xtracity.com.gh', role: 'Hostel Warden', status: 'Active' },
    { id: 'st2', name: 'Grace Baah', email: 'grace.b@xtracity.com.gh', role: 'Financial Accountant', status: 'Active' },
    { id: 'st3', name: 'Michael Mwintuma', email: 'michael@xtracity.com.gh', role: 'System Developer', status: 'Active' }
  ];

  const [mounted, setMounted] = useState(false);
  const [staff, setStaff] = useState<StaffUser[]>(defaultStaff);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('hostel_staff_data');
    if (saved) {
      try {
        setStaff(JSON.parse(saved));
      } catch (e) {
        setStaff(defaultStaff);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('hostel_staff_data', JSON.stringify(staff));
    }
  }, [staff, mounted]);

  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Assistant Warden');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess('Contact information settings saved successfully!');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newMember: StaffUser = {
      id: `st${staff.length + 1}`,
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: 'Active'
    };

    setStaff(prev => [...prev, newMember]);
    setNewStaffName('');
    setNewStaffEmail('');
    triggerSuccess(`Staff member ${newStaffName} registered successfully!`);
  };

  const handleDeleteStaff = (id: string) => {
    const person = staff.find(p => p.id === id);
    if (!person) return;
    setStaff(prev => prev.filter(p => p.id !== id));
    triggerSuccess(`Staff member ${person.name} removed successfully.`);
  };

  return (
    <div className="space-y-8 bg-slate-50 text-slate-800">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
          <Settings className="h-6 w-6 text-[#E03B0D]" />
          <span>System Settings</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Configure public hostel variables, sync gateway coordinates, and manage personnel access control roles.
        </p>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-xs p-3.5 rounded-xl flex items-center space-x-2 animate-bounce">
          <ShieldCheck className="h-4.5 w-4.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <Tabs defaultValue="public-content" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1.5 rounded-full mb-6 shadow-sm">
          <TabsTrigger value="public-content" className="text-xs rounded-full px-5 py-1.5 text-slate-500 data-active:!bg-[#E03B0D] data-active:!text-white hover:text-slate-900 data-active:hover:text-white font-semibold cursor-pointer transition-all">
            Website Parameters
          </TabsTrigger>
          <TabsTrigger value="staff" className="text-xs rounded-full px-5 py-1.5 text-slate-500 data-active:!bg-[#E03B0D] data-active:!text-white hover:text-slate-900 data-active:hover:text-white font-semibold cursor-pointer transition-all">
            Staff Access Control
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Website Parameters */}
        <TabsContent value="public-content">
          <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
            <CardContent className="p-6 md:p-8 space-y-6">
              <form onSubmit={handleSaveContactSettings} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail" className="text-gray-400">Public Inquiry Email</Label>
                    <Input
                      id="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactPhone" className="text-slate-600 font-semibold">Front Desk Phone</Label>
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="curfew" className="text-slate-600 font-semibold">Curfew Restriction Time</Label>
                    <Input
                      id="curfew"
                      value={curfewTime}
                      onChange={(e) => setCurfewTime(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-800"
                      placeholder="E.g. 11:30 PM"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="text-[10px] text-slate-500 pb-2">
                      Updating these parameters instantly alters rules and contact layout text throughout the frontend interface.
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-6 py-2 hover:bg-[#A12808] flex items-center space-x-1.5 cursor-pointer shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Config</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Staff Roles Access Control */}
        <TabsContent value="staff" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* List of current staff */}
            <Card className="lg:col-span-2 border-slate-200 bg-white text-slate-800 shadow-sm">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900">Registered Staff Directories</CardTitle>
                <CardDescription className="text-slate-500 text-xs">
                  Review administrative permissions levels and login metrics.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-widest font-semibold text-[9px]">
                        <th className="px-6 py-4">Personnel</th>
                        <th className="px-6 py-4">Role Description</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {staff.map((person) => (
                        <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900">{person.name}</div>
                            <div className="text-[10px] text-slate-500">{person.email}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-medium">
                            {person.role}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[9px] rounded-full px-2">
                              {person.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteStaff(person.id)}
                              className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full px-3 text-[10px] font-bold cursor-pointer"
                            >
                              <Trash className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Invite new staff */}
            <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-sm font-bold flex items-center space-x-1.5 text-slate-900">
                  <UserPlus className="h-4 w-4 text-[#E03B0D]" />
                  <span>Register Staff Member</span>
                </CardTitle>
                <CardDescription className="text-slate-500 text-[10px]">
                  Authorize backend administrative control panel access credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="staffName" className="text-slate-600 font-semibold">Personnel Name</Label>
                    <Input
                      id="staffName"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-800"
                      placeholder="E.g. Kofi Boateng"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staffEmail" className="text-slate-600 font-semibold">Corporate Email</Label>
                    <Input
                      id="staffEmail"
                      type="email"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-800"
                      placeholder="E.g. kofi@xtracity.com.gh"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staffRole" className="text-slate-600 font-semibold">System Role Level</Label>
                    <select
                      id="staffRole"
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
                    >
                      <option value="Hostel Warden">Hostel Warden (Full Resident Access)</option>
                      <option value="Financial Accountant">Financial Accountant (Ledger Access)</option>
                      <option value="Assistant Warden">Assistant Warden (Read Only Directory)</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#E03B0D] text-white font-semibold text-xs rounded-full py-2.5 hover:bg-[#A12808] cursor-pointer shadow-sm"
                  >
                    Authorize Account
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
