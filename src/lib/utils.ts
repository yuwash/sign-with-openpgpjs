import * as openpgp from 'openpgp';
import type { KeyPair } from './pgp';
import { createKeyPairFromKeyObjs } from './pgp';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function processKeys(input: string | Uint8Array): Promise<KeyPair> {
  const readKeysParams = (typeof input === 'string') ? { armoredKeys: input } : { binaryKeys: input };
  const keys = await openpgp.readKeys(readKeysParams)
  const privateKeys = keys.filter(key => key.isPrivate());
  const publicKeys = privateKeys.length > 0 ? privateKeys.map(key => key.toPublic()) : keys;

  if (publicKeys.length > 0) {
    return await createKeyPairFromKeyObjs(publicKeys[0], privateKeys[0]);
  } else {
    throw new Error('No valid keys found');
  }
}

async function exportKey(key: openpgp.Key, armorType: openpgp.enums.armor, armor: boolean = true): Promise<string> {
  const keyData = await key.write();
  return armor ? await openpgp.armor(armorType, keyData) : keyData;
}

export async function downloadKey(
  key: openpgp.Key,
  armor: boolean = true
) {
  const userId = key.getUserIDs()[0] || 'Anonymous';
  const keyId = key.getKeyID().toHex();
  let content = await exportKey(key, key.isPrivate() ? openpgp.enums.armor.privateKey : openpgp.enums.armor.publicKey, armor);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slugify(userId)}-${keyId}${key.isPrivate() ? '.sec' : ''}.asc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
