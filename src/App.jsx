import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import SidebarDock from './components/SidebarDock';
import AudioView from './components/AudioView';
import RadioView from './components/RadioView';
import PhoneDialerView from './components/PhoneDialerView';
import FuelCalculatorView from './components/FuelCalculatorView';
import StreamHubView from './components/StreamHubView';
import SettingsView from './components/SettingsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('audio');

  return (
    <div className="flex w-screen h-screen bg-black text-white overflow-hidden select-none">
      <SidebarDock activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        <HeaderBar />
        <main className="flex-1 w-full h-[calc(100vh-3.5rem)] overflow-hidden bg-zinc-950 p-3">
          <div className="w-full h-full rounded-2xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-xl overflow-y-auto p-4 flex flex-col">
            {activeTab === 'nav' && (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-2">
                <div className="text-4xl">🗺️</div>
                <div className="text-base font-bold text-white">Toyota Navigation Satellite Link</div>
                <div className="text-xs text-zinc-500 font-mono">Offline Maps Layer Active & Loaded</div>
              </div>
            )}
            {activeTab === 'audio' && <AudioView />}
            {activeTab === 'radio' && <RadioView />}
            {activeTab === 'phone' && <PhoneDialerView />}
            {activeTab === 'fuel' && <FuelCalculatorView />}
            {activeTab === 'stream' && <StreamHubView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  );
}
