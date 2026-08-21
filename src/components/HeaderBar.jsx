import React, { useState, useEffect } from 'react';
import { Wifi, BatteryCharging, Battery, Mic, Sun, ShieldCheck } from 'lucide-react';

export default function HeaderBar() {
  const [time, setTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        battery.addEventListener('levelchange', () => setBatteryLevel(Math.round(battery.level * 100)));
        battery.addEventListener('chargingchange', () => setIsCharging(battery.charging));
      });
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return (
    <header className="h-14 w-full flex items-center justify-between px-5 bg-zinc-950 border-b border-zinc-800/80 shrink-0 select-none">
      <div className="flex items-center gap-2.5">
        <span className="text-xs uppercase tracking-widest text-blue-500 font-mono font-bold">Toyota Multimedia OS</span>
        <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950/60 text-blue-400 border border-blue-800/40 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-blue-400" /> ACTIVE
        </span>
      </div>

      <div className="flex items-center gap-4 bg-zinc-900/90 px-4 py-1.5 rounded-full border border-zinc-800 shadow-inner">
        <Mic className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer" />
        <Wifi className={`w-4 h-4 ${isOnline ? 'text-emerald-400' : 'text-zinc-600'}`} />
        <div className="flex items-center gap-1 text-xs font-mono font-bold text-zinc-200">
          {isCharging ? <BatteryCharging className="w-4 h-4 text-emerald-400" /> : <Battery className="w-4 h-4 text-zinc-300" />}
          <span>{batteryLevel}%</span>
        </div>
        <span className="text-xs font-bold font-mono text-white tracking-wider border-l border-zinc-700 pl-3">
          {time}
        </span>
        <Sun className="w-4 h-4 text-amber-400 cursor-pointer" />
      </div>
    </header>
  );
}
