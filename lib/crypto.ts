const ENCRYPT_KEY = process.env.NEXT_PUBLIC_ENCRYPT_KEY ?? ''

async function deriveKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = encoder.encode(ENCRYPT_KEY)
  const hash = await crypto.subtle.digest('SHA-256', keyMaterial)

  return crypto.subtle.importKey('raw', hash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt'])
}

export async function encrypt(data: string): Promise<string> {
  const key = await deriveKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encoder = new TextEncoder()
  const encoded = encoder.encode(data)

  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded)

  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(ciphertext), iv.length)

  return btoa(String.fromCharCode(...combined))
}

export async function decrypt(encrypted: string): Promise<string> {
  const key = await deriveKey()
  const combined = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))

  const iv = combined.slice(0, 12)
  const ciphertext = combined.slice(12)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext)

  return new TextDecoder().decode(decrypted)
}
