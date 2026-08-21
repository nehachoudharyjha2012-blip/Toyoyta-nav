import React, { useState } from "react";
import { Tv, Music, Link2, Play, Download, Loader2 } from "lucide-react";
export default function StreamHubView({ onPlayTrack }) {
  const [yt, setYt] = useState(""); const [sp, setSp] = useState("");
  const [loading, setLoading] = useState(false);
  const handleYT = async (mode) => {
    if(!yt) return; setLoading(true);
    const m = yt.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    const id = m ? m[1] : yt;
    if(mode === 'stream' && onPlayTrack) onPlayTrack({title: "YouTube Stream", artist: "Direct Audio", isYT: true, ytId: id});
    if(mode === 'dl') window.open(`https://invidious.nerdvpn.de/latest_version?id=${id}&itag=140`);
    setLoading(false); setYt("");
  };
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="border-b border-[#2A2A2A] pb-4 mb-6"><h1 className="text-2xl font-bold uppercase">Audio Stream Engine</h1></div>
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="oem-panel p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-red-500"><Tv size={24}/><h2 className="text-lg font-bold text-white">YouTube Pipeline</h2></div>
          <div className="relative"><Link2 size={18} className="absolute left-3 top-3.5 text-gray-500"/><input value={yt} onChange={e=>setYt(e.target.value)} placeholder="Paste Link..." className="w-full pl-10 pr-4 py-3 bg-[#222] rounded-lg border border-[#333] outline-none" /></div>
          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button onClick={() => handleYT('stream')} className="py-4 bg-red-600 rounded-lg font-bold flex justify-center gap-2 spring-tap"><Play size={18}/> Stream</button>
            <button onClick={() => handleYT('dl')} className="py-4 bg-[#333] rounded-lg font-bold flex justify-center gap-2 spring-tap"><Download size={18}/> Download</button>
          </div>
        </div>
        <div className="oem-panel p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 text-emerald-500"><Music size={24}/><h2 className="text-lg font-bold text-white">Spotify Resolver</h2></div>
          <div className="relative"><Link2 size={18} className="absolute left-3 top-3.5 text-gray-500"/><input value={sp} onChange={e=>setSp(e.target.value)} placeholder="Paste Spotify Track..." className="w-full pl-10 pr-4 py-3 bg-[#222] rounded-lg border border-[#333] outline-none" /></div>
          <div className="mt-auto text-xs text-gray-400 bg-[#222] p-4 rounded-lg border border-[#333]">Note: Enter Track Name manually if Spotify link blocks metadata. Resolves to lossless audio.</div>
        </div>
      </div>
    </div>
  );
}
