import React, { createContext, useContext, useState, useRef } from 'react';

const AudioCtx = createContext();

export function AudioProvider({ children }) {
  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: 'Synthwave Highway Drive',
      artist: 'Toyota Audio System',
      url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=synthwave-80s-110045.mp3'
    },
    {
      id: 2,
      title: 'Lo-Fi Chill Cruiser',
      artist: 'OEM In-Car Stream',
      url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=lofi-study-112191.mp3'
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = playlist[currentIndex] || { title: 'No Track', artist: 'Idle', url: '' };

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack.url) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const seek = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), duration || 9999);
  };

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  return (
    <AudioCtx.Provider value={{ playlist, setPlaylist, currentIndex, setCurrentIndex, currentTrack, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, setDuration, audioRef, togglePlay, seek, nextTrack, prevTrack }}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={() => setCurrentTime(audioRef.current ? audioRef.current.currentTime : 0)}
        onLoadedMetadata={() => setDuration(audioRef.current ? audioRef.current.duration : 0)}
        onEnded={nextTrack}
      />
      {children}
    </AudioCtx.Provider>
  );
}

export const useAudio = () => useContext(AudioCtx);
