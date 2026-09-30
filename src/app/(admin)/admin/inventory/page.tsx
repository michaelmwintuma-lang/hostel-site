"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Box, Edit2 } from 'lucide-react';

interface RoomType {
  id: string;
  name: string;
  capacity: number;
  price_per_sem: number;
  amenities: string[];
}

interface Room {
  id: string;
  room_number: string;
  status: string;
  room_type: {
    name: string;
    capacity: number;
  };
}

export default function InventoryManagementPage() {
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  // Dialog state for updating prices
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);

  // Dialog state for updating physical room status
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [editRoomStatus, setEditRoomStatus] = useState<string>('');
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  async function loadInventory() {
    try {
      setLoading(true);
      
      const { data: typesData, error: typesError } = await supabase
        .from('room_types')
        .select('*')
        .order('capacity', { ascending: true });

      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          room_number,
          status,
          room_type:room_types (name, capacity)
        `)
        .order('room_number', { ascending: true });

      if (typesError) console.error('Error fetching room types:', typesError);
      if (roomsError) console.error('Error fetching rooms:', roomsError);

      setRoomTypes(typesData || []);
      setRooms((roomsData as any) || []);
    } catch (err) {
      console.error('Unexpected error loading inventory:', err);
    } finally {
      setLoading(false);
    }
  }

  const openTypeEdit = (type: RoomType) => {
    setSelectedType(type);
    setEditPrice(type.price_per_sem);
    setIsTypeDialogOpen(true);
  };

  const handleSaveTypePrice = async () => {
    if (!selectedType) return;
    try {
      const { error } = await supabase
        .from('room_types')
        .update({ price_per_sem: editPrice })
        .eq('id', selectedType.id);

      if (error) {
        console.error('Failed to update price:', error);
        alert('Failed to update pricing');
        return;
      }

      // Update state locally
      setRoomTypes(prev => 
        prev.map(t => (t.id === selectedType.id ? { ...t, price_per_sem: editPrice } : t))
      );

      setIsTypeDialogOpen(false);
    } catch (err) {
      console.error('Error saving type price:', err);
    }
  };

  const openRoomEdit = (room: Room) => {
    setSelectedRoom(room);
    setEditRoomStatus(room.status);
    setIsRoomDialogOpen(true);
  };

  const handleSaveRoomStatus = async () => {
    if (!selectedRoom) return;
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ status: editRoomStatus })
        .eq('id', selectedRoom.id);

      if (error) {
        console.error('Failed to update room status:', error);
        alert('Failed to update room status');
        return;
      }

      // Update state locally
      setRooms(prev =>
        prev.map(r => (r.id === selectedRoom.id ? { ...r, status: editRoomStatus } : r))
      );

      setIsRoomDialogOpen(false);
    } catch (err) {
      console.error('Error saving physical room status:', err);
    }
  };

  return (
    <div className="space-y-8 bg-transparent text-slate-900 dark:text-zinc-100">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 flex items-center space-x-2">
          <Box className="h-6 w-6 text-slate-700 dark:text-zinc-300" />
          <span>Inventory Management</span>
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
          Adjust seasonal semester pricing parameters and manage physical room availability.
        </p>
      </div>

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 p-1 rounded-xl mb-6 shadow-sm">
          <TabsTrigger 
            value="types" 
            className="text-xs rounded-lg px-5 py-1.5 text-slate-600 dark:text-zinc-400 data-active:!bg-slate-900 data-active:!text-white dark:data-active:!bg-zinc-100 dark:data-active:!text-zinc-900 font-semibold cursor-pointer"
          >
            Room Config & Rates
          </TabsTrigger>
          <TabsTrigger 
            value="physical" 
            className="text-xs rounded-lg px-5 py-1.5 text-slate-600 dark:text-zinc-400 data-active:!bg-slate-900 data-active:!text-white dark:data-active:!bg-zinc-100 dark:data-active:!text-zinc-900 font-semibold cursor-pointer"
          >
            Physical Rooms
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Configuration & pricing */}
        <TabsContent value="types">
          <Card className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-widest font-semibold text-[10px]">
                      <th className="px-6 py-4">Configuration Name</th>
                      <th className="px-6 py-4">Occupant Capacity</th>
                      <th className="px-6 py-4">Rent Per Semester</th>
                      <th className="px-6 py-4">Key Amenities</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {loading ? (
                      <tr className="h-14 animate-pulse"><td colSpan={5}></td></tr>
                    ) : (
                      roomTypes.map((type) => (
                        <tr key={type.id} className="bg-white dark:bg-zinc-900">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-zinc-100">
                            {type.name}
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-zinc-300 font-medium">
                            {type.capacity} Bed{type.capacity > 1 ? 's' : ''} per room
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-zinc-100">
                            {type.price_per_sem.toLocaleString()} GHS
                          </td>
                          <td className="px-6 py-4 text-slate-500 dark:text-zinc-400">
                            {type.amenities?.join(', ') || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              onClick={() => openTypeEdit(type)}
                              className="text-slate-700 dark:text-zinc-300 rounded-lg p-2 h-auto text-xs cursor-pointer border border-slate-200 dark:border-zinc-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Physical room list */}
        <TabsContent value="physical">
          <Card className="border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 uppercase tracking-widest font-semibold text-[10px]">
                      <th className="px-6 py-4">Room Number</th>
                      <th className="px-6 py-4">Assigned Room Type</th>
                      <th className="px-6 py-4">Physical Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                    {loading ? (
                      <tr className="h-14 animate-pulse"><td colSpan={4}></td></tr>
                    ) : (
                      rooms.map((room) => (
                        <tr key={room.id} className="bg-white dark:bg-zinc-900">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-zinc-100">
                            {room.room_number}
                          </td>
                          <td className="px-6 py-4 text-slate-700 dark:text-zinc-300 font-medium">
                            {room.room_type?.name}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={`rounded-md px-2.5 py-0.5 text-[9px] font-semibold border ${
                                room.status === 'Available'
                                  ? 'bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700'
                                  : room.status === 'Fully_Occupied'
                                  ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent'
                                  : 'bg-transparent text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-700'
                              }`}
                            >
                              {room.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              onClick={() => openRoomEdit(room)}
                              className="text-slate-700 dark:text-zinc-300 rounded-lg p-2 h-auto text-xs cursor-pointer border border-slate-200 dark:border-zinc-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Room Type Dialog */}
      <Dialog open={isTypeDialogOpen} onOpenChange={setIsTypeDialogOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-zinc-100">Adjust Semester Rent</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400 text-xs">
              Update pricing parameters for future reservations.
            </DialogDescription>
          </DialogHeader>

          {selectedType && (
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 dark:text-zinc-400 block">Configuration:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{selectedType.name}</span>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-slate-700 dark:text-zinc-300 font-semibold">Rent (GHS per semester)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 rounded-xl"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setIsTypeDialogOpen(false)}
              className="border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-xs rounded-xl px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTypePrice}
              className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl px-5 py-2 cursor-pointer shadow-sm"
            >
              Save Pricing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Physical Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-zinc-100">Adjust Room Status</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-zinc-400 text-xs">
              Change status configuration for maintenance or reservation overrides.
            </DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 dark:text-zinc-400 block">Room Number:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{selectedRoom.room_number}</span>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-700 dark:text-zinc-300 font-semibold">Physical Category Status</Label>
                <select
                  id="status"
                  value={editRoomStatus}
                  onChange={(e) => setEditRoomStatus(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-2.5 text-slate-900 dark:text-zinc-100 focus:outline-none"
                >
                  <option value="Available">Available (Accept Bookings)</option>
                  <option value="Fully_Occupied">Fully Occupied</option>
                  <option value="Maintenance">Maintenance (Block Bookings)</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setIsRoomDialogOpen(false)}
              className="border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-xs rounded-xl px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRoomStatus}
              className="bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs rounded-xl px-5 py-2 cursor-pointer shadow-sm"
            >
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
