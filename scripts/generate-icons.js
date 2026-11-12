import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

// 1. Create clean SVG icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#064e3b" />
  <circle cx="256" cy="256" r="140" fill="#047857" />
  <!-- Solar Sun Core -->
  <circle cx="256" cy="256" r="80" fill="#fbbf24" stroke="#f59e0b" stroke-width="8" />
  <!-- Solar Rays -->
  <g stroke="#fbbf24" stroke-width="12" stroke-linecap="round">
    <line x1="256" y1="90" x2="256" y2="135" />
    <line x1="256" y1="377" x2="256" y2="422" />
    <line x1="90" y1="256" x2="135" y2="256" />
    <line x1="377" y1="256" x2="422" y2="256" />
    <line x1="138" y1="138" x2="170" y2="170" />
    <line x1="342" y1="342" x2="374" y2="374" />
    <line x1="138" y1="374" x2="170" y2="342" />
    <line x1="342" y1="170" x2="374" y2="138" />
  </g>
  <!-- Solar PV Grid Pattern inside Sun -->
  <path d="M 220 220 L 292 220 M 220 256 L 292 256 M 220 292 L 292 292 M 256 200 L 256 312" stroke="#064e3b" stroke-width="4" stroke-linecap="round" />
  <!-- Energy Zap -->
  <polygon points="270,180 230,260 265,260 240,330 300,240 265,240" fill="#ffffff" opacity="0.9" />
</svg>`;

fs.writeFileSync(path.resolve(PUBLIC_DIR, 'icon.svg'), svgContent, 'utf-8');

// Minimal PNG generator for solid/patterned PNGs
function createPNG(width, height, isMaskable = false) {
  // RGBA buffer: 4 bytes per pixel + 1 filter byte per row
  const rowBytes = width * 4;
  const rawData = Buffer.alloc((rowBytes + 1) * height);

  const cx = width / 2;
  const cy = height / 2;
  const rSun = width * 0.22;
  const rGlow = width * 0.38;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (rowBytes + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Deep Solar Green (#064e3b -> [6, 78, 59])
      let r = 6;
      let g = 78;
      let b = 59;
      let a = 255;

      if (dist < rSun) {
        // Sun gold center (#fbbf24 -> [251, 191, 36])
        r = 251;
        g = 191;
        b = 36;
      } else if (dist < rGlow) {
        // Inner emerald ring (#047857 -> [4, 120, 87])
        r = 4;
        g = 120;
        b = 87;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type (RGBA)
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  // CRC
  const crc = crc32(chunk.subarray(4, len + 8));
  chunk.writeUInt32BE(crc, len + 8);
  return chunk;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (c ^ buf[n]);
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Generate PNGs
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.resolve(PUBLIC_DIR, 'apple-touch-icon.png'), createPNG(180, 180, false));

console.log('PWA icon assets created successfully in public/');
