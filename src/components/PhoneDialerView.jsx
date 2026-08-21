import React, { useState, useCallback, memo } from 'react';
import { Phone, Delete, ShieldAlert, PhoneCall } from 'lucide-react';

// 1. Memoized Speed Dial Panel (Will NEVER re-render on keypress)
const SpeedDialSection = memo(({ onCall }) => {
  return (
    <div className="card-panel" style={{ flex: '0 0 38%', willChange: 'transform', transform: 'translateZ(0)' }}>
      <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' }}>SPEED DIAL</span>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button
          type="button"
          onClick={() => onCall('112')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(127, 29, 29, 0.3)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 8, cursor: 'pointer', textAlign: 'left', outline: 'none' }}
        >
          <ShieldAlert style={{ width: 16, height: 16, color: '#f87171', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fecaca' }}>Emergency</div>
            <div style={{ fontSize: 9, color: '#f87171', fontFamily: 'monospace' }}>112 Direct</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onCall('1033')}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(120, 53, 15, 0.3)', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 8, cursor: 'pointer', textAlign: 'left', outline: 'none' }}
        >
          <Phone style={{ width: 16, height: 16, color: '#fbbf24', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#fef3c7' }}>Highway Help</div>
            <div style={{ fontSize: 9, color: '#fbbf24', fontFamily: 'monospace' }}>1033 NHAI</div>
          </div>
        </button>
      </div>

      <div style={{ padding: '4px 8px', background: '#18181b', border: '1px solid #27272a', borderRadius: 6, fontSize: 9, display: 'flex', justifyContent: 'space-between', fontFamily: 'monospace' }}>
        <span>GSM GATEWAY:</span>
        <span style={{ color: '#34d399', fontWeight: 'bold' }}>READY</span>
      </div>
    </div>
  );
});

// 2. Memoized Static Keypad Grid
const KeypadGrid = memo(({ onDigit }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, width: '100%', maxWidth: 200, margin: '4px auto' }}>
      {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onDigit(k)}
          style={{ height: 26, backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 5, color: '#fff', fontSize: 12, fontWeight: 'bold', fontFamily: 'monospace', cursor: 'pointer', outline: 'none' }}
        >
          {k}
        </button>
      ))}
    </div>
  );
});

export default function PhoneDialerView() {
  const [dialNumber, setDialNumber] = useState('');

  const handleDigit = useCallback((digit) => {
    setDialNumber((prev) => (prev.length < 15 ? prev + digit : prev));
  }, []);

  const handleBackspace = useCallback(() => {
    setDialNumber((prev) => prev.slice(0, -1));
  }, []);

  const handleDirectCall = useCallback((num) => {
    const target = num || dialNumber;
    if (target) window.location.href = `tel:${target}`;
  }, [dialNumber]);

  return (
    <div className="split-view">
      <SpeedDialSection onCall={handleDirectCall} />

      <div className="card-panel" style={{ flex: '0 0 60%' }}>
        <div style={{ width: '100%', height: 32, backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', fontFamily: 'monospace' }}>
          <span style={{ color: dialNumber ? '#fff' : '#52525b', fontSize: dialNumber ? 13 : 10, fontWeight: 'bold' }}>
            {dialNumber || 'Dial digits...'}
          </span>
          {dialNumber && (
            <button type="button" onClick={handleBackspace} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', outline: 'none' }}>
              <Delete style={{ width: 14, height: 14 }} />
            </button>
          )}
        </div>

        <KeypadGrid onDigit={handleDigit} />

        <button
          type="button"
          onClick={() => handleDirectCall()}
          disabled={!dialNumber}
          style={{ width: '100%', maxWidth: 200, height: 28, margin: '0 auto', borderRadius: 6, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 11, fontWeight: 'bold', cursor: dialNumber ? 'pointer' : 'not-allowed', backgroundColor: dialNumber ? '#16a34a' : '#27272a', color: dialNumber ? '#fff' : '#71717a' }}
        >
          <PhoneCall style={{ width: 12, height: 12 }} />
          <span>Call Now</span>
        </button>
      </div>
    </div>
  );
}
