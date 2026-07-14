"use client";

export default function HeroSlider() {
  return (
    <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900 group transition-all duration-500 hover:scale-[1.02] hover:shadow-emerald-900/10 flex items-center justify-center">
      {/* Dark overlay gradient for readable controls */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-20" />

      {/* Floating Glassmorphic Badge */}
      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-white/40 dark:border-slate-600/40 shadow-lg flex items-center space-x-4 z-30 transition-transform duration-300 group-hover:translate-y-[-2px]">
        <div className="h-10 w-10 rounded-full bg-[#E03B0D] text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
          X
        </div>
        <div>
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">Xtracity Hostels &amp; Apartments</h4>
          <p className="text-[10px] font-black text-[#E03B0D] dark:text-emerald-400">Located at Cosway Down, Agbogba, Accra</p>
        </div>
      </div>
    </div>
  );
}
