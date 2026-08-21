import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Search, LocateFixed, MapPin, Compass, ArrowUpRight, Loader2, Crosshair, Wifi, WifiOff } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export default function MapView() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const watchIdRef = useRef(null);

  const [coords, setCoords] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeRouteInfo, setActiveRouteInfo] = useState(null);
  const [turnInstruction, setTurnInstruction] = useState('Search destination or track live');
  const [gpsStatus, setGpsStatus] = useState('STANDBY');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. Initialize Map with Dynamic Hybrid Tile Provider
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [26.1542, 85.8918],
      zoom: 16,
      maxZoom: 19,
      minZoom: 10,
      zoomControl: false,
      attributionControl: false
    });

    // Determine initial tile URL source
    const tileUrl = navigator.onLine 
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : '/tiles/{z}/{x}/{y}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      maxNativeZoom: 19,
      minZoom: 10,
      subdomains: ['a', 'b', 'c'],
      errorTileUrl: '/tiles/19/387317/222610.png'
    }).addTo(map);

    const userCarIcon = L.divIcon({
      className: 'live-gps-marker',
      html: `
        <div style="position:relative; width:22px; height:22px; display:flex; align-items:center; justify-content:center;">
          <div style="position:absolute; width:22px; height:22px; border-radius:50%; background:rgba(37,99,235,0.4); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="width:14px; height:14px; border-radius:50%; background:#2563eb; border:2px solid #ffffff; box-shadow:0 0 10px #3b82f6;"></div>
        </div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11]
    });

    userMarkerRef.current = L.marker([26.1542, 85.8918], { icon: userCarIcon }).addTo(map);
    mapInstanceRef.current = map;

    // Listen for live online/offline network changes
    const handleOnline = () => {
      setIsOnline(true);
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (tileLayerRef.current) {
        tileLayerRef.current.setUrl('/tiles/{z}/{x}/{y}.png');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Real Hardware GPS Activation
  const requestHardwareGPS = () => {
    if (!('geolocation' in navigator)) return;

    setGpsStatus('ACQUIRING');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, speed: rawSpeed, heading: rawHeading } = pos.coords;
        const exactPos = [latitude, longitude];
        setCoords(exactPos);
        setGpsStatus('LOCKED');
        if (rawSpeed) setSpeed(Math.round(rawSpeed * 3.6));
        if (rawHeading) setHeading(Math.round(rawHeading));

        if (mapInstanceRef.current && userMarkerRef.current) {
          userMarkerRef.current.setLatLng(exactPos);
          mapInstanceRef.current.setView(exactPos, 17, { animate: true });
        }
      },
      (err) => {
        setGpsStatus(err.code === 1 ? 'DENIED' : 'STANDBY');
      },
      options
    );

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed: rawSpeed, heading: rawHeading } = pos.coords;
        const exactPos = [latitude, longitude];
        setCoords(exactPos);
        setGpsStatus('LOCKED');
        if (rawSpeed) setSpeed(Math.round(rawSpeed * 3.6));
        if (rawHeading) setHeading(Math.round(rawHeading));

        if (mapInstanceRef.current && userMarkerRef.current) {
          userMarkerRef.current.setLatLng(exactPos);
          if (!activeRouteInfo) {
            mapInstanceRef.current.panTo(exactPos, { animate: true });
          }
        }
      },
      () => {},
      options
    );
  };

  useEffect(() => {
    requestHardwareGPS();
    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  // 3. Search Real Locations
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !navigator.onLine) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=4`);
      const data = await res.json();
      setSearchResults(data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 4. Calculate Driving Route
  const selectDestination = async (result) => {
    const destLat = parseFloat(result.lat);
    const destLng = parseFloat(result.lon);
    const startLoc = coords || [26.1542, 85.8918];

    setSearchResults([]);
    setSearchQuery(result.display_name.split(',')[0]);

    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
    }

    const pinIcon = L.divIcon({
      className: 'dest-pin',
      html: '<div style="width:16px;height:16px;background:#ef4444;border:2px solid #fff;border-radius:50%;box-shadow:0 0 10px #ef4444;"></div>',
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    destMarkerRef.current = L.marker([destLat, destLng], { icon: pinIcon }).addTo(mapInstanceRef.current);

    if (navigator.onLine) {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLoc[1]},${startLoc[0]};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const routeCoords = route.geometry.coordinates.map((c) => [c[1], c[0]]);

          if (routeLayerRef.current) routeLayerRef.current.remove();

          routeLayerRef.current = L.polyline(routeCoords, {
            color: '#38bdf8',
            weight: 5,
            opacity: 0.9,
            dashArray: '1, 8',
            lineCap: 'round'
          }).addTo(mapInstanceRef.current);

          mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), { padding: [30, 30] });

          const distKm = (route.distance / 1000).toFixed(1);
          const timeMin = Math.round(route.duration / 60);

          setActiveRouteInfo({ distance: `${distKm} km`, duration: `${timeMin} min`, name: result.display_name.split(',')[0] });

          if (route.legs[0]?.steps[0]?.maneuver?.instruction) {
            setTurnInstruction(route.legs[0].steps[0].maneuver.instruction);
          } else {
            setTurnInstruction(`Head toward ${result.display_name.split(',')[0]}`);
          }
        }
      } catch (err) {
        console.error('Route calculation error:', err);
      }
    }
  };

  const recenter = () => {
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.setView(coords, 17, { animate: true });
    }
  };

  return (
    <div className="split-view">
      {/* Left Navigation Command Deck */}
      <div className="card-panel" style={{ flex: '0 0 42%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#38bdf8', fontWeight: 'bold' }}>NAVIGATION RADAR</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 9, fontFamily: 'monospace', color: isOnline ? '#34d399' : '#fbbf24' }}>
              {isOnline ? <Wifi style={{ width: 11, height: 11 }} /> : <WifiOff style={{ width: 11, height: 11 }} />}
              <span>{isOnline ? 'ONLINE TILES' : 'OFFLINE MODE'}</span>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%' }}>
            <input
              type="text"
              placeholder={isOnline ? "Search destination or landmark..." : "Search requires internet"}
              disabled={!isOnline}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark"
              style={{ paddingLeft: 26, paddingRight: 26, fontSize: 10 }}
            />
            <Search style={{ position: 'absolute', left: 8, top: 8, width: 12, height: 12, color: '#71717a' }} />
            {isSearching && <Loader2 style={{ position: 'absolute', right: 8, top: 8, width: 12, height: 12, color: '#38bdf8', animation: 'spin 1s linear infinite' }} />}
          </form>

          {/* Search Results Dropdown */}
          {searchResults.length > 0 && (
            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: 6, maxHeight: 110, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2, padding: 2 }}>
              {searchResults.map((r, i) => (
                <div
                  key={i}
                  onClick={() => selectDestination(r)}
                  style={{ padding: '4px 6px', fontSize: 9, color: '#e4e4e7', cursor: 'pointer', borderRadius: 4, background: '#27272a', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
                >
                  📍 {r.display_name}
                </div>
              ))}
            </div>
          )}

          {/* Turn-by-Turn Dynamic HUD */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', background: 'rgba(37, 99, 235, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 8 }}>
            <ArrowUpRight style={{ width: 20, height: 20, color: '#38bdf8', flexShrink: 0 }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 'bold', color: '#f4f4f5', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {turnInstruction}
              </div>
              <div style={{ fontSize: 8, color: '#93c5fd', fontFamily: 'monospace' }}>
                {activeRouteInfo ? `${activeRouteInfo.distance} • ${activeRouteInfo.duration}` : 'Live Hardware Tracking'}
              </div>
            </div>
          </div>
        </div>

        {/* Route Info Card */}
        {activeRouteInfo ? (
          <div style={{ padding: '8px', background: '#18181b', border: '1px solid #27272a', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 'bold', color: '#38bdf8' }}>{activeRouteInfo.name}</div>
              <div style={{ fontSize: 8, color: '#71717a', fontFamily: 'monospace' }}>Active Driving Route</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 'bold', color: '#34d399', fontFamily: 'monospace' }}>{activeRouteInfo.duration}</div>
              <div style={{ fontSize: 9, color: '#a1a1aa', fontFamily: 'monospace' }}>{activeRouteInfo.distance}</div>
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px', background: '#121215', border: '1px dashed #27272a', borderRadius: 8, textAlign: 'center', fontSize: 9, color: '#71717a', fontFamily: 'monospace' }}>
            {gpsStatus === 'LOCKED' ? '📍 GPS Locked. Ready for navigation.' : 'Acquiring GPS fix...'}
          </div>
        )}

        {/* Telemetry Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', background: '#18181b', borderRadius: 6, fontSize: 9, fontFamily: 'monospace' }}>
          <span style={{ color: '#71717a' }}>SPEED: <strong style={{ color: '#fff' }}>{speed} km/h</strong></span>
          <span style={{ color: gpsStatus === 'LOCKED' ? '#34d399' : '#fbbf24', fontWeight: 'bold' }}>
            {gpsStatus === 'LOCKED' ? 'GPS LOCKED' : 'SEARCHING SATELLITE...'}
          </span>
        </div>
      </div>

      {/* Map Tile Frame */}
      <div className="card-panel" style={{ flex: '0 0 56%', padding: 0, position: 'relative', overflow: 'hidden' }}>
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} />

        <button
          onClick={recenter}
          title="Recenter Location"
          style={{ position: 'absolute', bottom: 8, right: 8, zIndex: 1000, width: 32, height: 32, borderRadius: 6, background: '#09090b', border: '1px solid #3b82f6', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
        >
          <LocateFixed style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}
