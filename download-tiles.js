import fs from 'fs';
import path from 'path';
import https from 'https';

// Darbhanga bounding coordinates
const minLon = 85.80, maxLon = 86.05;
const minLat = 26.10, maxLat = 26.25;
const minZoom = 11, maxZoom = 14;

function lon2tile(lon, zoom) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

function lat2tile(lat, zoom) {
  return Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );
}

function downloadTile(z, x, y, destPath) {
  return new Promise((resolve) => {
    const url = `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    const options = {
      headers: { 'User-Agent': 'ToyotaNavApp/1.0 (offline education build)' }
    };

    https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        resolve();
      }
    }).on('error', () => resolve());
  });
}

async function start() {
  console.log('🚀 Downloading Darbhanga offline tiles...');
  let count = 0;

  for (let z = minZoom; z <= maxZoom; z++) {
    const startX = lon2tile(minLon, z);
    const endX = lon2tile(maxLon, z);
    const startY = lat2tile(maxLat, z);
    const endY = lat2tile(minLat, z);

    for (let x = startX; x <= endX; x++) {
      const dir = path.join(process.cwd(), 'public', 'tiles', `${z}`, `${x}`);
      fs.mkdirSync(dir, { recursive: true });

      for (let y = startY; y <= endY; y++) {
        const filePath = path.join(dir, `${y}.png`);
        if (!fs.existsSync(filePath)) {
          await downloadTile(z, x, y, filePath);
          count++;
          process.stdout.write(`\rSaved tile: ${z}/${x}/${y}.png (Total: ${count})`);
          // Polite rate limit for OpenStreetMap servers
          await new Promise((r) => setTimeout(r, 100));
        }
      }
    }
  }
  console.log('\n✅ Download complete! All tiles are in public/tiles/');
}

start();
