### 🔒 Security, Privacy & Permissions Notice

Before installing and using this release, please review the following security and data-handling practices:

* **Location Data & GPS Privacy:** 
  The app requests `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` strictly for real-time map centering, speed calculations, and navigation. Location data is processed entirely on-device and is never stored, tracked, or sent to external telemetry servers.

* **Third-Party APIs & Plain HTTP Traffic:**
  * **Search & Routing:** Searching destinations and computing routes queries the public OpenStreetMap Nominatim and OSRM APIs over HTTPS.
  * **Weather Telemetry:** Ambient temperature queries the Open-Meteo REST API.
  * **Tile Loading:** Remote map tiles are fetched from OpenStreetMap servers.
  * Do not input sensitive personal data or private addresses into search inputs if you are operating on an untrusted public network without a VPN.

* **Media Stream & YouTube Embeds:**
  The Media Stream Hub embeds content via standard web `<iframe>` interfaces (`youtube-nocookie.com`). Embedded content is subject to the respective provider's privacy policy.

* **Telephony Permissions (`CALL_PHONE`):**
  The dialer initiates calls using native Android intents (`tel:` protocol) and requires phone permissions to place direct calls to emergency and preset numbers. It does not access, record, or transmit your call logs or contact books.

* **Sideloading & Debug Builds:**
  This is an unsigned debug APK (`app-debug.apk`). Android Play Protect will display an "Unknown Developer" warning during sideloading. Only install APK binaries compiled directly from the official source repository.
