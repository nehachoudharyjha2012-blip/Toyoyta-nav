import React, { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, RotateCw, Music, FolderOpen, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function AudioView() {
  const { playlist, setPlaylist, currentIndex, setCurrentIndex, currentTrack, isPlaying, togglePlay, seek, nextTrack, prevTrack, currentTime, duration, audioRef } = useAudio();
  const [volume, setVolume] = useState(85);

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newTracks = files.map((file, idx) => ({
      id: Date.now() + idx,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'Local Device File',
      url: URL.createObjectURL(file)
    }));

    setPlaylist((prev) => [...prev, ...newTracks]);
  };

  const handleVolume = (e) => {
    const v = +e.target.value;
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v / 100;
  };

  return (
    <div className="split-view">
      {/* Soundstage Cockpit Player */}
      <div className="card-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' }}>AUDIOPHILE SOUNDSTAGE</span>
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', background: '#18181b', border: '1px solid #3f3f46', borderRadius: 6, fontSize: 10, cursor: 'pointer', color: '#e4e4e7' }}>
            <FolderOpen style={{ width: 12, height: 12 }} />
            <span>Load Local MP3</span>
            <input type="file" accept="audio/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Center Track Visualizer Disc */}
        <div style={{ textAlign: 'center', margin: 'auto 0' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', margin: '0 auto', background: 'radial-gradient(circle, #2563eb 0%, #09090b 70%)', border: '2px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isPlaying ? '0 0 20px rgba(59,130,246,0.6)' : 'none', transition: 'all 0.3s' }}>
            <Music style={{ width: 28, height: 28, color: '#fff' }} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 'bold', marginTop: 8, maxWidth: 220, marginInline: 'auto', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
            {currentTrack.title}
          </div>
          <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: 'monospace' }}>{currentTrack.artist}</div>
        </div>

        {/* Timeline Slider */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, fontFamily: 'monospace', color: '#71717a' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) audioRef.current.currentTime = +e.target.value;
            }}
            style={{ width: '100%', height: 4, accentColor: '#3b82f6' }}
          />
        </div>

        {/* Modern Transport Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 4 }}>
          <button onClick={() => seek(-10)} title="Back 10s" style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
            <RotateCcw style={{ width: 16, height: 16 }} />
          </button>
          <button onClick={prevTrack} style={{ background: 'none', border: 'none', color: '#e4e4e7', cursor: 'pointer' }}>
            <SkipBack style={{ width: 18, height: 18 }} />
          </button>
          
          <button
            onClick={togglePlay}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)' }}
          >
            {isPlaying ? <Pause style={{ width: 18, height: 18 }} /> : <Play style={{ width: 18, height: 18, marginLeft: 2 }} />}
          </button>

          <button onClick={nextTrack} style={{ background: 'none', border: 'none', color: '#e4e4e7', cursor: 'pointer' }}>
            <SkipForward style={{ width: 18, height: 18 }} />
          </button>
          <button onClick={() => seek(10)} title="Forward 10s" style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer' }}>
            <RotateCw style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      {/* Playlist Queue */}
      <div className="card-panel">
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#a1a1aa', fontWeight: 'bold' }}>
          TRACK QUEUE ({playlist.length})
        </span>
        <div className="panel-scroll" style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
          {playlist.map((track, idx) => (
            <div
              key={track.id || idx}
              onClick={() => {
                setCurrentIndex(idx);
                if (audioRef.current) {
                  audioRef.current.play().catch(() => {});
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 8px',
                borderRadius: 6,
                background: currentIndex === idx ? 'rgba(37,99,235,0.2)' : '#18181b',
                border: `1px solid ${currentIndex === idx ? '#3b82f6' : '#27272a'}`,
                cursor: 'pointer'
              }}
            >
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                <span style={{ color: currentIndex === idx ? '#93c5fd' : '#f4f4f5', fontSize: 10, fontWeight: 'bold' }}>
                  {idx + 1}. {track.title}
                </span>
              </div>
              <span style={{ fontSize: 8, color: '#71717a', fontFamily: 'monospace' }}>{track.artist}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
