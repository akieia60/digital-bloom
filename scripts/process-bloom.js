#!/usr/bin/env node
/**
 * Digital Bloom — Watermark Burn-In
 * 
 * Generates a transparent PNG watermark overlay using canvas,
 * then uses FFmpeg's overlay filter to burn it permanently into the video.
 *
 * Usage:
 *   node process-bloom.js <input_video> <recipient_name> [output_path]
 *
 * Watermark layers:
 *   1. "TM" — bottom-left corner
 *   2. "Digital Bloom™" — bottom-right corner  
 *   3. Diagonal repeating "Digital Bloom" pattern — covers entire frame
 *   4. "For [Recipient Name]" — center-bottom
 */

const { createCanvas } = require('canvas');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ── Parse args ──
const inputVideo = process.argv[2];
const recipientName = process.argv[3];
let outputPath = process.argv[4];

if (!inputVideo || !recipientName) {
  console.error('Usage: node process-bloom.js <input_video> <recipient_name> [output_path]');
  process.exit(1);
}

if (!outputPath) {
  const baseName = path.basename(inputVideo, path.extname(inputVideo));
  const outDir = path.join(path.dirname(inputVideo), 'watermarked');
  fs.mkdirSync(outDir, { recursive: true });
  outputPath = path.join(outDir, `${baseName}_protected.mp4`);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// ── Step 1: Get video dimensions ──
console.log('🎬 Processing bloom video...');
console.log(`   Input:     ${inputVideo}`);
console.log(`   Recipient: ${recipientName}`);
console.log(`   Output:    ${outputPath}`);

let width, height;
try {
  const probeOutput = execSync(
    `ffprobe -v quiet -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "${inputVideo}"`,
    { encoding: 'utf8' }
  ).trim();
  [width, height] = probeOutput.split(',').map(Number);
  console.log(`   Size:      ${width}x${height}`);
} catch (e) {
  console.error('❌ Could not probe video dimensions');
  process.exit(1);
}

// ── Step 2: Generate watermark PNG ──
console.log('🖼️  Generating watermark overlay...');

const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fully transparent background
ctx.clearRect(0, 0, width, height);

// ── Layer 1: "TM" bottom-left ──
ctx.font = 'bold 16px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
ctx.shadowBlur = 3;
ctx.shadowOffsetX = 1;
ctx.shadowOffsetY = 1;
ctx.fillText('TM', 20, height - 25);

// ── Layer 2: "Digital Bloom™" bottom-right ──
ctx.font = 'bold 16px Arial';
const dbText = 'Digital Bloom™';
const dbMetrics = ctx.measureText(dbText);
ctx.fillText(dbText, width - dbMetrics.width - 20, height - 25);

// Reset shadow
ctx.shadowBlur = 0;
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 0;

// ── Layer 3: Diagonal repeating "Digital Bloom" pattern ──
ctx.save();
ctx.font = '24px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
ctx.translate(width / 2, height / 2);
ctx.rotate(-30 * Math.PI / 180); // -30 degree rotation

const patternText = 'Digital Bloom   ';
const rows = 12;
const spacing = 70;

for (let row = -rows; row <= rows; row++) {
  const y = row * spacing;
  // Offset alternating rows for a staggered pattern
  const xOffset = (row % 2) * 100;
  
  // Draw enough text to cover the entire rotated frame
  for (let x = -width; x < width * 2; x += 280) {
    ctx.fillText(patternText + patternText, x + xOffset, y);
  }
}
ctx.restore();

// ── Layer 4: "For [Recipient Name]" center-bottom ──
ctx.font = 'bold 26px Arial';
ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
ctx.shadowBlur = 4;
ctx.shadowOffsetX = 2;
ctx.shadowOffsetY = 2;
const forText = `For ${recipientName}`;
const forMetrics = ctx.measureText(forText);
ctx.fillText(forText, (width - forMetrics.width) / 2, height - 50);

// ── Save watermark PNG ──
const watermarkPath = '/tmp/bloom_watermark.png';
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(watermarkPath, buffer);
console.log(`   Watermark:  ${watermarkPath} (${Math.round(buffer.length / 1024)}KB)`);

// ── Step 3: Burn watermark into video using FFmpeg overlay ──
console.log('🔥 Burning watermarks into video...');

try {
  execSync(
    `ffmpeg -y -i "${inputVideo}" -i "${watermarkPath}" ` +
    `-filter_complex "[0:v][1:v]overlay=0:0:format=auto[out]" ` +
    `-map "[out]" -map 0:a? ` +
    `-c:v libx264 -preset medium -crf 23 ` +
    `-c:a aac -b:a 128k ` +
    `-movflags +faststart ` +
    `"${outputPath}"`,
    { stdio: 'pipe', encoding: 'utf8' }
  );
  
  const stats = fs.statSync(outputPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);
  
  console.log('');
  console.log(`✅ Watermarked video saved!`);
  console.log(`   Output:    ${outputPath}`);
  console.log(`   File size: ${sizeMB}MB`);
  
  // Cleanup
  fs.unlinkSync(watermarkPath);
} catch (e) {
  console.error('❌ FFmpeg error:', e.message);
  process.exit(1);
}
