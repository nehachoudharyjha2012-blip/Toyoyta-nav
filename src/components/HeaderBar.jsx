import React from 'react';
import { Mic, Wifi, WifiOff, Signal, Battery, Sun, Moon } from 'lucide-react';

export default function HeaderBar({ currentTime, batteryLevel, isOnline, currentTheme, toggleTheme, carBadgeName }) {
  return (
    <div className="absolute top-4 right-6 z-40 flex items-center gap-3 oem-pill px-4 py-2 shadow-2xl pointer-events-auto">
      <div className="flex items-center gap-3 border-r border-black/15 dark:border-white/20 pr-3 opacity-90 text-xs font-mono">
        <Mic size={15} />
        {isOnline ? <Wifi size={15} className="text-emerald-500" /> : <WifiOff size={15} className="text-amber-500" />}
        <Signal size={15} />
        <div className="flex items-center gap-1">
          <Battery size={15} />
          <span className="text-[10px] font-bold">{batteryLevel}%</span>
        </div>
      </div>

      <div className="text-sm font-bold tracking-wider font-mono pr-1">
        {currentTime || "6:16"}
      </div>

      <button
        onClick={toggleTheme}
        className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center spring-tap cursor-pointer ml-1"
        title="Toggle Light / Dark Mode"
      >
        {currentTheme === "dark" ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-blue-600" />}
      </button>
    </div>
  );
}
