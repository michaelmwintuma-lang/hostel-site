'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, X, LayoutDashboard, Users, Box, BookOpen, Settings } from 'lucide-react';
import AppLogo from '@/components/AppLogo';

const MENU_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Residents', href: '/admin/residents', icon: Users },
  { label: 'Inventory', href: '/admin/inventory', icon: Box },
  { label: 'Ledger', href: '/admin/ledger', icon: BookOpen },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ userFirstName, userLastName }: { userFirstName?: string | null, userLastName?: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col shrink-0 shadow-sm md:min-h-screen">
      {/* Mobile Header: Logo, Menu Toggle + Avatar */}
      <div className="flex md:hidden items-center justify-between p-4 bg-white z-10 relative">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo
              alt="Xtracity Admin Logo"
              width={120}
              height={32}
              className="h-8 w-auto object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-800 leading-tight">XTRACITY</span>
              <span className="text-[8px] font-bold text-[#E03B0D] uppercase tracking-wider">Executives</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center">
          <UserButton />
        </div>
      </div>

      {/* Navigation Links (Collapsible on Mobile) */}
      <div className={`
        absolute md:static top-[64px] left-0 w-full md:w-auto bg-white border-b md:border-none border-slate-200 z-20 
        transition-all duration-300 ease-in-out origin-top
        ${isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 md:scale-y-100 md:opacity-100'} 
        md:flex md:flex-col md:flex-1
      `}>
        {/* Desktop Logo */}
        <Link href="/" className="hidden md:flex items-center space-x-3 px-6 pt-5 pb-2 border-b border-slate-100">
          <AppLogo
            alt="Xtracity Admin Logo"
            width={120}
            height={32}
            className="h-8 w-auto object-contain rounded-md shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-800 leading-tight">XTRACITY</span>
            <span className="text-[8px] font-bold text-[#E03B0D] tracking-widest uppercase">Executives</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="flex flex-col space-y-1 px-4 pt-2 pb-6 md:px-4 md:py-4 md:flex-1">
          {MENU_ITEMS.map((item, idx) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)} // Close menu on click in mobile
                className={`flex items-center space-x-3 px-4 py-3 text-sm md:text-xs font-semibold rounded-xl transition-all ${
                  isActive 
                    ? 'text-[#E03B0D] bg-[#E03B0D]/10 border-l-4 border-[#E03B0D]' 
                    : 'text-slate-600 hover:text-[#E03B0D] hover:bg-slate-50'
                }`}
              >
                <item.icon className="h-5 w-5 md:h-4.5 md:w-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Desktop Profile Card Bottom (Hidden on Mobile) */}
      <div className="hidden md:flex p-6 border-t border-slate-100 items-center justify-between mt-auto">
        <div className="flex items-center space-x-3">
          <UserButton />
          <div className="text-left">
            <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">
              {userFirstName} {userLastName}
            </span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest block">
              Admin
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
