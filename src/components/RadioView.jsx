import React, { useState, useRef, useEffect } from 'react';
import { Radio, Play, Pause, Volume2 } from 'lucide-react';
const STATIONS = [
  { id: 1, name: "Mirchi Top 20", freq: "98.3 FM", url: "https://stream.zeno.fm/f3wvbbqmdg8uv" },
  { id: 2, name: "Retro Bollywood", freq: "102.4 FM", url: "https://stream.zeno.fm/bzbpxfjxmpmuv" },
  { id: 3, name: "Punjabi Beats", freq: "104.2 FM", url: "https://stream.zeno.fm/k2v23851kwzuv" },
  { id: 4, name: "Lo-Fi Night Drive", freq: "Web", url: "https://streams.ilovemusic.de/iloveradio17.mp3" },
  { id: 5, name: "BBC News", freq: "World", url: "https://stream.live.vc.bbcmedia.co.uk/bbc_world_service" },
  { id: 6, name: "EDM Dance", freq: "Live", url: "https://streams.ilovemusic.de/iloveradio2.mp3" }
];
export default function RadioView() {
  const [station, setStation] = useState(STATIONS[0]); const [play, setPlay] = useState(false); const [vol, setVol] = useState(0.8);
  const aud = useRef(new Audio());
  useEffect(() => { aud.current.volume = vol; return () => aud.current.pause(); }, [vol]);
  const toggle = (s) => {
    if(station.id === s.id && play) { aud.current.pause(); setPlay(false); return; }
    setStation(s); aud.current.src = s.url; aud.current.play().then(()=>setPlay(true)).catch(()=>setPlay(false));
  };
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="border-b border-[#2A2A2A] pb-4 mb-6"><h1 className="text-2xl font-bold uppercase">Terrestrial Radio Matrix</h1></div>
      <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="col-span-5 oem-panel p-8 flex flex-col items-center justify-between">
          <div className="w-full flex justify-between"><span className="text-[#0056D2] font-bold">{station.freq}</span>{play && <span className="text-emerald-500 text-xs font-bold animate-pulse">LIVE</span>}</div>
          <div className="text-center"><div className="w-24 h-24 mx-auto rounded-full bg-[#222] flex items-center justify-center mb-4"><Radio size={40} className="text-red-500"/></div><h2 className="text-2xl font-bold">{station.name}</h2></div>
          <div className="w-full space-y-4">
            <button onClick={() => toggle(station)} className="w-full py-4 bg-[#0056D2] rounded-lg font-bold flex justify-center gap-2 spring-tap">{play ? <Pause/> : <Play/>} {play ? "Mute" : "Tune"}</button>
            <div className="flex gap-3 bg-[#222] p-4 rounded-lg"><Volume2 size={20}/><input type="range" min={0} max={1} step={0.05} value={vol} onChange={e=>setVol(e.target.value)} className="w-full accent-[#0056D2] h-2 bg-[#111] rounded-lg appearance-none mt-1" /></div>
          </div>
        </div>
        <div className="col-span-7 oem-panel p-6 flex flex-col">
          <span className="text-xs font-bold text-[#0056D2] uppercase mb-4">Frequency List</span>
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {STATIONS.map(s => (
              <div key={s.id} onClick={()=>toggle(s)} className={`p-4 rounded-lg cursor-pointer flex justify-between border spring-tap ${station.id === s.id && play ? 'bg-[#0056D2] border-[#0056D2]' : 'bg-[#222] border-[#333] hover:border-[#555]'}`}>
                <div className="font-bold">{s.name}</div><div className="text-sm opacity-80">{s.freq}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
