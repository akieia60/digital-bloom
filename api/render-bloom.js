import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { createClient } from '@supabase/supabase-js';
import { applyCors } from './_lib/cors.js';

const execFileAsync = promisify(execFile);

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    .replace(/%/g, '\\%');
}

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download source video: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  await fs.promises.writeFile(destination, Buffer.from(arrayBuffer));
}

function buildFilterGraph({ recipientName }) {
  const filters = [];

  if (recipientName) {
    filters.push(
      `drawtext=text='${escapeDrawtext(`For ${recipientName}`)}':fontcolor=white@0.28:fontsize=h*0.038:x=(w-text_w)/2:y=h*0.14:shadowcolor=black@0.75:shadowx=2:shadowy=2`
    );
  }

  filters.push(
    `drawtext=text='TM':fontcolor=white@0.55:fontsize=h*0.022:x=w*0.06:y=h*0.90:shadowcolor=black@0.7:shadowx=2:shadowy=2`
  );

  filters.push(
    `drawtext=text='${escapeDrawtext('Digital Bloom™')}':fontcolor=0xD4AF37@0.78:fontsize=h*0.024:x=w-tw-w*0.06:y=h*0.08:shadowcolor=black@0.7:shadowx=2:shadowy=2`
  );

  return filters.join(',');
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { purchaseId } = req.body || {};
    if (!purchaseId) {
      return res.status(400).json({ error: 'purchaseId is required' });
    }

    const { data: purchase, error: fetchError } = await supabase
      .from('purchases')
      .select('*, products(*)')
      .eq('id', purchaseId)
      .single();

    if (fetchError || !purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    const customization = purchase.composition_manifest?.customization || {};
    const message = customization.message || {};
    const recipientName = message.toName || '';
    const sourceVideoUrl = purchase.products?.video_file_url || purchase.products?.video_url;

    if (!sourceVideoUrl) {
      return res.status(400).json({ error: 'No source video available for this purchase' });
    }

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'digital-bloom-'));
    const inputPath = path.join(tmpDir, 'input.mp4');
    const outputFile = `${sanitizeFilePart(purchase.id, 'purchase')}-${sanitizeFilePart(recipientName || purchase.products?.name, 'delivery')}.mp4`;
    const outputPath = path.join(tmpDir, outputFile);

    await downloadFile(sourceVideoUrl, inputPath);

    const filterGraph = buildFilterGraph({ recipientName });

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
        updated_at: new Date().toISOString(),
      })
      .eq('id', purchase.id);

    if (updateError) {
      throw updateError;
    }

    await fs.promises.rm(tmpDir, { recursive: true, force: true });

    return res.status(200).json({
      ok: true,
      purchaseId: purchase.id,
      downloadUrl: publicData.publicUrl,
    });
  } catch (error) {
    console.error('render-bloom error:', error);
    return res.status(500).json({
      error: 'Failed to render personalized bloom',
      details: error.message,
    });
  }
}
