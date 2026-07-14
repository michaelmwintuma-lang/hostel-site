'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, SignInButton } from '@clerk/nextjs';
import { Menu, X } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import AppLogo from '@/components/AppLogo';

interface HeaderProps {
  isUserSignedIn: boolean;
  isClerkConfigured: boolean;
}

export default function Header({ isUserSignedIn, isClerkConfigured }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);
  const lastScrollY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  // Measure header height so the mobile drawer can sit exactly below it
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) setHeaderHeight(headerRef.current.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Never hide the header while the mobile drawer is open
      if (isMenuOpen) return;

      const currentScrollY = window.scrollY;
      if (currentScrollY < 50) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (!isMenuOpen) setIsVisible(true);
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/rooms', label: 'Rooms & Rates' },
    { href: '/booking', label: 'Book Now' },
    { href: '/rules', label: 'Hostel Rules' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* Fixed header bar */}
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-700/60 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" onClick={closeMenu} className="flex items-center space-x-2 shrink-0">
            <AppLogo className="h-14 md:h-20 w-auto object-contain rounded-md shadow-sm" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-all pb-1 border-b-2 ${isActive
                    ? 'text-[#E03B0D] dark:text-emerald-400 border-[#E03B0D] dark:border-emerald-400'
                    : 'border-transparent hover:text-[#E03B0D] dark:hover:text-emerald-400 hover:border-[#E03B0D]/30 dark:hover:border-emerald-400/30'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Controls */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <ThemeToggle />
            <div className="hidden md:flex items-center space-x-4">
              {isUserSignedIn && (
                <>
                  <Link
                    href="/admin"
                    className="inline-flex items-center text-xs font-bold text-[#E03B0D] dark:text-emerald-400 border border-[#E03B0D]/30 dark:border-emerald-500/30 rounded-full px-3.5 py-1 hover:bg-[#E03B0D]/5 dark:hover:bg-emerald-500/10 transition-colors"
                  >
                    Admin
                  </Link>
                  <UserButton />
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex items-center justify-center p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:text-[#E03B0D] dark:hover:text-emerald-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer so page content sits below the fixed header */}
      <div style={{ height: headerHeight }} aria-hidden="true" />

      {/* Mobile Drawer - fixed overlay positioned directly below the header */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed left-0 right-0 z-40 border-t border-slate-100 dark:border-slate-700 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ top: headerHeight }}
        >
          <nav className="flex flex-col px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`text-sm font-semibold transition-colors py-3 border-b border-slate-100 dark:border-slate-800 last:border-0 ${isActive
                    ? 'text-[#E03B0D] dark:text-emerald-400 pl-3 border-l-4 border-l-[#E03B0D] dark:border-l-emerald-400 bg-[#E03B0D]/5 dark:bg-emerald-400/5'
                    : 'text-slate-700 dark:text-slate-200 pl-4 hover:text-[#E03B0D] dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isUserSignedIn && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="text-sm font-semibold text-[#E03B0D] dark:text-emerald-400"
                  >
                    Admin Dashboard
                  </Link>
                  <UserButton />
                </div>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Backdrop - tap anywhere outside to close the menu */}
      {isMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/20"
          style={{ top: headerHeight }}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}
