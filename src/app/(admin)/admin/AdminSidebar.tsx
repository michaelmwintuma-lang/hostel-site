'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Menu, X, LayoutDashboard, Users, Box, Settings } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import ThemeToggle from '@/components/ThemeToggle';

const MENU_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Residents', href: '/admin/residents', icon: Users },
  { label: 'Inventory', href: '/admin/inventory', icon: Box },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({ 
  userFirstName, 
  userLastName 
}: { 
  userFirstName?: string | null; 
  userLastName?: string | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 shadow-sm md:min-h-screen">
      {/* Mobile Header: Logo, Theme Toggle, Menu Toggle + Avatar */}
      <div className="flex md:hidden items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 z-10 relative">
        <div className="flex items-center space-x-3">
          <button 
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
            aria-label="Toggle Navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/admin" className="flex items-center space-x-2.5">
            <AppLogo
              alt="Xtracity Admin Logo"
              width={110}
              height={30}
              className="h-7 w-auto object-contain rounded-md"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-100 leading-tight">XTRACITY</span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Administration</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserButton />
        </div>
      </div>

      {/* Navigation Links (Collapsible on Mobile) */}
      <div className={`
        absolute md:static top-[60px] left-0 w-full md:w-auto bg-white dark:bg-zinc-900 border-b md:border-none border-slate-200 dark:border-zinc-800 z-20 
        ${isOpen ? 'block' : 'hidden md:block'} 
        md:flex md:flex-col md:flex-1
      `}>
        {/* Desktop Brand Header */}
        <div className="hidden md:flex items-center space-x-3 px-6 py-5 border-b border-slate-200 dark:border-zinc-800">
          <AppLogo
            alt="Xtracity Admin Logo"
            width={120}
            height={34}
            className="h-8 w-auto object-contain rounded-md"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-slate-900 dark:text-zinc-100 leading-tight tracking-tight">XTRACITY</span>
            <span className="text-[9px] font-bold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">Administration</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col space-y-1.5 px-4 pt-4 pb-6 md:px-4 md:py-5 md:flex-1">
          {MENU_ITEMS.map((item, idx) => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl ${
                  isActive 
                    ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                    : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                <item.icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white dark:text-zinc-900' : 'text-slate-500 dark:text-zinc-500'}`} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Profile Card Bottom (Hidden on Mobile) */}
        <div className="hidden md:flex p-3.5 sm:p-4 border-t border-slate-200 dark:border-zinc-800 items-center justify-between mt-auto bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center space-x-3 min-w-0 flex-1 mr-2">
            <UserButton />
            <div className="text-left min-w-0 flex-1">
              <span 
                className="text-xs font-bold text-slate-900 dark:text-zinc-100 block whitespace-nowrap overflow-hidden text-ellipsis"
                title={`${userFirstName || ''} ${userLastName || ''}`}
              >
                {userFirstName} {userLastName}
              </span>
              <span className="text-[9px] font-semibold text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-1.5 py-0.5 rounded uppercase tracking-wider inline-block mt-0.5">
                Admin
              </span>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
