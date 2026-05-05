import { createClient } from '@supabase/supabase-js';
import { applyCors } from '../_lib/cors.js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const BUFFER_API_KEY = process.env.BUFFER_API_KEY || '';
const BUFFER_ORGANIZATION_ID = process.env.BUFFER_ORGANIZATION_ID || '';
const BUFFER_CHANNEL_IDS = (process.env.BUFFER_CHANNEL_IDS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function authOk(token) {
  return Boolean(ADMIN_TOKEN) && token === ADMIN_TOKEN;
}

function gqlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function marketingCaption(name) {
  const lower = String(name || '').toLowerCase();
  if (lower.includes('mothers-day') || lower.includes('mothers')) {
    return "Mother's Day is May 10. Send her flowers that bloom on her screen the moment she opens your message. Shine your love in the world. digitalbloom.store\n\n#MothersDay #MothersDayGift #DigitalBloom #ShineYourLove #DigitalFlowers";
  }
  if (lower.includes('birthday') || lower.includes('g-day') || lower.includes('gday')) {
    return "Make their birthday feel seen. Send a Digital Bloom that opens like a gift and blooms right on their phone. digitalbloom.store\n\n#BirthdayGift #DigitalBloom #ShineYourLove #DigitalFlowers #GiftIdeas";
  }
  if (lower.includes('graduation')) {
    return "Celebrate the work, the walk, and the next chapter. Send a Digital Bloom that opens like a gift on their phone. digitalbloom.store\n\n#Graduation2026 #GraduationGift #DigitalBloom #ShineYourLove";
  }
  if (lower.includes('worker') || lower.includes('appreciation')) {
    return "Some people deserve to be seen for everything they carry. Send appreciation that blooms on their phone. digitalbloom.store\n\n#WorkerAppreciation #ThankYouGift #DigitalBloom #ShineYourLove";
  }
  if (lower.includes('love') || lower.includes('valentine')) {
    return "Love does not need to wait for a holiday. Send flowers that bloom on their screen today. digitalbloom.store\n\n#DigitalBloom #ShineYourLove #LoveGift #DigitalFlowers";
  }
  if (lower.includes('reach-out')) {
    return "Reach out while it still matters. Send a Digital Bloom and let somebody feel loved today. digitalbloom.store\n\n#DigitalBloom #ShineYourLove #GiveThemTheirFlowers #DigitalFlowers";
  }
  if (lower.includes('flowers-in-hand')) {
    return "Put the flowers in their hands while they are here to feel them. Send a Digital Bloom today. digitalbloom.store\n\n#DigitalBloom #GiveThemTheirFlowers #ShineYourLove #DigitalFlowers";
  }
  if (lower.includes('support')) {
    return "A little love and support can change the whole day. Send a Digital Bloom that opens on their phone. digitalbloom.store\n\n#DigitalBloom #ShineYourLove #ThinkingOfYou #DigitalFlowers";
  }
  return "Send flowers that bloom on their phone screen. Personal. Cinematic. Ready when your heart is. digitalbloom.store\n\n#DigitalBloom #ShineYourLove #DigitalFlowers";
}

async function bufferRequest(query) {
  const response = await fetch('https://api.buffer.com', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${BUFFER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.errors?.length) {
    const msg = json.errors?.[0]?.message || json.error || `Buffer API ${response.status}`;
    throw new Error(msg);
  }
  return json.data;
}

async function getBufferChannels() {
  if (BUFFER_CHANNEL_IDS.length) {
    return BUFFER_CHANNEL_IDS.map((id) => ({ id, displayName: id, service: 'configured' }));
  }

  const orgData = await bufferRequest(`query GetOrganizations {
    account { organizations { id name ownerEmail } }
  }`);
  const orgs = orgData?.account?.organizations || [];
  const orgId = BUFFER_ORGANIZATION_ID || orgs[0]?.id;
  if (!orgId) throw new Error('No Buffer organization found. Set BUFFER_ORGANIZATION_ID.');

  const channelData = await bufferRequest(`query GetChannels {
    channels(input: { organizationId: ${gqlString(orgId)} }) {
      id
      name
      displayName
      service
      isQueuePaused
    }
  }`);
  return (channelData?.channels || []).filter((c) => !c.isQueuePaused);
}

async function createBufferVideoPost({ channelId, text, videoUrl }) {
  const data = await bufferRequest(`mutation CreatePost {
    createPost(input: {
      text: ${gqlString(text)}
      channelId: ${gqlString(channelId)}
      schedulingType: automatic
      mode: addToQueue
      assets: {
        videos: [{ url: ${gqlString(videoUrl)} }]
      }
    }) {
      ... on PostActionSuccess {
        post { id text dueAt channelId assets { source } }
      }
      ... on MutationError { message }
    }
  }`);
  const result = data?.createPost;
  if (result?.message) throw new Error(result.message);
  if (!result?.post?.id) throw new Error('Buffer did not return a post id.');
  return result.post;
}

async function getApprovedMarketingItems(supabase) {
  const { data, error } = await supabase
    .from('product_feedback')
    .select('id,target_ref,target_label,target_video_url,body,created_at,status')
    .eq('target_kind', 'marketing')
    .eq('status', 'open')
    .order('created_at', { ascending: true })
    .limit(500);
  if (error) throw new Error(error.message);

  const queued = new Set();
  const approvals = [];
  for (const item of data || []) {
    const body = String(item.body || '');
    if (body.startsWith('[BUFFER_QUEUED]')) queued.add(item.target_ref);
    if (body.startsWith('[BUFFER_APPROVED]')) approvals.push(item);
  }
  return approvals.filter((item) => !queued.has(item.target_ref));
}

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;

  const token = (req.query?.token || req.body?.token || '').toString();
  if (!authOk(token)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'GET') {
    return res.status(200).json({
      configured: Boolean(BUFFER_API_KEY),
      hasOrganizationId: Boolean(BUFFER_ORGANIZATION_ID),
      configuredChannelCount: BUFFER_CHANNEL_IDS.length,
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!BUFFER_API_KEY) {
    return res.status(400).json({
      error: 'BUFFER_API_KEY is not configured. Generate a Buffer API key at https://publish.buffer.com/settings/api and add it to Vercel/local env.',
    });
  }

  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const { action = 'queue-approved', dryRun = false } = req.body || {};
  if (action !== 'queue-approved') return res.status(400).json({ error: 'Unsupported action.' });

  try {
    const [items, channels] = await Promise.all([
      getApprovedMarketingItems(supabase),
      getBufferChannels(),
    ]);

    if (!channels.length) throw new Error('No active Buffer channels found.');
    if (!items.length) return res.status(200).json({ queued: [], skipped: 'No approved unqueued marketing posts found.' });

    if (dryRun) {
      return res.status(200).json({ dryRun: true, items, channels });
    }

    const queued = [];
    const failed = [];
    for (const item of items) {
      const text = marketingCaption(item.target_ref);
      for (const channel of channels) {
        try {
          const post = await createBufferVideoPost({
            channelId: channel.id,
            text,
            videoUrl: item.target_video_url,
          });
          queued.push({ target_ref: item.target_ref, channelId: channel.id, channel: channel.displayName || channel.name, postId: post.id, dueAt: post.dueAt });
        } catch (error) {
          failed.push({ target_ref: item.target_ref, channelId: channel.id, channel: channel.displayName || channel.name, error: error.message });
        }
      }
      if (!failed.some((f) => f.target_ref === item.target_ref)) {
        await supabase.from('product_feedback').insert({
          target_kind: 'marketing',
          target_ref: item.target_ref,
          target_label: item.target_label,
          target_video_url: item.target_video_url,
          author: 'ak',
          body: `[BUFFER_QUEUED] Queued to ${channels.length} Buffer channel(s).`,
          status: 'open',
        });
      }
    }

    return res.status(200).json({ queued, failed, channelCount: channels.length, itemCount: items.length });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

