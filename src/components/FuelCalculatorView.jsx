import React, { useState } from 'react';
import { Fuel, Gauge, DollarSign, Calculator } from 'lucide-react';

export default function FuelCalculatorView() {
  const [fuelPrice, setFuelPrice] = useState(106);
  const [distance, setDistance] = useState(50);
  const [efficiency, setEfficiency] = useState(18.5);

  const totalFuelNeeded = (distance / (efficiency || 1)).toFixed(2);
  const totalCost = (totalFuelNeeded * fuelPrice).toFixed(0);

  return (
    <div className="split-view">
      <div className="card-panel">
        <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#60a5fa', fontWeight: 'bold' }}>TRIP METRICS</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div>
            <label style={{ fontSize: 9, color: '#a1a1aa', fontFamily: 'monospace' }}>Fuel Price (₹/L)</label>
            <input type="number" value={fuelPrice} onChange={(e) => setFuelPrice(+e.target.value)} className="input-dark" />
          </div>
          <div>
            <label style={{ fontSize: 9, color: '#a1a1aa', fontFamily: 'monospace' }}>Trip Distance (km)</label>
            <input type="number" value={distance} onChange={(e) => setDistance(+e.target.value)} className="input-dark" />
          </div>
          <div>
            <label style={{ fontSize: 9, color: '#a1a1aa', fontFamily: 'monospace' }}>Mileage (km/L)</label>
            <input type="number" value={efficiency} onChange={(e) => setEfficiency(+e.target.value)} className="input-dark" />
          </div>
        </div>
      </div>

      <div className="card-panel" style={{ textAlign: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(37,99,235,0.2)', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
          <Fuel style={{ width: 20, height: 20, color: '#60a5fa' }} />
        </div>
        <div>
          <div style={{ fontSize: 10, color: '#a1a1aa', fontFamily: 'monospace' }}>ESTIMATED TRIP COST</div>
          <div style={{ fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', color: '#34d399' }}>₹{totalCost}</div>
        </div>
        <div style={{ fontSize: 10, color: '#93c5fd', fontFamily: 'monospace' }}>
          Fuel Required: <strong>{totalFuelNeeded} L</strong>
        </div>
      </div>
    </div>
  );
}
