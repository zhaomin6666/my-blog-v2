export const ADMIN_SESSION_COOKIE = 'personal_dev_os_admin_session';

const SESSION_TTL_SECONDS = 60 * 60 * 8;

export interface AdminSessionPayload {
  username: string;
  issuedAt: number;
  expiresAt: number;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function base64UrlToBytes(value: string): Uint8Array {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function textToBytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function textToArrayBuffer(value: string): ArrayBuffer {
  const bytes = textToBytes(value);
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
}

function bytesToText(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    textToArrayBuffer(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await importHmacKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, textToArrayBuffer(payload));
  return bytesToBase64Url(new Uint8Array(signature));
}

export function createAdminSessionPayload(username: string): AdminSessionPayload {
  const issuedAt = Math.floor(Date.now() / 1000);

  return {
    username,
    issuedAt,
    expiresAt: issuedAt + SESSION_TTL_SECONDS,
  };
}

export async function createSignedSessionToken(
  payload: AdminSessionPayload,
  secret: string,
): Promise<string> {
  const encodedPayload = bytesToBase64Url(textToBytes(JSON.stringify(payload)));
  const signature = await signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
}

export async function verifySignedSessionToken(
  token: string | undefined,
  secret: string | undefined,
): Promise<AdminSessionPayload | null> {
  if (!token || !secret) return null;

  const [encodedPayload, signature, extra] = token.split('.');
  if (!encodedPayload || !signature || extra !== undefined) return null;

  const expectedSignature = await signPayload(encodedPayload, secret);
  if (signature !== expectedSignature) return null;

  try {
    const payload = JSON.parse(bytesToText(base64UrlToBytes(encodedPayload))) as AdminSessionPayload;
    const now = Math.floor(Date.now() / 1000);

    if (!payload.username || typeof payload.expiresAt !== 'number') return null;
    if (payload.expiresAt <= now) return null;

    return payload;
  } catch {
    return null;
  }
}

export function getAdminSessionMaxAgeSeconds(): number {
  return SESSION_TTL_SECONDS;
}
