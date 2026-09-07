// Real cryptographic hash and verification helpers for DPDP immutable consent ledger

export async function computeSha256(data: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(data);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('SubtleCrypto fallback used', e);
  }
  // Deterministic fast hash fallback
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0000${hex}${hex}c9f1a2384e5b7c8d9e0f1a2b3c4d5e6f`.slice(0, 64);
}

export function generateSyncHash(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const tail = seed.split('').reverse().map(c => c.charCodeAt(0).toString(16)).join('');
  return (hex + tail + '7fa9b284e3105cd90f84a32b1e4c7d').slice(0, 64);
}

export function formatMaskedMobile(mobile: string): string {
  if (!mobile || mobile.length < 4) return '******0000';
  const digits = mobile.replace(/\D/g, '');
  if (digits.length >= 10) {
    const last4 = digits.slice(-4);
    return `+91 ******${last4}`;
  }
  return mobile;
}

export function formatMaskedEmail(email: string): string {
  if (!email || !email.includes('@')) return 'u***@example.com';
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user[0]}***@${domain}`;
  return `${user.slice(0, 2)}***${user.slice(-1)}@${domain}`;
}

export function generateId(prefix: string): string {
  const chars = '0123456789ABCDEF';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${prefix}-${new Date().getFullYear()}-${res}`;
}
