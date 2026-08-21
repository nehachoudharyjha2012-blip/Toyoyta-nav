import React, { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, FolderPlus, ListMusic, Music, Sparkles, RotateCcw, RotateCw } from 'lucide-react';

export default function AudioView({
  playlist,
  setPlaylist,
  currentIndex,
  setCurrentIndex,
  isPlaying,
  audioCurrentTime,
  setAudioCurrentTime,
  duration,
  volume,
  setVolume,
  onSeekTrack,
  togglePlay,
  handleNext,
  handlePrev
}) {
  const fileInputRef = useRef(null);

  const formatTime = (secs) => {
    if (isNaN(secs) || secs <= 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleFilesAdded = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const newTracks = files.map((file) => ({
      title: file.name.replace(/\.[^/.]+$/, ""),
      artist: "Local Audio USB",
      src: URL.createObjectURL(file)
    }));
    setPlaylist((prev) => [...prev, ...newTracks]);
    setCurrentIndex(playlist.length);
  };

  const jumpTime = (delta) => {
    const maxDur = duration || 100;
    const nextTime = Math.min(Math.max(0, audioCurrentTime + delta), maxDur);
    setAudioCurrentTime(nextTime);
    onSeekTrack(nextTime);
  };

  const currentTrack = playlist[currentIndex] || { title: "No Media Selected", artist: "Add Music Files" };

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-wider text-[#0056D2] uppercase font-mono">AUDIO SOUNDSTAGE</span>
          <span className="opacity-30">•</span>
          <span className="text-xs font-medium font-mono opacity-80">JBL Premium Multimedia Audio</span>
        </div>

        <input type="file" ref={fileInputRef} onChange={handleFilesAdded} multiple accept="audio/*" className="hidden" />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-10 px-4 rounded-xl oem-panel spring-tap text-xs font-bold cursor-pointer flex items-center gap-2"
        >
          <FolderPlus size={16} className="text-[#0056D2]" /> Load Local Tracks
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 items-center flex-1 my-4 min-h-0">
        {/* Left: Player & Live Animated Visualizer */}
        <div className="col-span-7 oem-panel p-6 rounded-2xl flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black truncate">{currentTrack.title}</h1>
                <h2 className="text-xs opacity-70 font-medium truncate mt-0.5">{currentTrack.artist}</h2>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-[#0056D2]/10 text-[#0056D2] border border-[#0056D2]/20">
                {currentTrack.isYT ? "YouTube Audio Stream" : "Lossless Local"}
              </span>
            </div>

            {/* Live Animated Sound Waveform Card */}
            <div className="h-44 rounded-2xl bg-black/5 dark:bg-black/40 border border-black/10 dark:border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden mb-4">
              <div className="flex items-end justify-center gap-2 h-20 w-full">
                <div className={`w-3 rounded-full bg-[#0056D2] ${isPlaying ? "vis-bar-1" : "h-2 opacity-40"}`} />
                <div className={`w-3 rounded-full bg-[#0056D2] ${isPlaying ? "vis-bar-2" : "h-3 opacity-40"}`} />
                <div className={`w-3 rounded-full bg-[#38BDF8] ${isPlaying ? "vis-bar-3" : "h-2 opacity-40"}`} />
                <div className={`w-3 rounded-full bg-[#0056D2] ${isPlaying ? "vis-bar-4" : "h-4 opacity-40"}`} />
                <div className={`w-3 rounded-full bg-[#38BDF8] ${isPlaying ? "vis-bar-5" : "h-2 opacity-40"}`} />
                <div className={`w-3 rounded-full bg-[#0056D2] ${isPlaying ? "vis-bar-2" : "h-3 opacity-40"}`} />
                <div className={`w-3 rounded-full bg-[#0056D2] ${isPlaying ? "vis-bar-1" : "h-2 opacity-40"}`} />
              </div>
              <span className="text-[11px] font-mono font-bold opacity-60 mt-3 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#0056D2]" /> {isPlaying ? "Soundstage Active • 48 kHz Processing" : "Playback Paused"}
              </span>
            </div>

            {/* Scrubber & Jump Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <button onClick={() => jumpTime(-10)} className="px-3 py-1.5 rounded-xl oem-panel text-xs font-mono font-bold spring-tap flex items-center gap-1.5 cursor-pointer">
                  <RotateCcw size={12} /> -10s
                </button>
                <button onClick={() => jumpTime(10)} className="px-3 py-1.5 rounded-xl oem-panel text-xs font-mono font-bold spring-tap flex items-center gap-1.5 cursor-pointer">
                  +10s <RotateCw size={12} />
                </button>
              </div>

              <input
                type="range"
                min={0}
                max={duration || 100}
                value={audioCurrentTime}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAudioCurrentTime(val);
                  onSeekTrack(val);
                }}
                className="w-full h-2 bg-black/15 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#0056D2]"
              />
              <div className="flex justify-between text-xs font-mono opacity-70">
                <span>{formatTime(audioCurrentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Transport Controls */}
          <div className="flex items-center gap-4 mt-2">
            <button onClick={handlePrev} className="w-12 h-12 rounded-xl oem-panel flex items-center justify-center spring-tap cursor-pointer">
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="w-16 h-14 bg-[#0056D2] text-white rounded-2xl flex items-center justify-center spring-tap shadow-lg cursor-pointer"
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
            </button>
            <button onClick={handleNext} className="w-12 h-12 rounded-xl oem-panel flex items-center justify-center spring-tap cursor-pointer">
              <SkipForward size={20} />
            </button>

            <div className="ml-auto flex items-center gap-2.5 oem-panel px-3.5 py-2.5 rounded-xl">
              <Volume2 size={18} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-24 h-1.5 bg-black/20 dark:bg-white/30 rounded-lg appearance-none cursor-pointer accent-[#0056D2]"
              />
            </div>
          </div>
        </div>

        {/* Right: Playlist Queue */}
        <div className="col-span-5 oem-panel p-6 rounded-2xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-black/10 dark:border-white/10 font-mono">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <ListMusic size={16} /> Track Queue ({playlist.length})
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {playlist.map((track, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`flex items-center justify-between p-3.5 rounded-xl cursor-pointer spring-tap ${
                  i === currentIndex
                    ? "bg-[#0056D2] text-white font-bold shadow-md"
                    : "hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-xs font-mono opacity-60 w-4">{i + 1}</span>
                  <span className="text-xs truncate font-medium">{track.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
