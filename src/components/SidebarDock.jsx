import React from 'react';
import { Navigation, Music, Radio, Phone, Car, Tv, Settings } from 'lucide-react';

export default function SidebarDock({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'nav', icon: Navigation, label: 'Nav' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: 'radio', icon: Radio, label: 'Radio' },
    { id: 'phone', icon: Phone, label: 'Phone' },
    { id: 'fuel', icon: Car, label: 'Vehicle' },
    { id: 'stream', icon: Tv, label: 'Media' },
    { id: 'settings', icon: Settings, label: 'Config' }
  ];

  return (
    <aside className="w-16 h-full bg-zinc-950 border-r border-zinc-800/80 flex flex-col items-center py-3 gap-1.5 shrink-0 z-20">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-12 h-11 rounded-xl flex items-center justify-center transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
            }`}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </aside>
  );
}
