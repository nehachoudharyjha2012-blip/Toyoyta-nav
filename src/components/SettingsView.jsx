import React, { useState } from 'react';
import { Settings, Moon, Sun, Volume2, Shield } from 'lucide-react';

export default function SettingsView() {
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(80);

  return (
    <div className="split-view">
      <div className="card-panel">
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' }}>DISPLAY & AUDIO</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'monospace', marginBottom: 2 }}>
              <span>Panel Brightness</span>
              <span>{brightness}%</span>
            </div>
            <input type="range" min="20" max="100" value={brightness} onChange={(e) => setBrightness(e.target.value)} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontFamily: 'monospace', marginBottom: 2 }}>
              <span>Master Volume</span>
              <span>{volume}%</span>
            </div>
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} style={{ width: '100%', accentColor: '#2563eb' }} />
          </div>
        </div>
      </div>

      <div className="card-panel">
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#a1a1aa', fontWeight: 'bold' }}>SYSTEM FIRMWARE</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 10, fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: '#18181b', borderRadius: 4 }}>
            <span style={{ color: '#71717a' }}>Build:</span>
            <span style={{ color: '#38bdf8' }}>Toyota-OS v2.4.0</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: '#18181b', borderRadius: 4 }}>
            <span style={{ color: '#71717a' }}>Hardware Arch:</span>
            <span style={{ color: '#34d399' }}>Universal Auto (ARM/x86)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: '#18181b', borderRadius: 4 }}>
            <span style={{ color: '#71717a' }}>Telemetry Hook:</span>
            <span style={{ color: '#34d399' }}>ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
