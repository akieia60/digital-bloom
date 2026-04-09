const DEFAULT_DELIVERY_BUCKET = process.env.BLOOM_DELIVERY_BUCKET || 'bloom-deliveries';
const DEFAULT_SIGNED_URL_SECONDS = Number(
  process.env.BLOOM_DELIVERY_SIGNED_URL_SECONDS || 60 * 60
);

function isHttpUrl(value) {
  try {
    const url = new URL(String(value || '').trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeStoragePath(value) {
  const text = String(value || '').trim();
  if (!text || isHttpUrl(text)) return null;
  if (text.startsWith('private://')) {
    return text.replace(/^private:\/\//, '').replace(/^[^/]+\//, '');
  }
  return text.replace(/^\/+/, '');
}

export function getDeliveryStoragePath(purchase) {
  const explicitPath = normalizeStoragePath(purchase?.download_storage_path);
  if (explicitPath) return explicitPath;

  return normalizeStoragePath(purchase?.download_url);
}

export async function getSignedDeliveryUrl(supabase, purchase, options = {}) {
  const bucket = options.bucket || DEFAULT_DELIVERY_BUCKET;
  const expiresIn = Number(options.expiresIn || DEFAULT_SIGNED_URL_SECONDS);
  const storedUrl = String(purchase?.download_url || '').trim();
  const storagePath = getDeliveryStoragePath(purchase);

  if (!storedUrl) return null;
  if (isHttpUrl(storedUrl) && !storagePath) return storedUrl;
  if (!storagePath) return storedUrl;

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresIn);

  if (error) {
    throw error;
  }

  return data?.signedUrl || null;
}

