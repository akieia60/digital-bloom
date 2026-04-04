export function getApiBase() {
  const configuredBase = (import.meta.env.VITE_API_URL || '').trim();

  if (typeof window === 'undefined') {
    return configuredBase;
  }

  if (!configuredBase) {
    return '';
  }

  try {
    const configuredUrl = new URL(configuredBase, window.location.origin);
    const currentUrl = new URL(window.location.origin);

    const currentIsEphemeral =
      currentUrl.hostname.includes('vercel.app') ||
      currentUrl.hostname === 'localhost' ||
      currentUrl.hostname === '127.0.0.1';

    const configuredIsCustomDomain =
      !configuredUrl.hostname.includes('vercel.app') &&
      configuredUrl.hostname !== 'localhost' &&
      configuredUrl.hostname !== '127.0.0.1';

    if (currentIsEphemeral && configuredIsCustomDomain && configuredUrl.origin !== currentUrl.origin) {
      return '';
    }

    return configuredUrl.origin === currentUrl.origin ? '' : configuredUrl.origin;
  } catch (error) {
    console.warn('Invalid VITE_API_URL, falling back to same-origin API:', error);
    return '';
  }
}
