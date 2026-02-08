/**
 * Experience Credit Code Generator
 * Generates secure, human-friendly credit codes in format: DBLOOM-XXXX-XXXX
 */

/**
 * Generate a random credit code segment
 * Uses crypto.getRandomValues for secure randomness
 * Excludes ambiguous characters (O, 0, I, 1)
 */
function generateSegment(length = 4) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes O, 0, I, 1
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);
  
  return Array.from(randomBytes)
    .map(byte => chars[byte % chars.length])
    .join('');
}

/**
 * Generate a complete credit code
 * Format: DBLOOM-XXXX-XXXX
 */
export function generateCreditCode() {
  const segment1 = generateSegment(4);
  const segment2 = generateSegment(4);
  return `DBLOOM-${segment1}-${segment2}`;
}

/**
 * Validate credit code format
 * Returns true if code matches expected format
 */
export function isValidCreditCodeFormat(code) {
  const pattern = /^DBLOOM-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
  return pattern.test(code);
}

/**
 * Format credit amount in cents to display string
 * Example: 2999 -> "$29.99"
 */
export function formatCreditAmount(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Parse credit amount from dollars to cents
 * Example: 29.99 -> 2999
 */
export function parseCreditAmount(dollars) {
  return Math.round(dollars * 100);
}
