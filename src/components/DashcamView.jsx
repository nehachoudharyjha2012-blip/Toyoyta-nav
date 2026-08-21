import React, { useRef, useState, useEffect } from "react";
import { Camera, RefreshCw, Trash2, AlertCircle } from "lucide-react";
export default function DashcamView() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [snapshots, setSnapshots] = useState(() => JSON.parse(localStorage.getItem("oem_dashcam") || "[]"));
  useEffect(() => { localStorage.setItem("oem_dashcam", JSON.stringify(snapshots)); }, [snapshots]);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setActive(true); }
    } catch (err) { setErrorMsg("Camera access denied."); }
  };
  const stopCamera = () => { if (videoRef.current?.srcObject) { videoRef.current.srcObject.getTracks().forEach(t => t.stop()); setActive(false); } };
  useEffect(() => { startCamera(); return stopCamera; }, []);
  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth; canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    setSnapshots(p => [canvas.toDataURL("image/jpeg", 0.7), ...p.slice(0, 7)]);
  };
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold uppercase">Vision Matrix</h1>
        <button onClick={capture} disabled={!active} className="px-5 py-2.5 bg-[#0056D2] text-white font-bold rounded-lg spring-tap flex gap-2"><Camera size={18}/> Capture Frame</button>
      </div>
      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-9 oem-panel relative overflow-hidden bg-black flex items-center justify-center border-2 border-[#333]">
          {errorMsg ? <div className="text-center"><AlertCircle size={40} className="mx-auto text-red-500 mb-2"/>{errorMsg}</div> : <><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /><div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none"><div className="text-emerald-400 text-xs font-bold bg-black/50 px-3 py-1 self-start rounded">LIVE FEED</div><div className="w-2/3 mx-auto h-48 border-x-4 border-dashed border-emerald-500/80 flex flex-col justify-between"><div className="h-1 bg-red-500"/><div className="h-1 w-4/5 mx-auto bg-amber-500"/><div className="h-1 bg-emerald-500"/></div></div></>}
        </div>
        <div className="col-span-3 oem-panel p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4"><span className="text-xs font-bold text-[#0056D2] uppercase">Logs</span><button onClick={() => setSnapshots([])}><Trash2 size={16} className="text-red-500"/></button></div>
          <div className="flex-1 overflow-y-auto space-y-3">{snapshots.map((s, i) => <img key={i} src={s} className="w-full rounded-lg border border-[#333]" />)}</div>
        </div>
      </div>
    </div>
  );
}
