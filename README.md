# 🚗 Toyota Multimedia OS (Universal Head Unit)

A responsive, high-performance automotive infotainment interface and digital instrument cluster. Designed to automatically scale and adapt across **Android Phones/Tablets (e.g., Samsung Galaxy series)**, **Embedded In-Car Head Units**, and **Desktop/Laptop PC Browsers (Linux / Windows)**.

---

## 📱 Device Compatibility & Auto-Adaptation

| Device Category | Supported Environments | Layout Optimization |
| :--- | :--- | :--- |
| **Android Smartphones** | Chrome, Firefox, Native APK | Adaptive compact split view, vertical scroll isolation, touch dialer |
| **In-Car Tablets / Head Units** | Landscape Android, WebViews | Wide double-panel soundstage & navigation radar, HUD telemetry |
| **Desktop / Laptop PCs** | Chrome, Firefox, Edge, Safari | Responsive high-DPI scaling, full multi-window dashboard |

---

## 🌟 Core System Modules

* **🗺️ Tactical Navigation & OSRM Engine:** Dynamic search geocoding (Nominatim), turn-by-turn guidance HUD, and automated route polyline plotting.
* **🛰️ Hybrid Online/Offline Map System:** Automatically serves local offline map tiles (`public/tiles/{z}/{x}/{y}.png`) when offline, and pulls live high-res OpenStreetMap tiles when connected.
* **📍 Real Hardware Satellite GPS:** Live speedometer (km/h), compass heading, and zero-cache hardware coordinate centering.
* **🎵 Persistent Audio Soundstage:** Global background audio player that continues playing across all tab switches, with seeking (±10s), scrubber, and local file import (`+ Add Tracks`).
* **📻 Live Internet Radio Matrix:** Multi-station live streaming engine (Bollywood Hits, Lo-Fi Chill, BBC World Service, Retro Classics).
* **📞 Anti-Flicker Telephony Dialer:** Non-blocking memoized keypad with instant emergency shortcuts (`112`, `1033` NHAI).
* **⛽ Trip & Fuel Calculator:** Real-time mileage, cost, and fuel efficiency estimator.
* **📺 Media Stream Hub:** Responsive video and YouTube embed pipeline.
* **🔋 Telemetry Header Bar:** Live clock, ambient temperature (Open-Meteo REST API), and real-time battery/charging indicators.

---

## 🚀 Setup Guide (All Devices)

### 1. Development & Local Run (PC / Linux / Windows)
```bash
# Clone the repository
git clone https://github.com/nehachoudharyjha2012-blip/Toyoyta-nav.git
cd toyota-nav

# Install dependencies
npm install

# Start local server accessible to all network devices
npm run dev -- --host
On PC: Open http://localhost:5173

On Android/Tablet (Same Wi-Fi): Open http://<YOUR_LAPTOP_IP>:5173
