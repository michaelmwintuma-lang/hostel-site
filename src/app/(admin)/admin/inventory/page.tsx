"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { BookOpen, Layers, Edit2, ShieldAlert, Sparkles, Plus } from 'lucide-react';

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
    id: string;
    name: string;
  };
}

export default function InventoryManagementPage() {
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  // Dialog states
  const [selectedType, setSelectedType] = useState<RoomType | null>(null);
  const [isTypeDialogOpen, setIsTypeDialogOpen] = useState(false);
  const [editPrice, setEditPrice] = useState(0);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [editRoomStatus, setEditRoomStatus] = useState('');



  async function loadInventory() {
    try {
      const { data: types, error: typesError } = await supabase
        .from('room_types')
        .select('id, name, capacity, price_per_sem, amenities');

      const { data: physicalRooms, error: roomsError } = await supabase
        .from('rooms')
        .select(`
          id,
          room_number,
          status,
          room_types (id, name)
        `);

      if (typesError) {
        console.error('Error fetching room types:', typesError);
      } else {
        const formattedTypes = (types || []).map((t: any) => ({
          ...t,
          amenities: Array.isArray(t.amenities) ? t.amenities : []
        }));
        setRoomTypes(formattedTypes);
      }

      if (roomsError) {
        console.error('Error fetching rooms:', roomsError);
      } else {
        const formattedRooms = (physicalRooms || []).map((r: any) => ({
          id: r.id,
          room_number: r.room_number,
          status: r.status,
          room_type: {
            id: r.room_types?.id || '',
            name: r.room_types?.name || ''
          }
        }));
        setRooms(formattedRooms);
      }

    } catch (err) {
      console.error('Error loading inventory data:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, []);

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

      // Update state locally
      setRoomTypes(prev =>
        prev.map(t => (t.id === selectedType.id ? { ...t, price_per_sem: editPrice } : t))
      );

      setIsTypeDialogOpen(false);
    } catch (err) {
      console.error('Error saving room type pricing:', err);
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
    <div className="space-y-8 bg-slate-50 text-slate-800">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-[#E03B0D]" />
          <span>Inventory Management</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Adjust seasonal semester pricing parameters and toggle physical room maintenance categories.
        </p>
      </div>

      <Tabs defaultValue="types" className="w-full">
        <TabsList className="bg-white border border-slate-200 p-1.5 rounded-full mb-6 shadow-sm">
          <TabsTrigger value="types" className="text-xs rounded-full px-5 py-1.5 text-slate-500 data-active:!bg-[#E03B0D] data-active:!text-white hover:text-slate-900 data-active:hover:text-white font-semibold cursor-pointer transition-all">
            Room Config & Rates
          </TabsTrigger>
          <TabsTrigger value="physical" className="text-xs rounded-full px-5 py-1.5 text-slate-500 data-active:!bg-[#E03B0D] data-active:!text-white hover:text-slate-900 data-active:hover:text-white font-semibold cursor-pointer transition-all">
            Physical Rooms
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Configuration & pricing */}
        <TabsContent value="types">
          <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                      <th className="px-6 py-4">Configuration Name</th>
                      <th className="px-6 py-4">Occupant Capacity</th>
                      <th className="px-6 py-4">Rent Per Semester</th>
                      <th className="px-6 py-4">Key Amenities</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr className="h-14 animate-pulse"><td colSpan={5}></td></tr>
                    ) : (
                      roomTypes.map((type) => (
                        <tr key={type.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {type.name}
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-medium">
                            {type.capacity} Bed{type.capacity > 1 ? 's' : ''} per room
                          </td>
                          <td className="px-6 py-4 font-semibold text-[#E03B0D]">
                            {type.price_per_sem.toLocaleString()} GHS
                          </td>
                          <td className="px-6 py-4 text-slate-500">
                            {type.amenities?.join(', ') || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              onClick={() => openTypeEdit(type)}
                              className="text-[#E03B0D] hover:bg-[#E03B0D]/10 rounded-lg p-2 h-auto text-xs cursor-pointer"
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
          <Card className="border-slate-200 bg-white text-slate-800 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 uppercase tracking-widest font-semibold text-[10px]">
                      <th className="px-6 py-4">Room Number</th>
                      <th className="px-6 py-4">Assigned Room Type</th>
                      <th className="px-6 py-4">Physical Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr className="h-14 animate-pulse"><td colSpan={4}></td></tr>
                    ) : (
                      rooms.map((room) => (
                        <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900">
                            {room.room_number}
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-medium">
                            {room.room_type?.name}
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                room.status === 'Available'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : room.status === 'Fully_Occupied'
                                  ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                                  : 'bg-red-500/10 text-red-600 border border-red-500/20'
                              }`}
                            >
                              {room.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              variant="ghost"
                              onClick={() => openRoomEdit(room)}
                              className="text-[#E03B0D] hover:bg-[#E03B0D]/10 rounded-lg p-2 h-auto text-xs cursor-pointer"
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
        <DialogContent className="bg-white border-slate-200 text-slate-800 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Adjust Semester Rent</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Update pricing parameters for future reservations.
            </DialogDescription>
          </DialogHeader>

          {selectedType && (
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">Configuration:</span>
                <span className="font-bold text-slate-900">{selectedType.name}</span>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-slate-600 font-semibold">Rent (GHS per semester)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  className="bg-slate-50 border-slate-200 text-slate-800"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsTypeDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-full px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveTypePrice}
              className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-5 py-2 hover:bg-[#A12808] cursor-pointer"
            >
              Save Pricing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Physical Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-800 max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">Adjust Room Status</DialogTitle>
            <DialogDescription className="text-slate-500 text-xs">
              Change status configuration for maintenance or reservation overrides.
            </DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-4 py-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">Room Number:</span>
                <span className="font-bold text-slate-900">{selectedRoom.room_number}</span>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-600 font-semibold">Physical Category Status</Label>
                <select
                  id="status"
                  value={editRoomStatus}
                  onChange={(e) => setEditRoomStatus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#E03B0D]"
                >
                  <option value="Available">Available (Accept Bookings)</option>
                  <option value="Fully_Occupied">Fully Occupied</option>
                  <option value="Maintenance">Maintenance (Block Bookings)</option>
                </select>
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-between pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              onClick={() => setIsRoomDialogOpen(false)}
              className="border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-full px-5 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRoomStatus}
              className="bg-[#E03B0D] text-white font-semibold text-xs rounded-full px-5 py-2 hover:bg-[#A12808] cursor-pointer"
            >
              Save Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
