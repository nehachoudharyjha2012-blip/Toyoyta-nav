import React from 'react';
import { Navigation, Music, Radio, Phone, Car, Tv, Settings } from 'lucide-react';

export default function SidebarDock({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'nav', icon: Navigation },
    { id: 'audio', icon: Music },
    { id: 'radio', icon: Radio },
    { id: 'phone', icon: Phone },
    { id: 'fuel', icon: Car },
    { id: 'stream', icon: Tv },
    { id: 'settings', icon: Settings }
  ];

  return (
    <aside className="sidebar-dock">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`dock-btn ${isActive ? 'active' : ''}`}
          >
            <Icon style={{ width: 16, height: 16 }} />
          </button>
        );
      })}
    </aside>
  );
}
