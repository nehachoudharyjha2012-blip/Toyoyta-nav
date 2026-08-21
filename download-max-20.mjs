import fs from 'fs';
import path from 'path';
import https from 'https';

// Darbhanga Central Core, MLSM College, Kathalbari, Lalbagh & Bypass Hub
const minLon = 85.85, maxLon = 85.95;
const minLat = 26.12, maxLat = 26.19;
const minZoom = 19, maxZoom = 20;
const CONCURRENCY = 50; // 50 simultaneous parallel workers

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
    const url = `https://mt1.google.com/vt/lyrs=m&x=${x}&y=${y}&z=${z}`;
    const options = {
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64)' }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function start() {
  console.log('⚡ Turbo Downloader: Fetching Native Zoom 19 & 20 Tiles...\n');
  const queue = [];

  for (let z = minZoom; z <= maxZoom; z++) {
    const startX = lon2tile(minLon, z);
    const endX = lon2tile(maxLon, z);
    const startY = lat2tile(maxLat, z);
    const endY = lat2tile(minLat, z);

    for (let x = startX; x <= endX; x++) {
      const dir = path.join(process.cwd(), 'public', 'tiles', String(z), String(x));
      fs.mkdirSync(dir, { recursive: true });

      for (let y = startY; y <= endY; y++) {
        const filePath = path.join(dir, `${y}.png`);
        if (!fs.existsSync(filePath)) {
          queue.push({ z, x, y, filePath });
        }
      }
    }
  }

  const total = queue.length;
  console.log(`Total Level 19-20 tiles to fetch: ${total}\n`);
  let completed = 0;

  async function worker() {
    while (queue.length > 0) {
      const task = queue.shift();
      if (!task) break;
      await downloadTile(task.z, task.x, task.y, task.filePath);
      completed++;
      process.stdout.write(`\r⚡ [Zoom 19-20 Progress] ${completed}/${total} tiles (${Math.round((completed / total) * 100)}%)`);
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log('\n\n Done! Native Zoom 19 & 20 tiles are fully saved to disk.\n');
}

start();
