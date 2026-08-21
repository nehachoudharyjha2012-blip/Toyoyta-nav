import React, { useState } from 'react';
import HeaderBar from './components/HeaderBar';
import SidebarDock from './components/SidebarDock';
import MapView from './components/MapView';
import AudioView from './components/AudioView';
import RadioView from './components/RadioView';
import PhoneDialerView from './components/PhoneDialerView';
import FuelCalculatorView from './components/FuelCalculatorView';
import StreamHubView from './components/StreamHubView';
import SettingsView from './components/SettingsView';
import { AudioProvider } from './context/AudioContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('nav');

  return (
    <AudioProvider>
      <div className="app-container">
        <SidebarDock activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="main-wrapper">
          <HeaderBar />
          <main className="viewport-card">
            <div className="viewport-inner">
              {activeTab === 'nav' && <MapView />}
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
    </AudioProvider>
  );
}
