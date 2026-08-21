import React, { useState } from "react";
import { Trash2, Check } from "lucide-react";
export default function SettingsView({ brightness, setBrightness, speedUnit, setSpeedUnit, carBadgeName, setCarBadgeName }) {
  const [cacheCleared, setCacheCleared] = useState(false);
  const clearAllCache = () => { localStorage.clear(); setCacheCleared(true); setTimeout(() => setCacheCleared(false), 3000); };
  return (
    <div className="w-full h-full p-10 flex flex-col justify-between">
      <div className="border-b border-[#2A2A2A] pb-4"><h1 className="text-3xl font-extrabold uppercase">Vehicle Configuration</h1></div>
      <div className="grid grid-cols-2 gap-8 my-6 flex-1">
        <div className="oem-panel p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase opacity-60 mb-4 block text-[#0056D2]">Display & Units</span>
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold mb-2"><span>Brightness</span><span>{brightness}%</span></div>
              <input type="range" min={40} max={100} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-2 bg-[#333] rounded-lg appearance-none accent-[#0056D2]" />
            </div>
            <div>
              <label className="text-xs font-bold opacity-80 block mb-2">Speedometer</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setSpeedUnit("KM/H")} className={`py-3 rounded-lg text-xs font-bold spring-tap ${speedUnit === "KM/H" ? "bg-[#0056D2] text-white" : "bg-[#222]"}`}>KM/H</button>
                <button onClick={() => setSpeedUnit("MPH")} className={`py-3 rounded-lg text-xs font-bold spring-tap ${speedUnit === "MPH" ? "bg-[#0056D2] text-white" : "bg-[#222]"}`}>MPH</button>
              </div>
            </div>
          </div>
        </div>
        <div className="oem-panel p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase opacity-60 mb-4 block text-[#0056D2]">System Data</span>
            <label className="text-xs font-bold opacity-80 block mb-1">Vehicle Identity</label>
            <input type="text" value={carBadgeName} onChange={(e) => setCarBadgeName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-[#222] border border-[#333] text-sm font-bold focus:outline-none focus:border-[#0056D2] mb-6" />
          </div>
          <button onClick={clearAllCache} className="w-full py-4 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold spring-tap flex items-center justify-center gap-2">
            {cacheCleared ? <Check size={16} /> : <Trash2 size={16} />} <span>{cacheCleared ? "All Data Cleared" : "Factory Reset Storage (Cams & Logs)"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
