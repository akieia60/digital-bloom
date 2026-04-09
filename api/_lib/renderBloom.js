import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';
import { createCanvas } from 'canvas';
import { normalizePublicBaseUrl } from './publicBaseUrl.js';

const execFileAsync = promisify(execFile);
const DELIVERY_BUCKET = process.env.BLOOM_DELIVERY_BUCKET || 'bloom-deliveries';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const RENDER_PRESETS = {
  heirloom: {
    dedicationColor: 'white@0.84',
    messageColor: 'white@0.88',
    messageBox: '0x07111F@0.28',
    signatureColor: 'white@0.76',
    railColor: '0x04101D@0.40',
    accentColor: '0xD4AF37@0.58',
    brandColor: '0xD4AF37@0.92',
  },
  signature: {
    dedicationColor: 'white@0.80',
    messageColor: 'white@0.90',
    messageBox: '0x081325@0.18',
    signatureColor: 'white@0.72',
    railColor: '0x04101D@0.36',
    accentColor: '0xE8D7B0@0.52',
    brandColor: '0xF0D48C@0.88',
  },
  modern: {
    dedicationColor: 'white@0.82',
    messageColor: 'white@0.90',
    messageBox: '0x06111F@0.42',
    signatureColor: 'white@0.78',
    railColor: '0x02101C@0.55',
    accentColor: '0xD4AF37@0.44',
    brandColor: '0xE0C16D@0.92',
  },
};

const FONT_PRESETS = {
  playfair: {
    renderFont: 'Serif',
    recipientSize: 'h*0.034',
    messageSize: 'h*0.024',
    senderSize: 'h*0.026',
  },
  outfit: {
    renderFont: 'Sans',
    recipientSize: 'h*0.033',
    messageSize: 'h*0.025',
    senderSize: 'h*0.025',
  },
  arialBold: {
    renderFont: 'Sans',
    recipientSize: 'h*0.035',
    messageSize: 'h*0.026',
    senderSize: 'h*0.026',
  },
};

const LOCALE_LABELS = {
  en: { to: 'To', from: 'From' },
  es: { to: 'Para', from: 'De' },
  fr: { to: 'A', from: 'De' },
  ht: { to: 'Pou', from: 'De' },
  zh: { to: '致', from: '来自' },
};

const THEME_TUNING = {
  original: { hueRotate: -6, saturate: 1.08, brightness: 1.02 },
  warm: { hueRotate: -6, saturate: 1.28, brightness: 1.06 },
  cool: { hueRotate: 148, saturate: 1.12, brightness: 1.05 },
  elegant: { hueRotate: 0, saturate: 1.18, brightness: 1.08 },
  romantic: { hueRotate: -18, saturate: 1.34, brightness: 1.03 },
  custom: { hueRotate: 0, saturate: 1.12, brightness: 1.04 },
};

const ENGRAVING_LAYOUTS = {
  heirloom: {
    recipient: { x: 'w*0.06', y: 'h*0.10', boxborderw: 16 },
    messageBox: { x: 'w*0.055', y: 'h*0.705', w: 'w*0.54', h: 'h*0.12' },
    message: { x: 'w*0.078', y: 'h*0.765' },
    sender: { x: 'w-tw-w*0.06', y: 'h*0.80', boxborderw: 12 },
  },
  signature: {
    recipient: { x: 'w*0.08', y: 'h*0.12', boxborderw: 14 },
    messageBox: null,
    message: { x: '(w-tw)/2', y: 'h*0.745' },
    sender: { x: 'w-tw-w*0.06', y: 'h*0.80', boxborderw: 12 },
  },
  modern: {
    recipient: { x: 'w*0.06', y: 'h*0.10', boxborderw: 14 },
    messageBox: { x: 'w*0.055', y: 'h*0.725', w: 'w*0.50', h: 'h*0.105' },
    message: { x: 'w*0.078', y: 'h*0.79' },
    sender: { x: 'w-tw-w*0.06', y: 'h*0.80', boxborderw: 12 },
  },
};

const SPARKLE_PARTICLES = [
  { x: 'w*0.18', y: 'h*0.18', size: 'w*0.008' },
  { x: 'w*0.74', y: 'h*0.28', size: 'w*0.010' },
  { x: 'w*0.45', y: 'h*0.40', size: 'w*0.007' },
  { x: 'w*0.14', y: 'h*0.57', size: 'w*0.006' },
  { x: 'w*0.81', y: 'h*0.60', size: 'w*0.010' },
  { x: 'w*0.36', y: 'h*0.76', size: 'w*0.008' },
];

const GOLD_DUST_PARTICLES = [
  { x: 'w*0.10', y: 'h*0.14', size: 'w*0.005' },
  { x: 'w*0.22', y: 'h*0.10', size: 'w*0.006' },
  { x: 'w*0.61', y: 'h*0.12', size: 'w*0.007' },
  { x: 'w*0.80', y: 'h*0.22', size: 'w*0.005' },
  { x: 'w*0.32', y: 'h*0.30', size: 'w*0.004' },
  { x: 'w*0.55', y: 'h*0.34', size: 'w*0.006' },
  { x: 'w*0.88', y: 'h*0.48', size: 'w*0.005' },
  { x: 'w*0.18', y: 'h*0.66', size: 'w*0.006' },
];

const PETAL_ACCENTS = [
  { x: 'w*0.12', y: 'h*0.22', w: 'w*0.018', h: 'h*0.014' },
  { x: 'w*0.78', y: 'h*0.18', w: 'w*0.016', h: 'h*0.012' },
  { x: 'w*0.70', y: 'h*0.52', w: 'w*0.014', h: 'h*0.010' },
  { x: 'w*0.22', y: 'h*0.74', w: 'w*0.018', h: 'h*0.014' },
];

function normalizeHex(hex, fallback = 'D4AF37') {
  const value = String(hex || '').replace('#', '').trim();
  return /^[0-9a-f]{6}$/i.test(value) ? value.toUpperCase() : fallback;
}

function withAlpha(hex, alpha) {
  return `0x${normalizeHex(hex)}@${alpha}`;
}

function rgba(hex, alpha = 1) {
  const normalized = normalizeHex(hex);
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function sanitizeFilePart(value, fallback = 'bloom') {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || fallback;
}

function resolveMediaPath(source) {
  const value = String(source || '').trim();
  if (!value) return { type: 'missing', value: null };

  if (/^https?:\/\//i.test(value)) {
    return { type: 'remote', value };
  }

  if (value.startsWith('/')) {
    const localPath = path.join(process.cwd(), 'public', value.replace(/^\/+/, ''));
    if (fs.existsSync(localPath)) {
      return { type: 'local', value: localPath };
    }

    const baseUrl = normalizePublicBaseUrl(
      process.env.APP_BASE_URL || process.env.VITE_APP_URL || process.env.VITE_API_URL
    );
    if (baseUrl) {
      return { type: 'remote', value: new URL(value, baseUrl).toString() };
    }
  }

  return { type: 'remote', value };
}

function escapeDrawtext(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/:/g, '\\:')
    .replace(/'/g, "\\'")
    .replace(/,/g, '\\,')
    .replace(/%/g, '\\%')
    .replace(/\n/g, '\\\\n');
}

function buildDrawText(text, config) {
  const parts = [
    `drawtext=text='${escapeDrawtext(text)}'`,
    `fontcolor=${config.fontcolor}`,
    `fontsize=${config.fontsize}`,
    `x=${config.x}`,
    `y=${config.y}`,
    `shadowcolor=black@0.75`,
    'shadowx=2',
    'shadowy=2',
  ];

  if (config.font) {
    parts.push(`font=${config.font}`);
  }

  if (config.boxcolor) {
    parts.push('box=1');
    parts.push(`boxcolor=${config.boxcolor}`);
    parts.push(`boxborderw=${config.boxborderw || 12}`);
  }

  return parts.join(':');
}

function normalizeMessage(text) {
  const normalized = String(text || '').replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  return normalized.length > 64 ? `${normalized.slice(0, 61).trimEnd()}...` : normalized;
}

function getMessageSizeExpr(messageText = '', engravingStyle = 'heirloom', fontChoice = 'playfair') {
  const trimmedLength = String(messageText || '').trim().length;
  const font = FONT_PRESETS[fontChoice] || FONT_PRESETS.playfair;

  if (engravingStyle === 'signature') {
    if (trimmedLength > 90) return 'h*0.020';
    if (trimmedLength > 56) return 'h*0.022';
    return 'h*0.025';
  }

  if (trimmedLength > 90) return 'h*0.019';
  if (trimmedLength > 56) return 'h*0.021';
  return font.messageSize;
}

function buildThemeFilters({
  hueRotate = 0,
  saturate = 1,
  brightness = 1,
}) {
  const filters = [];
  const brightnessShift = Math.max(-0.25, Math.min(0.25, Number(brightness || 1) - 1));

  filters.push(`eq=saturation=${Number(saturate || 1).toFixed(2)}:brightness=${brightnessShift.toFixed(2)}`);

  if (Number(hueRotate || 0) !== 0) {
    filters.push(`hue=h=${Number(hueRotate).toFixed(0)}`);
  }

  return filters;
}

function buildEffectFilters(extras = {}, { primaryColor, accentColor }) {
  const filters = [];

  if (extras.softGlow) {
    filters.push(`drawbox=x=iw*0.16:y=ih*0.12:w=iw*0.68:h=ih*0.56:color=${withAlpha(accentColor, 0.08)}:t=fill`);
    filters.push(`drawbox=x=iw*0.27:y=ih*0.22:w=iw*0.44:h=ih*0.34:color=${withAlpha(primaryColor, 0.05)}:t=fill`);
  }

  if (extras.ribbon) {
    filters.push(`drawbox=x=iw*0.018:y=ih*0.018:w=iw*0.964:h=ih*0.964:color=${withAlpha(accentColor, 0.22)}:t=fill`);
    filters.push(`drawbox=x=iw*0.032:y=ih*0.032:w=iw*0.936:h=ih*0.936:color=black@1.0:t=fill`);
    filters.push(`drawbox=x=iw*0.03:y=ih*0.03:w=iw*0.94:h=ih*0.94:color=${withAlpha(accentColor, 0.64)}:t=6`);
  }

  if (extras.sparkle) {
    SPARKLE_PARTICLES.forEach((particle) => {
      filters.push(`drawbox=x=${particle.x.replaceAll('w', 'iw').replaceAll('h', 'ih')}:y=${particle.y.replaceAll('w', 'iw').replaceAll('h', 'ih')}:w=${particle.size.replaceAll('w', 'iw').replaceAll('h', 'ih')}:h=${particle.size.replaceAll('w', 'iw').replaceAll('h', 'ih')}:color=${withAlpha(accentColor, 0.92)}:t=fill`);
    });
  }

  if (extras.goldDust) {
    GOLD_DUST_PARTICLES.forEach((particle) => {
      filters.push(`drawbox=x=${particle.x.replaceAll('w', 'iw').replaceAll('h', 'ih')}:y=${particle.y.replaceAll('w', 'iw').replaceAll('h', 'ih')}:w=${particle.size.replaceAll('w', 'iw').replaceAll('h', 'ih')}:h=${particle.size.replaceAll('w', 'iw').replaceAll('h', 'ih')}:color=${withAlpha(accentColor, 0.72)}:t=fill`);
    });
  }

  if (extras.rosePetals) {
    PETAL_ACCENTS.forEach((petal) => {
      filters.push(`drawbox=x=${petal.x.replaceAll('w', 'iw').replaceAll('h', 'ih')}:y=${petal.y.replaceAll('w', 'iw').replaceAll('h', 'ih')}:w=${petal.w.replaceAll('w', 'iw').replaceAll('h', 'ih')}:h=${petal.h.replaceAll('w', 'iw').replaceAll('h', 'ih')}:color=${withAlpha(primaryColor, 0.58)}:t=fill`);
    });
  }

  return filters;
}

function roundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function getCanvasFont(fontChoice, size, weight = 600, italic = false) {
  const family = fontChoice === 'playfair' ? 'Georgia' : 'Arial';
  return `${italic ? 'italic ' : ''}${weight} ${Math.round(size)}px ${family}`;
}

function wrapText(ctx, text, maxWidth) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (ctx.measureText(testLine).width <= maxWidth || !currentLine) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);
  return lines;
}

async function getVideoMetadata(inputPath) {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    inputPath,
  ]);

  const parsed = JSON.parse(stdout || '{}');
  const stream = parsed.streams?.[0] || {};
  return {
    width: Number(stream.width || 720),
    height: Number(stream.height || 1280),
  };
}

async function createOverlayImage(destination, {
  width,
  height,
  recipientName,
  senderName,
  shortMessage,
  engravingStyle,
  fontChoice,
  locale,
  primaryColor,
  accentColor,
}) {
  const layout = ENGRAVING_LAYOUTS[engravingStyle] || ENGRAVING_LAYOUTS.heirloom;
  const labels = LOCALE_LABELS[locale] || LOCALE_LABELS.en;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, width, height);

  const railX = width * 0.035;
  const railY = height * 0.865;
  const railW = width * 0.93;
  const railH = height * 0.09;
  roundRect(ctx, railX, railY, railW, railH, 22);
  ctx.fillStyle = rgba(primaryColor, 0.56);
  ctx.fill();

  ctx.fillStyle = rgba(accentColor, 0.84);
  ctx.fillRect(width * 0.055, height * 0.865, width * 0.89, Math.max(3, height * 0.0025));

  if (recipientName) {
    const x = width * (layout.recipient.x.includes('0.08') ? 0.08 : 0.06);
    const y = height * (layout.recipient.y.includes('0.12') ? 0.12 : 0.10);
    ctx.font = getCanvasFont(fontChoice, height * 0.034, 700, false);
    const label = `${labels.to} ${recipientName}`;
    const textWidth = ctx.measureText(label).width;
    roundRect(ctx, x - 14, y - 32, textWidth + 28, 46, 18);
    ctx.fillStyle = rgba(accentColor, 0.12);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y - 10);
  }

  if (shortMessage) {
    const messageSize = engravingStyle === 'signature'
      ? (shortMessage.length > 56 ? height * 0.022 : height * 0.025)
      : (shortMessage.length > 90 ? height * 0.019 : shortMessage.length > 56 ? height * 0.021 : height * 0.024);
    ctx.font = getCanvasFont(fontChoice, messageSize, fontChoice === 'arialBold' ? 700 : 600, engravingStyle === 'signature');
    const maxTextWidth = layout.messageBox ? width * 0.46 : width * 0.70;
    const lines = wrapText(ctx, shortMessage, maxTextWidth);
    const lineHeight = messageSize * 1.25;
    const textBlockHeight = lines.length * lineHeight;

    if (layout.messageBox) {
      const boxX = eval(layout.messageBox.x.replace(/w/g, width).replace(/h/g, height));
      const boxY = eval(layout.messageBox.y.replace(/w/g, width).replace(/h/g, height));
      const boxW = eval(layout.messageBox.w.replace(/w/g, width).replace(/h/g, height));
      const boxH = Math.max(eval(layout.messageBox.h.replace(/w/g, width).replace(/h/g, height)), textBlockHeight + 28);
      roundRect(ctx, boxX, boxY, boxW, boxH, 24);
      ctx.fillStyle = rgba(primaryColor, 0.24);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      lines.forEach((line, index) => {
        ctx.fillText(line, boxX + 18, boxY + 26 + (index * lineHeight));
      });
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.textAlign = 'center';
      lines.forEach((line, index) => {
        ctx.fillText(line, width / 2, height * 0.745 + (index * lineHeight));
      });
      ctx.textAlign = 'start';
    }
  }

  if (senderName) {
    const label = `${labels.from} ${senderName}`;
    const maxBoxWidth = width * 0.34;
    let senderFontSize = height * 0.024;
    ctx.font = getCanvasFont(fontChoice, senderFontSize, 700, false);
    let textWidth = ctx.measureText(label).width;

    while ((textWidth + 24) > maxBoxWidth && senderFontSize > (height * 0.017)) {
      senderFontSize -= 1.5;
      ctx.font = getCanvasFont(fontChoice, senderFontSize, 700, false);
      textWidth = ctx.measureText(label).width;
    }

    const boxW = textWidth + 24;
    const boxH = 42;
    const boxX = width - boxW - (width * 0.085);
    const boxY = height * 0.758;
    roundRect(ctx, boxX, boxY, boxW, boxH, 18);
    ctx.fillStyle = rgba(accentColor, 0.10);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.74)';
    ctx.fillText(label, boxX + 12, boxY + 27);
  }

  const stampText = 'Digital Bloom™';
  ctx.font = `italic 700 ${Math.round(height * 0.023)}px Georgia`;
  const stampWidth = ctx.measureText(stampText).width;
  const stampBoxX = width * 0.055;
  const stampBoxY = height * 0.872;
  const stampBoxW = stampWidth + 26;
  const stampBoxH = height * 0.05;

  roundRect(ctx, stampBoxX, stampBoxY, stampBoxW, stampBoxH, 18);
  ctx.fillStyle = rgba(primaryColor, 0.40);
  ctx.fill();
  ctx.strokeStyle = rgba(accentColor, 0.32);
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = rgba(accentColor, 0.98);
  ctx.fillText(stampText, stampBoxX + 13, height * 0.905);

  ctx.save();
  ctx.translate(width * 0.5, height * 0.48);
  ctx.rotate(-0.12);
  ctx.font = `italic 700 ${Math.round(height * 0.04)}px Georgia`;
  ctx.fillStyle = rgba(accentColor, 0.10);
  ctx.textAlign = 'center';
  ctx.fillText('Digital Bloom', 0, 0);
  ctx.restore();

  const buffer = canvas.toBuffer('image/png');
  await fs.promises.writeFile(destination, buffer);
}

async function downloadFile(url, destination) {
  const resolved = resolveMediaPath(url);

  if (resolved.type === 'local' && resolved.value) {
    await fs.promises.copyFile(resolved.value, destination);
    return;
  }

  if (!resolved.value) {
    throw new Error('No source video available to download');
  }

  const response = await fetch(resolved.value);
  if (!response.ok) {
    throw new Error(`Failed to download source video: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.promises.writeFile(destination, Buffer.from(arrayBuffer));
}

function buildFilterGraph({
  primaryColor = '#C53A5C',
  accentColor = '#EED7B8',
  hueRotate = 0,
  saturate = 1,
  brightness = 1,
  extras = {},
}) {
  const filters = buildThemeFilters({ hueRotate, saturate, brightness });
  const tintColor = withAlpha(primaryColor, 0.07);

  filters.push(`drawbox=x=0:y=0:w=iw:h=ih:color=${tintColor}:t=fill`);
  filters.push(...buildEffectFilters(extras, { primaryColor, accentColor }));

  return filters.join(',');
}

export async function renderBloomDelivery(purchaseId) {
  const { data: purchase, error: fetchError } = await supabase
    .from('purchases')
    .select('*, products(*)')
    .eq('id', purchaseId)
    .single();

  if (fetchError || !purchase) {
    throw new Error('Purchase not found');
  }

  const customization = purchase.composition_manifest?.customization || {};
  const message = customization.message || {};
  const recipientName = message.toName || '';
  const senderName = message.fromName || '';
  const shortMessage = normalizeMessage(message.short || '');
  const engravingStyle = customization.engravingStyle || purchase.composition_manifest?.composition?.engravingStyle || 'heirloom';
  const fontChoice = customization.fontChoice || purchase.composition_manifest?.composition?.fontChoice || 'playfair';
  const locale = customization.locale || purchase.composition_manifest?.composition?.locale || 'en';
  const colorTheme = customization.colorTheme || purchase.composition_manifest?.composition?.colorTheme || 'original';
  const primaryColor = customization.primaryColor || purchase.composition_manifest?.composition?.primaryColor || '#C53A5C';
  const accentColor = customization.accentColor || purchase.composition_manifest?.composition?.accentColor || '#EED7B8';
  const extras = customization.extras || purchase.composition_manifest?.composition?.extras || {};
  const themeTuning = THEME_TUNING[colorTheme] || THEME_TUNING.original;
  const hueRotate = purchase.composition_manifest?.composition?.hueRotate ?? customization.hueRotate ?? themeTuning.hueRotate;
  const saturate = purchase.composition_manifest?.composition?.saturate ?? customization.saturate ?? themeTuning.saturate;
  const brightness = purchase.composition_manifest?.composition?.brightness ?? customization.brightness ?? themeTuning.brightness;
  const sourceVideoUrl = purchase.products?.video_file_url || purchase.products?.video_url;

  if (!sourceVideoUrl) {
    throw new Error('No source video available for this purchase');
  }

  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'digital-bloom-'));

  try {
    const inputPath = path.join(tmpDir, 'input.mp4');
    const overlayPath = path.join(tmpDir, 'overlay.png');
    const outputFile = `${sanitizeFilePart(purchase.id, 'purchase')}-${sanitizeFilePart(recipientName || purchase.products?.name, 'delivery')}.mp4`;
    const outputPath = path.join(tmpDir, outputFile);

    await downloadFile(sourceVideoUrl, inputPath);
    const { width, height } = await getVideoMetadata(inputPath);
    await createOverlayImage(overlayPath, {
      width,
      height,
      recipientName,
      senderName,
      shortMessage,
      engravingStyle,
      fontChoice,
      locale,
      primaryColor,
      accentColor,
    });
    const filterGraph = buildFilterGraph({
      primaryColor,
      accentColor,
      hueRotate,
      saturate,
      brightness,
      extras,
    });

    await execFileAsync('ffmpeg', [
      '-y',
      '-i', inputPath,
      '-i', overlayPath,
      '-filter_complex', `[0:v]${filterGraph ? `${filterGraph},` : ''}format=yuv420p[base];[1:v]format=rgba[overlay];[base][overlay]overlay=0:0[outv]`,
      '-map', '[outv]',
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '20',
      '-map', '0:a?',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      outputPath,
    ]);

    const fileBuffer = await fs.promises.readFile(outputPath);
    const storagePath = `deliveries/${purchase.id}/${outputFile}`;

    const { error: uploadError } = await supabase.storage
      .from(DELIVERY_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    const { error: updateError } = await supabase
      .from('purchases')
      .update({
        status: 'completed',
        download_url: storagePath,
        download_storage_path: storagePath,
        download_expires_at: expiryDate.toISOString(),
        download_count: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', purchase.id);

    if (updateError) {
      throw updateError;
    }

    return {
      purchaseId: purchase.id,
      downloadUrl: storagePath,
    };
  } finally {
    await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
