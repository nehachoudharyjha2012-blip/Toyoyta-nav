import React, { useState, useRef } from 'react';
import { Radio, Play, Pause, Volume2, Signal } from 'lucide-react';

const stations = [
  { freq: '98.3 FM', name: 'Bollywood Hits Radio', genre: 'Indian Hits', streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { freq: '102.4 FM', name: 'Lofi Drive 24/7', genre: 'Chillhop Beats', streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv' },
  { freq: '104.0 FM', name: 'BBC World Service', genre: 'Global News & Talk', streamUrl: 'https://stream.live.vc.bbcmedia.co.uk/bbc_world_service' },
  { freq: '93.5 FM', name: 'Classic Retro India', genre: '70s-90s Classics', streamUrl: 'https://stream.zeno.fm/f3wvbbqmdg8uv' }
];

export default function RadioView() {
  const [currentStation, setCurrentStation] = useState(stations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(85);
  const radioAudioRef = useRef(null);

  const toggleTune = () => {
    if (!radioAudioRef.current) return;
    if (isPlaying) {
      radioAudioRef.current.pause();
      setIsPlaying(false);
    } else {
      radioAudioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleStationSelect = (station) => {
    setCurrentStation(station);
    setIsPlaying(false);
    setTimeout(() => {
      if (radioAudioRef.current) {
        radioAudioRef.current.load();
        radioAudioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }, 100);
  };

  return (
    <div className="split-view">
      <audio
        ref={radioAudioRef}
        src={currentStation.streamUrl}
        onVolumeChange={() => {
          if (radioAudioRef.current) radioAudioRef.current.volume = volume / 100;
        }}
      />

      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' }}>FM TUNER ENGINE</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, color: isPlaying ? '#10b981' : '#71717a', fontFamily: 'monospace' }}>
            <Signal style={{ width: 11, height: 11 }} /> {isPlaying ? 'LIVE STREAM' : 'STANDBY'}
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: 'auto 0' }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: '#38bdf8' }}>
            {currentStation.freq}
          </div>
          <div style={{ fontSize: 13, fontWeight: 'bold', color: '#f4f4f5', marginTop: 4 }}>{currentStation.name}</div>
          <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: 'monospace' }}>{currentStation.genre}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
            <Volume2 style={{ width: 14, height: 14, color: '#71717a' }} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => {
                const v = +e.target.value;
                setVolume(v);
                if (radioAudioRef.current) radioAudioRef.current.volume = v / 100;
              }}
              style={{ width: '100%', accentColor: '#2563eb', height: 4 }}
            />
            <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#a1a1aa', width: 24 }}>{volume}%</span>
          </div>

          <button
            onClick={toggleTune}
            className="action-btn-primary"
            style={{ backgroundColor: isPlaying ? '#dc2626' : '#2563eb' }}
          >
            {isPlaying ? <Pause style={{ width: 14, height: 14 }} /> : <Play style={{ width: 14, height: 14 }} />}
            <span>{isPlaying ? 'STOP RADIO' : 'TUNE STATION'}</span>
          </button>
        </div>
      </div>

      <div className="card-panel">
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#a1a1aa', fontWeight: 'bold' }}>STATION MATRIX</span>
        <div className="panel-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {stations.map((station) => (
            <div
              key={station.freq}
              onClick={() => handleStationSelect(station)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: 6,
                background: currentStation.freq === station.freq ? 'rgba(37,99,235,0.2)' : '#18181b',
                border: `1px solid ${currentStation.freq === station.freq ? '#3b82f6' : '#27272a'}`,
                cursor: 'pointer'
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 'bold', color: currentStation.freq === station.freq ? '#93c5fd' : '#f4f4f5' }}>
                  {station.name}
                </div>
                <div style={{ fontSize: 9, color: '#71717a', fontFamily: 'monospace' }}>{station.genre}</div>
              </div>
              <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 'bold', color: '#38bdf8' }}>{station.freq}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
