import React, { useState, useEffect, useRef } from "react";
import "./glass.css";
import HeaderBar from "./components/HeaderBar";
import SidebarDock from "./components/SidebarDock";
import AudioView from "./components/AudioView";
import RadioView from "./components/RadioView";
import PhoneDialerView from "./components/PhoneDialerView";
import FuelCalculatorView from "./components/FuelCalculatorView";
import StreamHubView from "./components/StreamHubView";
import SettingsView from "./components/SettingsView";
import { Compass, Plus, Minus, LocateFixed, Search, Play, Pause, Music, X, Loader2, MapPin, Navigation } from "lucide-react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";

const DEFAULT_ORIGIN = [26.1542, 85.8918];
const DEMO_ROUTE = [DEFAULT_ORIGIN, [26.1600, 85.9000], [26.1710, 85.9125]];

const originIcon = L.divIcon({
  className: "custom-icon",
  html: '<div style="width:24px;height:24px;background:#0056D2;border:3px solid white;border-radius:50%;box-shadow:0 0 15px rgba(0,0,0,0.8);"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const destIcon = L.divIcon({
  className: "dest-icon",
  html: '<div style="width:26px;height:26px;background:#FF3B30;border:3px solid white;border-radius:50%;box-shadow:0 0 15px rgba(255,59,48,0.8);display:flex;align-items:center;justify-content:center;"><div style="width:6px;height:6px;background:white;border-radius:50%;"></div></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

// Auto-resizes Leaflet so it never half-loads
function MapAutoResizer({ activeTab }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [activeTab, map]);
  return null;
}

function MapOverlayControls({ 
  activeTrack, 
  isPlaying, 
  togglePlay, 
  searchQuery, 
  setSearchQuery, 
  isSearchOpen, 
  setIsSearchOpen, 
  onSelectDestination 
}) {
  const map = useMap();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Fast Auto-Complete Engine with fallback
  const performSearch = async (queryText) => {
    const q = (queryText || "").trim();
    if (!q) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);

    try {
      // 1. Primary High-Speed Photon Search (Instant Autocomplete with location bias)
      const lat = DEFAULT_ORIGIN[0];
      const lon = DEFAULT_ORIGIN[1];
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&lat=${lat}&lon=${lon}&limit=12`;
      
      const res = await fetch(photonUrl);
      const data = await res.json();

      if (data && data.features && data.features.length > 0) {
        const parsed = data.features.map((f) => {
          const p = f.properties;
          const coords = [f.geometry.coordinates[1], f.geometry.coordinates[0]];
          const title = p.name || p.street || p.city || "Point of Interest";
          const subtitle = [p.street, p.district, p.city, p.state, p.country].filter(Boolean).join(", ");
          return { title, subtitle: subtitle || "Location", coords };
        });
        setSearchResults(parsed);
        setIsSearching(false);
        return;
      }
      
      // 2. Fallback Query
      const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=10`);
      const fallbackData = await fallbackRes.json();
      if (fallbackData && Array.isArray(fallbackData)) {
        setSearchResults(fallbackData.map(item => ({
          title: item.display_name.split(",")[0],
          subtitle: item.display_name,
          coords: [parseFloat(item.lat), parseFloat(item.lon)]
        })));
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced real-time typing
  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(val);
    }, 280);
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-[400]">
      {/* Right Vertical Tools */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 pointer-events-auto">
        <div className="oem-pill flex flex-col items-center w-14 shadow-2xl overflow-hidden">
          <button className="w-full h-14 flex justify-center items-center border-b border-black/10 dark:border-white/10 spring-tap cursor-pointer hover:bg-white/10" onClick={() => map.setZoom(map.getZoom())}>
            <Compass size={24} className="text-red-500" />
          </button>
          <button className="w-full h-14 flex justify-center items-center border-b border-black/10 dark:border-white/10 spring-tap cursor-pointer hover:bg-white/10" onClick={() => map.zoomIn()}>
            <Plus size={26} />
          </button>
          <button className="w-full h-14 flex justify-center items-center spring-tap cursor-pointer hover:bg-white/10" onClick={() => map.zoomOut()}>
            <Minus size={26} />
          </button>
        </div>
        <button className="oem-pill px-4 py-3 flex items-center gap-2 text-xs font-bold shadow-2xl spring-tap cursor-pointer hover:bg-white/10" onClick={() => map.flyTo(DEFAULT_ORIGIN, 16)}>
          <LocateFixed size={16} /> Recenter
        </button>
      </div>

      {/* Bottom Right Wide Media Banner */}
      <div className="absolute bottom-8 right-6 oem-pill w-[380px] h-20 px-5 flex items-center justify-between shadow-2xl pointer-events-auto cursor-pointer border-b-2 border-b-[#0056D2]">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="w-12 h-12 rounded-full bg-black/10 dark:bg-black/60 border border-black/15 dark:border-white/20 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Music size={22} className="text-[#0056D2]" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-0.5 flex items-center gap-2">
              {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />} SiriusXM | JBL
            </span>
            <span className="text-sm font-bold truncate w-48">{activeTrack?.title || "No Media Playing"}</span>
          </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="w-12 h-12 rounded-full bg-[#0056D2] text-white flex justify-center items-center spring-tap flex-shrink-0 cursor-pointer shadow-md">
          {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
        </button>
      </div>

      {/* Bottom Left Big White Action Button */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); setIsSearchOpen(!isSearchOpen); }}
          className="w-16 h-16 rounded-full bg-white text-black shadow-2xl flex items-center justify-center spring-tap hover:scale-105 cursor-pointer"
        >
          {isSearchOpen ? <X size={28} strokeWidth={2.5} /> : <Search size={28} strokeWidth={2.5} />}
        </button>
      </div>

      {/* Search Input Modal */}
      {isSearchOpen && (
        <div onClick={(e) => e.stopPropagation()} className="absolute bottom-28 left-8 w-[420px] oem-pill p-4 shadow-2xl pointer-events-auto flex flex-col gap-2 bg-[#1A1A1A] border border-[#333]">
          <form onSubmit={(e) => { e.preventDefault(); performSearch(searchQuery); }} className="flex items-center gap-2">
            <Search size={20} className="opacity-50 ml-1 flex-shrink-0 text-white" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search address, landmark, or street..."
              className="w-full bg-transparent text-sm text-white focus:outline-none font-bold placeholder-gray-500"
            />
            {isSearching ? <Loader2 size={18} className="animate-spin text-[#0056D2]" /> : (
              <button type="submit" className="px-3.5 py-1.5 bg-[#0056D2] text-white text-xs font-bold rounded-lg spring-tap cursor-pointer">Go</button>
            )}
            {searchQuery && (
              <button type="button" onClick={() => { setSearchQuery(""); setSearchResults([]); }} className="p-1 text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            )}
          </form>

          {searchResults.length > 0 && (
            <div className="max-h-60 overflow-y-auto space-y-1 mt-2 border-t border-[#333] pt-2 pr-1">
              {searchResults.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    onSelectDestination(item.coords);
                    map.flyTo(item.coords, 16, { duration: 1.2 });
                    setIsSearchOpen(false);
                  }}
                  className="p-2.5 rounded-lg hover:bg-white/10 cursor-pointer text-xs flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-start gap-2.5 truncate">
                    <MapPin size={16} className="text-[#0056D2] mt-0.5 flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-bold text-white group-hover:text-blue-400 truncate">{item.title}</div>
                      <div className="text-gray-400 text-[10px] truncate mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>
                  <Navigation size={14} className="text-gray-500 group-hover:text-white flex-shrink-0 ml-2" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("map");
  const [time, setTime] = useState("");
  const [currentTheme, setCurrentTheme] = useState("dark");
  const [brightness, setBrightness] = useState(100);
  const [speedUnit, setSpeedUnit] = useState("KM/H");
  const [badge, setBadge] = useState("Toyota Multimedia OS");
  const [batteryLevel, setBatteryLevel] = useState(100);

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(DEMO_ROUTE);
  const [destinationPos, setDestinationPos] = useState([26.1710, 85.9125]);

  const [playlist, setPlaylist] = useState([
    { title: "The Long Faces - Jane!", artist: "YouTube Audio", isYT: true, ytId: "fyvJ2wCTpas" },
    { title: "Базовый минимум", artist: "SABI, MIA BOYKA", src: "/songs/SABI, MIA BOYKA - Базовый минимум (SPOTISAVER).mp3" }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [duration, setDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);

  const audioRef = useRef(null);
  const ytRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();
    const a = audioRef.current;
    a.addEventListener("timeupdate", () => setAudioCurrentTime(a.currentTime));
    a.addEventListener("loadedmetadata", () => setDuration(a.duration));
    a.addEventListener("ended", () => setCurrentIndex((prev) => (prev + 1) % playlist.length));
    return () => a.pause();
  }, [playlist.length]);

  // YouTube / Audio Track Switcher
  useEffect(() => {
    const track = playlist[currentIndex];
    if (!track) return;
    if (track.isYT) {
      if (audioRef.current) audioRef.current.pause();
      setDuration(240);
      if (isPlaying) {
        ytRef.current?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
    } else if (track.src && audioRef.current) {
      ytRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      audioRef.current.src = track.src;
      audioRef.current.volume = volume;
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, playlist]);

  const handleSeekTrack = (targetSecs) => {
    const track = playlist[currentIndex];
    if (!track) return;
    if (track.isYT) {
      ytRef.current?.contentWindow?.postMessage(`{"event":"command","func":"seekTo","args":[${targetSecs}, true]}`, '*');
    } else if (audioRef.current) {
      audioRef.current.currentTime = targetSecs;
    }
  };

  const togglePlay = () => {
    const track = playlist[currentIndex];
    if (!track) return;
    if (track.isYT) {
      const cmd = isPlaying ? "pauseVideo" : "playVideo";
      ytRef.current?.contentWindow?.postMessage(`{"event":"command","func":"${cmd}","args":""}`, '*');
      setIsPlaying(!isPlaying);
    } else {
      if (isPlaying) audioRef.current?.pause();
      else audioRef.current?.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelectDestination = (coords) => {
    setDestinationPos(coords);
    setActiveRoute([
      DEFAULT_ORIGIN,
      [DEFAULT_ORIGIN[0] + (coords[0] - DEFAULT_ORIGIN[0]) * 0.4, DEFAULT_ORIGIN[1] + (coords[1] - DEFAULT_ORIGIN[1]) * 0.3],
      [DEFAULT_ORIGIN[0] + (coords[0] - DEFAULT_ORIGIN[0]) * 0.7, DEFAULT_ORIGIN[1] + (coords[1] - DEFAULT_ORIGIN[1]) * 0.8],
      coords
    ]);
  };

  const currentTrack = playlist[currentIndex] || { title: "No Media" };
  const themeClass = currentTheme === "light" ? "theme-light" : "theme-dark";

  return (
    <div style={{ filter: `brightness(${brightness}%)` }} className={`${themeClass} flex h-screen w-screen bg-[var(--oem-bg)] font-sans overflow-hidden select-none`}>
      <SidebarDock activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 relative overflow-hidden bg-[var(--oem-bg)]">
        <HeaderBar
          currentTime={time}
          batteryLevel={batteryLevel}
          isOnline={true}
          currentTheme={currentTheme}
          toggleTheme={() => setCurrentTheme((prev) => prev === "dark" ? "light" : "dark")}
          carBadgeName={badge}
        />

        {/* YouTube Background Player */}
        <div className="hidden">
          <iframe ref={ytRef} title="YT" src={`https://www.youtube.com/embed/${playlist[currentIndex]?.ytId || 'fyvJ2wCTpas'}?enablejsapi=1`} allow="autoplay" />
        </div>

        {/* Map View */}
        <div style={{ visibility: activeTab === 'map' ? 'visible' : 'hidden', pointerEvents: activeTab === 'map' ? 'auto' : 'none' }} className="absolute inset-0 z-10">
          <MapContainer center={DEFAULT_ORIGIN} zoom={15} minZoom={5} maxZoom={18} zoomControl={false} className="w-full h-full">
            <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
            <Polyline positions={activeRoute} pathOptions={{ color: "#0056D2", weight: 8, opacity: 1 }} />
            <Marker position={DEFAULT_ORIGIN} icon={originIcon} />
            {destinationPos && <Marker position={destinationPos} icon={destIcon} />}
            <MapAutoResizer activeTab={activeTab} />
            <MapOverlayControls
              activeTrack={currentTrack}
              isPlaying={isPlaying}
              togglePlay={togglePlay}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              onSelectDestination={handleSelectDestination}
            />
          </MapContainer>
        </div>

        {/* Other Tabs */}
        <div style={{ display: activeTab === 'audio' ? 'block' : 'none' }} className="w-full h-full absolute inset-0 z-20 bg-[var(--oem-bg)] pt-14">
          <AudioView
            playlist={playlist}
            setPlaylist={setPlaylist}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            isPlaying={isPlaying}
            audioCurrentTime={audioCurrentTime}
            setAudioCurrentTime={setAudioCurrentTime}
            duration={duration}
            volume={volume}
            setVolume={setVolume}
            onSeekTrack={handleSeekTrack}
            togglePlay={togglePlay}
            handleNext={() => setCurrentIndex((currentIndex + 1) % playlist.length)}
            handlePrev={() => setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length)}
          />
        </div>

        <div style={{ display: activeTab === 'radio' ? 'block' : 'none' }} className="w-full h-full absolute inset-0 z-20 bg-[var(--oem-bg)] pt-14">
          <RadioView />
        </div>

        <div style={{ display: activeTab === 'phone' ? 'block' : 'none' }} className="w-full h-full absolute inset-0 z-20 bg-[var(--oem-bg)] pt-14">
          <PhoneDialerView />
        </div>

        <div style={{ display: activeTab === 'fuel' ? 'block' : 'none' }} className="w-full h-full absolute inset-0 z-20 bg-[var(--oem-bg)] pt-14">
          <FuelCalculatorView />
        </div>

        <div style={{ display: activeTab === 'stream' ? 'block' : 'none' }} className="w-full h-full absolute inset-0 z-20 bg-[var(--oem-bg)] pt-14">
          <StreamHubView onPlayTrack={(t) => { setPlaylist((p) => [t, ...p]); setCurrentIndex(0); setIsPlaying(true); setActiveTab('audio'); }} />
        </div>

        <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }} className="w-full h-full absolute inset-0 z-20 bg-[var(--oem-bg)] pt-14">
          <SettingsView brightness={brightness} setBrightness={setBrightness} speedUnit={speedUnit} setSpeedUnit={setSpeedUnit} carBadgeName={badge} setCarBadgeName={setBadge} />
        </div>
      </div>
    </div>
  );
}
