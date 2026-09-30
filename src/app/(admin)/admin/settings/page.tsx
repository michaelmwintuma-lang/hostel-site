"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, UserPlus, Save, ShieldCheck, Trash } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function SystemSettingsPage() {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Settings mock state
  const [contactEmail, setContactEmail] = useState('contact@xtracityhostels.com');
  const [contactPhone, setContactPhone] = useState('+233 50 123 4567');
  const [curfewTime, setCurfewTime] = useState('11:00 PM');

  // Staff members mock state
  const [staff, setStaff] = useState<StaffMember[]>([
    { id: '1', name: 'Bismark Ofosu', email: 'xtracityhostels@gmail.com', role: 'Executive Administrator', status: 'Active' }
  ]);

  // Form state for new staff member
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Hostel Warden');

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSuccess('Public variables & policies successfully persisted.');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;

    const newPerson: StaffMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStaffName,
      email: newStaffEmail,
      role: newStaffRole,
      status: 'Active'
    };

    setStaff(prev => [...prev, newPerson]);
    setNewStaffName('');
    setNewStaffEmail('');
    triggerSuccess(`Authorized ${newPerson.name} as ${newPerson.role}.`);
  };

  const handleDeleteStaff = (id: string) => {
    const person = staff.find(p => p.id === id);
    if (!person) return;
    setStaff(prev => prev.filter(p => p.id !== id));
    triggerSuccess(`Staff member ${person.name} removed successfully.`);
  };

  return (
    <div className="space-y-8 bg-transparent text-slate-900 dark:text-zinc-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center space-x-2">
          <Settings className="h-6 w-6 text-slate-700 dark:text-zinc-300" />
          <span>System Settings</span>
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
          Configure public hostel variables and manage personnel access control roles.
        </p>
      </div>

      {successMsg && (
        <div className="bg-slate-100 dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-xs p-3.5 rounded-xl flex items-center space-x-2">
          <ShieldCheck className="h-4.5 w-4.5 shrink-0 text-slate-700 dark:text-zinc-300" />
          <span>{successMsg}</span>
        </div>
      )}

      <Tabs defaultValue="public-content" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl mb-6 shadow-sm">
          <TabsTrigger 
            value="public-content" 
            className="text-xs rounded-lg px-5 py-1.5 text-slate-600 dark:text-zinc-400 data-active:!bg-slate-900 data-active:!text-white dark:data-active:!bg-zinc-100 dark:data-active:!text-zinc-900 font-semibold cursor-pointer"
          >
            Website Parameters
          </TabsTrigger>
          <TabsTrigger 
            value="staff" 
            className="text-xs rounded-lg px-5 py-1.5 text-slate-600 dark:text-zinc-400 data-active:!bg-slate-900 data-active:!text-white dark:data-active:!bg-zinc-100 dark:data-active:!text-zinc-900 font-semibold cursor-pointer"
          >
            Staff Access Control
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Website Parameters */}
        <TabsContent value="public-content">
          <Card className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm rounded-2xl">
            <CardContent className="p-6 md:p-8 space-y-6">
              <form onSubmit={handleSaveContactSettings} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="contactEmail" className="text-slate-700 dark:text-zinc-300 font-semibold">Public Inquiry Email</Label>
                    <Input
                      id="contactEmail"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactPhone" className="text-slate-700 dark:text-zinc-300 font-semibold">Front Desk Phone</Label>
                    <Input
                      id="contactPhone"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 dark:border-zinc-800 pt-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="curfew" className="text-slate-700 dark:text-zinc-300 font-semibold">Curfew Restriction Time</Label>
                    <Input
                      id="curfew"
                      value={curfewTime}
                      onChange={(e) => setCurfewTime(e.target.value)}
                      className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                      placeholder="E.g. 11:30 PM"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <div className="text-[10px] text-slate-500 dark:text-zinc-400 pb-2">
                      Updating these parameters instantly alters rules and contact layout text throughout the frontend interface.
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl px-6 py-2.5 flex items-center space-x-1.5 cursor-pointer shadow-sm"
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
            <Card className="lg:col-span-2 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-zinc-100">Registered Staff Directories</CardTitle>
                <CardDescription className="text-slate-500 dark:text-zinc-400 text-xs">
                  Review administrative permissions levels and personnel records.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-widest font-semibold text-[9px]">
                        <th className="px-6 py-4">Personnel</th>
                        <th className="px-6 py-4">Role Description</th>
                        <th className="px-6 py-4">State</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                      {staff.map((person) => (
                        <tr key={person.id} className="bg-white dark:bg-zinc-900">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 dark:text-zinc-100">{person.name}</div>
                            <div className="text-[10px] text-slate-500 dark:text-zinc-400">{person.email}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-zinc-300 font-medium">
                            {person.role}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className="bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700 text-[9px] rounded-md px-2">
                              {person.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              onClick={() => handleDeleteStaff(person.id)}
                              className="h-8 text-slate-500 dark:text-zinc-400 rounded-lg px-3 text-[10px] font-semibold cursor-pointer border border-slate-200 dark:border-zinc-700"
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
            <Card className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm rounded-2xl">
              <CardHeader className="p-6 border-b border-slate-100 dark:border-zinc-800">
                <CardTitle className="text-sm font-bold flex items-center space-x-1.5 text-slate-900 dark:text-zinc-100">
                  <UserPlus className="h-4 w-4 text-slate-700 dark:text-zinc-300" />
                  <span>Register Staff Member</span>
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-zinc-400 text-[10px]">
                  Authorize backend administrative control credentials.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <Label htmlFor="staffName" className="text-slate-700 dark:text-zinc-300 font-semibold">Personnel Name</Label>
                    <Input
                      id="staffName"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                      placeholder="E.g. Kofi Boateng"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staffEmail" className="text-slate-700 dark:text-zinc-300 font-semibold">Corporate Email</Label>
                    <Input
                      id="staffEmail"
                      type="email"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                      placeholder="E.g. kofi@xtracity.com.gh"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="staffRole" className="text-slate-700 dark:text-zinc-300 font-semibold">System Role Level</Label>
                    <select
                      id="staffRole"
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none"
                    >
                      <option value="Hostel Warden">Hostel Warden (Full Resident Access)</option>
                      <option value="Assistant Warden">Assistant Warden (Read Only Directory)</option>
                    </select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl py-2.5 cursor-pointer shadow-sm"
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
