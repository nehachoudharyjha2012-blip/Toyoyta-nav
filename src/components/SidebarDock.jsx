import React from 'react';
import { Navigation, Music, Radio, Phone, Car, Tv, Settings } from 'lucide-react';

export default function SidebarDock({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'map', icon: Navigation, label: "Map" },
    { id: 'audio', icon: Music, label: "Audio" },
    { id: 'radio', icon: Radio, label: "Radio" },
    { id: 'phone', icon: Phone, label: "Phone" },
    { id: 'fuel', icon: Car, label: "Fuel" },
    { id: 'stream', icon: Tv, label: "Stream" },
    { id: 'settings', icon: Settings, label: "Setup" }
  ];

  return (
    <nav className="oem-sidebar w-[85px] h-full flex flex-col items-center py-6 gap-3 flex-shrink-0 relative">
      {tabs.map((t) => {
        const isActive = activeTab === t.id;
        const Icon = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            title={t.label}
            className={`w-[58px] h-[58px] flex flex-col items-center justify-center spring-tap cursor-pointer ${
              isActive
                ? 'oem-active-tab shadow-[0_0_15px_rgba(0,86,210,0.6)]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Icon size={26} strokeWidth={isActive ? 2.5 : 2} fill={isActive ? "currentColor" : "none"} />
          </button>
        );
      })}
    </nav>
  );
}
