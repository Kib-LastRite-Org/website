#!/usr/bin/env node
/**
 * One-time PBKDF2-SHA256 hash generator for the /create page passphrase.
 *
 * Usage:
 *   node scripts/gen-passphrase-hash.mjs [passphrase]
 *
 * Copy the output into your .env file:
 *   PUBLIC_CREATE_HASH=<hash>
 *   PUBLIC_CREATE_SALT=<salt>
 */

import { webcrypto } from 'node:crypto';

const passphrase = process.argv[2];
if (!passphrase) {
  console.error('Usage: node scripts/gen-passphrase-hash.mjs <passphrase>');
  process.exit(1);
}

const salt = webcrypto.getRandomValues(new Uint8Array(32));
const saltHex = Buffer.from(salt).toString('hex');

const keyMaterial = await webcrypto.subtle.importKey(
  'raw',
  new TextEncoder().encode(passphrase),
  'PBKDF2',
  false,
  ['deriveBits'],
);

const derived = await webcrypto.subtle.deriveBits(
  { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 310_000 },
  keyMaterial,
  256,
);

const hashHex = Buffer.from(derived).toString('hex');

console.log('\nAdd to your .env:\n');
console.log(`PUBLIC_CREATE_HASH=${hashHex}`);
console.log(`PUBLIC_CREATE_SALT=${saltHex}`);
console.log('\nKeep these secret — do not commit .env to version control.\n');
