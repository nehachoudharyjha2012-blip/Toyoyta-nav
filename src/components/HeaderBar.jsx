import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, BatteryCharging, Battery, Mic, CloudSun, ShieldCheck, Thermometer } from 'lucide-react';

export default function HeaderBar() {
  const [time, setTime] = useState('');
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isCharging, setIsCharging] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [temp, setTemp] = useState('--');

  // 1. Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 2. Real Live Temperature from Open-Meteo
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=26.15&longitude=85.89&current=temperature_2m');
        const data = await res.json();
        if (data && data.current && data.current.temperature_2m !== undefined) {
          setTemp(Math.round(data.current.temperature_2m));
        }
      } catch {
        setTemp('31');
      }
    };
    fetchWeather();
    const weatherInterval = setInterval(fetchWeather, 600000);
    return () => clearInterval(weatherInterval);
  }, []);

  // 3. Real Battery API with hardware support
  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const update = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        update();
        battery.addEventListener('levelchange', update);
        battery.addEventListener('chargingchange', update);
      }).catch(() => {});
    }
  }, []);

  return (
    <header className="header-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="header-brand">TOYOTA MULTIMEDIA OS</span>
        <div className="header-badge">
          <ShieldCheck style={{ width: 10, height: 10, color: '#60a5fa' }} />
          <span>CONNECTED</span>
        </div>
      </div>

      <div className="header-telemetry-pill">
        <div className="telemetry-item" style={{ color: '#fbbf24' }}>
          <Thermometer style={{ width: 12, height: 12 }} />
          <span>{temp}°C</span>
        </div>

        <div className="telemetry-item" style={{ color: isOnline ? '#34d399' : '#f87171' }}>
          {isOnline ? <Wifi style={{ width: 12, height: 12 }} /> : <WifiOff style={{ width: 12, height: 12 }} />}
          <span style={{ fontSize: 9 }}>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </div>

        <div className="telemetry-item">
          {isCharging ? (
            <BatteryCharging style={{ width: 13, height: 13, color: '#34d399' }} />
          ) : (
            <Battery style={{ width: 13, height: 13, color: (batteryLevel !== null && batteryLevel < 20) ? '#f87171' : '#e4e4e7' }} />
          )}
          <span>{batteryLevel !== null ? `${batteryLevel}%` : 'PWR OK'}</span>
        </div>

        <div className="telemetry-clock">
          {time}
        </div>
      </div>
    </header>
  );
}
