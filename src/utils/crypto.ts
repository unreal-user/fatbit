import * as SecureStore from 'expo-secure-store';
import {
  AESEncryptionKey,
  AESSealedData,
  AESKeySize,
  aesEncryptAsync,
  aesDecryptAsync,
} from 'expo-crypto';

const DB_KEY_ALIAS = 'fatbit_db_encryption_key';

let cachedKey: AESEncryptionKey | null = null;

function stringToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToString(base64: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Returns the AES-256-GCM encryption key, generating and persisting one on first call.
 * The raw key material is stored in Android Keystore via expo-secure-store.
 */
export async function getEncryptionKey(): Promise<AESEncryptionKey> {
  if (cachedKey) return cachedKey;

  const stored = await SecureStore.getItemAsync(DB_KEY_ALIAS);
  if (stored) {
    cachedKey = await AESEncryptionKey.import(stored, 'base64');
    return cachedKey;
  }

  const key = await AESEncryptionKey.generate(AESKeySize.AES256);
  const exported = await key.encoded('base64');
  await SecureStore.setItemAsync(DB_KEY_ALIAS, exported);
  cachedKey = key;
  return key;
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Returns a combined base64 string (iv + ciphertext + tag) for compact storage.
 */
export async function encryptField(plaintext: string): Promise<string> {
  const key = await getEncryptionKey();
  const sealed = await aesEncryptAsync(stringToBase64(plaintext), key);
  return await sealed.combined('base64');
}

/**
 * Decrypts a combined base64 string produced by encryptField back to plaintext.
 */
export async function decryptField(encrypted: string): Promise<string> {
  const key = await getEncryptionKey();
  const sealed = AESSealedData.fromCombined(encrypted);
  const base64Result = await aesDecryptAsync(sealed, key, { output: 'base64' });
  return base64ToString(base64Result);
}

/**
 * Encrypts a value if non-null, returns null otherwise.
 */
export async function encryptOptional(value: string | null | undefined): Promise<string | null> {
  if (value == null) return null;
  return encryptField(value);
}

/**
 * Decrypts a value if non-null, returns null otherwise.
 */
export async function decryptOptional(value: string | null | undefined): Promise<string | null> {
  if (value == null) return null;
  return decryptField(value);
}
