import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
export default function FuelCalculatorView() {
  const [price, setPrice] = useState(106); const [liters, setLiters] = useState(25); const [mileage, setMileage] = useState(16.5);
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem("oem_tasks") || '[{"id":1,"name":"Engine Oil","due":"5,000 km","done":false}]'));
  const [name, setName] = useState(""); const [due, setDue] = useState("");
  useEffect(() => { localStorage.setItem("oem_tasks", JSON.stringify(tasks)); }, [tasks]);
  const addTask = (e) => { e.preventDefault(); if(!name) return; setTasks(p => [...p, {id: Date.now(), name, due: due || "Pending", done: false}]); setName(""); setDue(""); };
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <div className="border-b border-[#2A2A2A] pb-4 mb-6"><h1 className="text-2xl font-bold uppercase">Telemetry & Maintenance</h1></div>
      <div className="grid grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="oem-panel p-6 flex flex-col">
          <span className="text-xs font-bold text-[#0056D2] uppercase mb-4">Trip Economy</span>
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400">Petrol Price (₹/L)</label><input type="number" value={price} onChange={e=>setPrice(Number(e.target.value))} className="w-full mt-1 p-3 bg-[#222] rounded-lg border border-[#333] focus:border-[#0056D2] outline-none font-bold" /></div>
            <div><label className="text-xs font-bold text-gray-400">Fuel Volume (L)</label><input type="number" value={liters} onChange={e=>setLiters(Number(e.target.value))} className="w-full mt-1 p-3 bg-[#222] rounded-lg border border-[#333] focus:border-[#0056D2] outline-none font-bold" /></div>
            <div><label className="text-xs font-bold text-gray-400">Est. Mileage (KM/L)</label><input type="number" value={mileage} onChange={e=>setMileage(Number(e.target.value))} className="w-full mt-1 p-3 bg-[#222] rounded-lg border border-[#333] focus:border-[#0056D2] outline-none font-bold" /></div>
          </div>
          <div className="mt-auto bg-[#0056D2]/20 border border-[#0056D2]/50 p-4 rounded-lg text-sm font-bold text-[#38BDF8]">
            Cost: ₹{(price/(mileage||1)).toFixed(2)}/KM • Range: {(liters*mileage).toFixed(0)} KM
          </div>
        </div>
        <div className="oem-panel p-6 flex flex-col">
          <span className="text-xs font-bold text-[#0056D2] uppercase mb-4">Service Checklist</span>
          <form onSubmit={addTask} className="flex gap-2 mb-4">
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Task..." className="flex-1 p-3 bg-[#222] rounded-lg border border-[#333] outline-none text-sm" />
            <input value={due} onChange={e=>setDue(e.target.value)} placeholder="Due..." className="w-24 p-3 bg-[#222] rounded-lg border border-[#333] outline-none text-sm" />
            <button type="submit" className="px-4 bg-[#0056D2] rounded-lg text-white font-bold"><Plus size={18}/></button>
          </form>
          <div className="flex-1 overflow-y-auto space-y-2">
            {tasks.map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 bg-[#222] rounded-lg border border-[#333]">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setTasks(p => p.map(x => x.id === t.id ? {...x, done: !x.done} : x))}>
                  {t.done ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} className="text-gray-500" />}
                  <div><div className={`text-sm font-bold ${t.done ? 'line-through text-gray-500' : ''}`}>{t.name}</div><div className="text-[10px] text-gray-400">{t.due}</div></div>
                </div>
                <button onClick={() => setTasks(p => p.filter(x => x.id !== t.id))} className="text-red-500 p-2"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
