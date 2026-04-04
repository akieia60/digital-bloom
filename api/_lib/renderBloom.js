import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';

const execFileAsync = promisify(execFile);

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

function sanitizeFilePart(value, fallback = 'bloom') {
  return String(value || fallback)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || fallback;
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

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download source video: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.promises.writeFile(destination, Buffer.from(arrayBuffer));
}

function buildFilterGraph({ recipientName, senderName, shortMessage, engravingStyle = 'heirloom', fontChoice = 'playfair', locale = 'en' }) {
  const preset = RENDER_PRESETS[engravingStyle] || RENDER_PRESETS.heirloom;
  const font = FONT_PRESETS[fontChoice] || FONT_PRESETS.playfair;
  const labels = LOCALE_LABELS[locale] || LOCALE_LABELS.en;
  const filters = [];

  filters.push(`drawbox=x=w*0.035:y=h*0.865:w=w*0.93:h=h*0.09:color=${preset.railColor}:t=fill`);
  filters.push(`drawbox=x=w*0.055:y=h*0.865:w=w*0.89:h=h*0.0025:color=${preset.accentColor}:t=fill`);

  if (recipientName) {
    filters.push(
      buildDrawText(`${labels.to} ${recipientName}`, {
        fontcolor: preset.dedicationColor,
        fontsize: font.recipientSize,
        x: 'w*0.06',
        y: 'h*0.10',
        boxcolor: 'black@0.16',
        boxborderw: 16,
        font: font.renderFont,
      })
    );
  }

  if (shortMessage) {
    filters.push(`drawbox=x=w*0.055:y=h*0.73:w=w*0.42:h=h*0.10:color=${preset.messageBox}:t=fill`);
    filters.push(
      buildDrawText(shortMessage, {
        fontcolor: preset.messageColor,
        fontsize: engravingStyle === 'signature' ? 'h*0.027' : font.messageSize,
        x: 'w*0.075',
        y: 'h*0.765',
        font: font.renderFont,
      })
    );
  }

  if (senderName) {
    filters.push(
      buildDrawText(`${labels.from} ${senderName}`, {
        fontcolor: preset.signatureColor,
        fontsize: font.senderSize,
        x: 'w-tw-w*0.06',
        y: 'h*0.81',
        boxcolor: 'black@0.14',
        boxborderw: 12,
        font: font.renderFont,
      })
    );
  }

  filters.push(
    buildDrawText('Digital Bloom™', {
      fontcolor: preset.brandColor,
      fontsize: 'h*0.025',
      x: 'w*0.09',
      y: 'h*0.895',
      font: 'Serif',
    })
  );

  filters.push(
    buildDrawText('TM', {
      fontcolor: 'white@0.72',
      fontsize: 'h*0.018',
      x: 'w-tw-w*0.07',
      y: 'h*0.895',
      font: 'Sans',
    })
  );

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
  const sourceVideoUrl = purchase.products?.video_file_url || purchase.products?.video_url;

  if (!sourceVideoUrl) {
    throw new Error('No source video available for this purchase');
  }

  const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'digital-bloom-'));

  try {
    const inputPath = path.join(tmpDir, 'input.mp4');
    const outputFile = `${sanitizeFilePart(purchase.id, 'purchase')}-${sanitizeFilePart(recipientName || purchase.products?.name, 'delivery')}.mp4`;
    const outputPath = path.join(tmpDir, outputFile);

    await downloadFile(sourceVideoUrl, inputPath);
    const filterGraph = buildFilterGraph({ recipientName, senderName, shortMessage, engravingStyle, fontChoice, locale });

    await execFileAsync('ffmpeg', [
      '-y',
      '-i', inputPath,
      '-vf', filterGraph,
      '-c:v', 'libx264',
      '-preset', 'veryfast',
      '-crf', '20',
      '-c:a', 'copy',
      '-movflags', '+faststart',
      outputPath,
    ]);

    const fileBuffer = await fs.promises.readFile(outputPath);
    const storagePath = `deliveries/${purchase.id}/${outputFile}`;

    const { error: uploadError } = await supabase.storage
      .from('product-media')
      .upload(storagePath, fileBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicData } = supabase.storage
      .from('product-media')
      .getPublicUrl(storagePath);

    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 48);

    const { error: updateError } = await supabase
      .from('purchases')
      .update({
        download_url: publicData.publicUrl,
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
      downloadUrl: publicData.publicUrl,
    };
  } finally {
    await fs.promises.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
