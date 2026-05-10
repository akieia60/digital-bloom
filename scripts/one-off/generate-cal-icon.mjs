// One-off icon generator for the Team Calendar PWA-style home-screen tile.
// Outputs public/cal-icon-180.png and public/cal-icon-512.png.
// Usage: node scripts/one-off/generate-cal-icon.mjs

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', '..', 'public');

const NAVY = '#0D1B36';
const NAVY_DEEP = '#050510';
const GOLD = '#D4AF37';
const GOLD_SOFT = '#EBD78A';
const ROSE = '#F4C9D7';

function drawIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Navy gradient background — slight diagonal so it looks lit, not flat.
  const bg = ctx.createLinearGradient(0, 0, size, size);
  bg.addColorStop(0, NAVY);
  bg.addColorStop(1, NAVY_DEEP);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  // Gold ring frame around the inside (echoes brand)
  const inset = size * 0.07;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = Math.max(2, size * 0.012);
  ctx.beginPath();
  ctx.roundRect(inset, inset, size - inset * 2, size - inset * 2, size * 0.16);
  ctx.stroke();

  // Calendar header bar
  const calLeft = size * 0.20;
  const calRight = size * 0.80;
  const calWidth = calRight - calLeft;
  const headerY = size * 0.30;
  const headerH = size * 0.10;
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.roundRect(calLeft, headerY, calWidth, headerH, size * 0.025);
  ctx.fill();

  // Two binder "rings" sticking up above the header
  const ringR = size * 0.025;
  const ringY = headerY - ringR * 1.2;
  ctx.fillStyle = GOLD_SOFT;
  ctx.beginPath();
  ctx.arc(calLeft + calWidth * 0.25, ringY, ringR, 0, Math.PI * 2);
  ctx.arc(calLeft + calWidth * 0.75, ringY, ringR, 0, Math.PI * 2);
  ctx.fill();

  // Calendar body — soft cream/gold panel
  const bodyY = headerY + headerH;
  const bodyH = size * 0.32;
  ctx.fillStyle = 'rgba(245, 235, 210, 0.95)';
  ctx.beginPath();
  ctx.roundRect(calLeft, bodyY, calWidth, bodyH, size * 0.025);
  ctx.fill();

  // Subtle grid hint inside body — 3 columns × 2 rows of dots
  ctx.fillStyle = 'rgba(13, 27, 54, 0.30)';
  const dotR = size * 0.012;
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = calLeft + calWidth * (0.22 + col * 0.28);
      const cy = bodyY + bodyH * (0.30 + row * 0.40);
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Bloom (5-petal rose stylization) overlapping the calendar — anchors brand identity
  const bloomCx = size * 0.50;
  const bloomCy = bodyY + bodyH;
  const petalR = size * 0.085;

  // Outer petals (5)
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + i * (Math.PI * 2 / 5);
    const pcx = bloomCx + Math.cos(angle) * petalR * 0.6;
    const pcy = bloomCy + Math.sin(angle) * petalR * 0.6;
    const grad = ctx.createRadialGradient(pcx, pcy, 0, pcx, pcy, petalR);
    grad.addColorStop(0, ROSE);
    grad.addColorStop(1, '#A8557A');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(pcx, pcy, petalR, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner gold center
  const center = ctx.createRadialGradient(bloomCx, bloomCy, 0, bloomCx, bloomCy, petalR * 0.55);
  center.addColorStop(0, GOLD_SOFT);
  center.addColorStop(1, GOLD);
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(bloomCx, bloomCy, petalR * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Tiny gold stamen detail
  ctx.fillStyle = 'rgba(13, 27, 54, 0.5)';
  ctx.beginPath();
  ctx.arc(bloomCx, bloomCy, petalR * 0.18, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toBuffer('image/png');
}

[180, 192, 512].forEach((size) => {
  const buf = drawIcon(size);
  const out = path.join(PUBLIC_DIR, `cal-icon-${size}.png`);
  fs.writeFileSync(out, buf);
  console.log(`wrote ${out} (${buf.length} bytes)`);
});
