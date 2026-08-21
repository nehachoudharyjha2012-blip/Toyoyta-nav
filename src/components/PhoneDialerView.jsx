import React, { useState } from 'react';
import { Phone, Delete, ShieldAlert, PhoneCall } from 'lucide-react';

export default function PhoneDialerView() {
  const [dialNumber, setDialNumber] = useState('');

  const appendDigit = (digit) => {
    if (dialNumber.length < 15) setDialNumber((prev) => prev + digit);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = (num) => {
    const target = num || dialNumber;
    if (!target) return;
    window.location.href = `tel:${target}`;
  };

  return (
    <div className="flex h-full w-full gap-5 text-white overflow-hidden">
      <div className="w-1/3 flex flex-col justify-between">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-xs uppercase tracking-wider text-blue-400 font-mono font-bold">Speed Dial</h2>
          
          <div 
            onClick={() => handleCall('112')}
            className="flex items-center gap-3 p-3 rounded-xl bg-red-950/40 border border-red-500/40 hover:bg-red-900/50 active:scale-95 transition cursor-pointer"
          >
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-red-200">Emergency</div>
              <div className="text-xs text-red-400 font-mono">112 Dispatch</div>
            </div>
          </div>

          <div 
            onClick={() => handleCall('1033')}
            className="flex items-center gap-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 hover:bg-amber-900/50 active:scale-95 transition cursor-pointer"
          >
            <Phone className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="text-sm font-bold text-amber-200">Highway Help</div>
              <div className="text-xs text-amber-400 font-mono">1033 (NHAI)</div>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-400 flex items-center justify-between font-mono">
          <span>Carrier:</span>
          <span className="text-emerald-400 font-bold">GSM ACTIVE</span>
        </div>
      </div>

      <div className="w-2/3 flex flex-col bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 justify-between">
        <div className="w-full h-11 flex items-center justify-between px-4 bg-zinc-900/90 rounded-xl border border-zinc-800">
          <span className="text-lg font-mono tracking-widest font-bold text-zinc-100 truncate">
            {dialNumber || <span className="text-zinc-600 font-sans text-xs">Enter phone number...</span>}
          </span>
          {dialNumber && (
            <button onClick={handleBackspace} className="p-1 text-zinc-400 hover:text-white active:scale-90">
              <Delete className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 my-2 w-full max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
            <button
              key={key}
              onClick={() => appendDigit(key)}
              className="h-10 bg-zinc-900 hover:bg-zinc-800 active:bg-blue-600 rounded-lg text-base font-bold font-mono transition active:scale-95 flex items-center justify-center border border-zinc-800 text-zinc-100"
            >
              {key}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleCall()}
          disabled={!dialNumber}
          className={`w-full max-w-xs mx-auto h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition ${
            dialNumber 
              ? 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white cursor-pointer' 
              : 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          Call
        </button>
      </div>
    </div>
  );
}
