'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ReturnToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-7 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#E03B0D] hover:shadow-[#E03B0D]/30 focus:outline-none focus:ring-2 focus:ring-[#E03B0D] focus:ring-offset-2 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
      aria-label="Return to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
