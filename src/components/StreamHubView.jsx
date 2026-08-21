import React, { useState } from 'react';
import { Tv, Play } from 'lucide-react';

export default function StreamHubView() {
  const [url, setUrl] = useState('');
  const [activeEmbed, setActiveEmbed] = useState('');

  const handleStream = () => {
    if (!url) return;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      setActiveEmbed(`https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1`);
    } else {
      setActiveEmbed(url);
    }
  };

  return (
    <div className="split-view">
      <div className="card-panel" style={{ flex: '0 0 38%' }}>
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#ef4444', fontWeight: 'bold' }}>STREAM PIPELINE</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
          <input
            type="text"
            placeholder="Paste YouTube Link or Video URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="input-dark"
          />
          <button onClick={handleStream} className="action-btn-primary" style={{ backgroundColor: '#dc2626' }}>
            <Play style={{ width: 12, height: 12 }} />
            <span>START STREAM</span>
          </button>
        </div>
        <div style={{ fontSize: 9, color: '#71717a', fontFamily: 'monospace', marginTop: 'auto' }}>
          Video & Audio Stream Gateway
        </div>
      </div>

      <div className="card-panel" style={{ flex: '0 0 60%', padding: 0, overflow: 'hidden' }}>
        {activeEmbed ? (
          <iframe title="Stream Player" src={activeEmbed} width="100%" height="100%" frameBorder="0" allow="autoplay; fullscreen" style={{ border: 'none' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#52525b', gap: 6 }}>
            <Tv style={{ width: 26, height: 26 }} />
            <span style={{ fontSize: 10, fontFamily: 'monospace' }}>Awaiting Video Link</span>
          </div>
        )}
      </div>
    </div>
  );
}
