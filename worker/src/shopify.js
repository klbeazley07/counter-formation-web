export function validateEmail(email) {
  return typeof email === 'string' && /.+@.+\..+/.test(email);
}

export async function verifyShopifyHmac(rawBody, secret, headerHmac) {
  if (!headerHmac) return false;
  const encoder = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await globalThis.crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(rawBody)
  );
  const computed = btoa(String.fromCharCode(...new Uint8Array(signature)));

  // Constant-time comparison to prevent timing attacks
  const a = encoder.encode(computed);
  const b = encoder.encode(headerHmac);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
