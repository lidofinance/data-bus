import crypto from 'crypto';

// Configuration constants
const keyLength = 32;                // Key length for AES-256
const ivLength = 16;                 // IV length for AES-256-CBC
const saltLength = 16;               // Salt length
const digest = 'sha512';
const iterations = 100000;

// Function to derive key and iv from password and salt using PBKDF2
function deriveKey(password: string, salt: Buffer): { key: Buffer; iv: Buffer } {
  const derived = crypto.pbkdf2Sync(password, salt, iterations, keyLength + ivLength, digest);
  const key = derived.slice(0, keyLength);
  const iv = derived.slice(keyLength);
  return { key, iv };
}

// Function to encrypt text
export function encryptStore(text: string, password: string): string {
  const salt = crypto.randomBytes(saltLength);
  const { key, iv } = deriveKey(password, salt);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Prepend the salt to the encrypted data to use it during decryption
  return salt.toString('hex') + encrypted;
}

// Function to decrypt text
export function decryptStore(encryptedTextWithSalt: string, password: string): string {
  // Extract the salt and the encrypted data
  const salt = Buffer.from(encryptedTextWithSalt.slice(0, saltLength * 2), 'hex');
  const encryptedText = encryptedTextWithSalt.slice(saltLength * 2);
  const { key, iv } = deriveKey(password, salt);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
