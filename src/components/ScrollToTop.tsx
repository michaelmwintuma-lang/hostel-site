'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Temporarily disable smooth scrolling to instantly jump to top on route change
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    
    // Re-enable smooth scrolling after the jump
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = 'smooth';
    }, 10);
  }, [pathname]);

  return null;
}
