import React, { useState } from "react";
import { PhoneCall, Delete, ShieldAlert, Star, Phone, CheckCircle2 } from "lucide-react";

export default function PhoneDialerView() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callDispatched, setCallDispatched] = useState(false);

  const dialKeys = [
    { num: "1", sub: "" },
    { num: "2", sub: "ABC" },
    { num: "3", sub: "DEF" },
    { num: "4", sub: "GHI" },
    { num: "5", sub: "JKL" },
    { num: "6", sub: "MNO" },
    { num: "7", sub: "PQRS" },
    { num: "8", sub: "TUV" },
    { num: "9", sub: "WXYZ" },
    { num: "*", sub: "" },
    { num: "0", sub: "+" },
    { num: "#", sub: "" }
  ];

  // Optional quick Web Audio DTMF key feedback
  const playDTMFTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {}
  };

  const handleKeyPress = (char) => {
    playDTMFTone();
    if (phoneNumber.length < 15) setPhoneNumber((prev) => prev + char);
  };

  const handleBackspace = () => setPhoneNumber((prev) => prev.slice(0, -1));

  const triggerMobileCall = (numToCall) => {
    const target = numToCall || phoneNumber;
    if (!target) return;

    setCallDispatched(true);
    setTimeout(() => setCallDispatched(false), 3000);

    // Safe Android WebView Intent Dispatcher
    const cleanNum = target.replace(/[^0-9+*#]/g, "");
    try {
      window.open(`tel:${cleanNum}`, "_system");
    } catch (e) {
      window.location.href = `tel:${cleanNum}`;
    }
  };

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-wider text-[#0056D2] uppercase font-mono">TELEPHONY GATEWAY</span>
          <span className="opacity-30">•</span>
          <span className="text-xs font-medium font-mono opacity-80">Hands-Free Mobile Caller Intent</span>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl oem-panel text-xs font-mono font-bold text-emerald-500">
          <Phone size={14} /> Android Calling Ready
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 items-center flex-1 py-6 min-h-0">
        {/* Left Side: Emergency & Speed Dials */}
        <div className="col-span-4 oem-panel rounded-2xl p-6 flex flex-col justify-between h-full">
          <div>
            <div className="text-xs font-mono font-bold uppercase opacity-60 mb-3 flex items-center gap-1.5">
              <Star size={14} className="text-amber-400" /> Emergency & Speed Dial
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => triggerMobileCall("112")}
                className="w-full p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left spring-tap flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold text-red-500">National Emergency (112)</div>
                  <div className="text-[10px] opacity-70 font-mono">Police, Ambulance & Fire</div>
                </div>
                <ShieldAlert size={18} className="text-red-500" />
              </button>

              <button
                onClick={() => triggerMobileCall("1033")}
                className="w-full p-4 rounded-xl oem-panel text-left spring-tap flex items-center justify-between cursor-pointer"
              >
                <div>
                  <div className="text-xs font-bold">NHAI Road Helpline (1033)</div>
                  <div className="text-[10px] opacity-70 font-mono">24/7 Highway Assistance</div>
                </div>
                <Phone size={16} className="text-[#0056D2]" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono opacity-70">
            Tapping call routes target number directly to the Android telephony stack.
          </div>
        </div>

        {/* Right Side: Keypad */}
        <div className="col-span-8 oem-panel rounded-2xl p-8 flex flex-col items-center justify-between h-full">
          <div className="w-full max-w-xs flex items-center justify-between px-4 py-2 border-b border-black/15 dark:border-white/20 mb-3">
            <span className="text-3xl font-black font-mono tracking-widest text-center flex-1">{phoneNumber || "—"}</span>
            {phoneNumber && (
              <button onClick={handleBackspace} className="p-2 opacity-60 hover:opacity-100 spring-tap cursor-pointer">
                <Delete size={20} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {dialKeys.map((k, i) => (
              <button
                key={i}
                onClick={() => handleKeyPress(k.num)}
                className="h-14 oem-panel rounded-xl flex flex-col items-center justify-center spring-tap cursor-pointer hover:bg-white/10"
              >
                <span className="text-xl font-bold font-mono leading-none">{k.num}</span>
                {k.sub && <span className="text-[9px] opacity-50 font-mono mt-0.5">{k.sub}</span>}
              </button>
            ))}
          </div>

          <div className="w-full max-w-xs mt-3 flex flex-col items-center gap-2">
            <button
              onClick={() => triggerMobileCall()}
              disabled={!phoneNumber}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white rounded-xl font-bold text-sm spring-tap flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <PhoneCall size={20} /> Call Number
            </button>

            {callDispatched && (
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} /> Dialing intent routed...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
