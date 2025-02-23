import * as openpgp from 'openpgp';

type KeyType = 'ecc' | 'rsa';

export interface KeyPair {
  privateKey?: string;
  publicKey: string;
  revocationCertificate?: string;
  publicKeyObj: openpgp.Key;
  privateKeyObj?: openpgp.PrivateKey;
}

interface GenerateKeyOptions {
  name: string;
  email?: string;
  type: KeyType;
}

export async function generateKeyPair({ name, email, type }: GenerateKeyOptions): Promise<KeyPair> {
  const userIDs = [];
  if (name || email) {
    userIDs.push({ name, email });
  }

  const options: any = {
    type: type === 'ecc' ? 'ecc' : 'rsa',
    format: 'armored',
    userIDs
  };

  if (type === 'ecc') {
    options.curve = 'curve25519';
  } else {
    options.rsaBits = 4096;
  }

  const { privateKey, publicKey, revocationCertificate } = await openpgp.generateKey(options);
  
  const publicKeyObj = await openpgp.readKey({ armoredKey: publicKey });
  const privateKeyObj = await openpgp.readPrivateKey({ armoredKey: privateKey });

  return { 
    privateKey, 
    publicKey, 
    revocationCertificate,
    publicKeyObj,
    privateKeyObj
  };
}

export async function createKeyPairFromKeyObjs(publicKeyObj: openpgp.Key, privateKeyObj?: openpgp.PrivateKey): Promise<KeyPair> {
  const publicKey = await publicKeyObj.armor();
  const privateKey = privateKeyObj ? await privateKeyObj.armor() : undefined;

  return {
    publicKey,
    privateKey,
    publicKeyObj,
    privateKeyObj
  };
}

export async function signMessage(message: string, privateKeyArmored: string) {
  const privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });
  const messageObj = await openpgp.createCleartextMessage({ text: message });
  
  const signed = await openpgp.sign({
    message: messageObj,
    signingKeys: privateKey,
    format: 'armored'
  });

  return signed;
}

export async function verifyMessage(signedMessage: string, publicKeyArmored: string) {
  try {
    const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
    const cleartextMessage = await openpgp.readCleartextMessage({
      cleartextMessage: signedMessage
    });
    
    const verificationResult = await openpgp.verify({
      message: cleartextMessage,
      verificationKeys: publicKey
    });

    const { verified } = verificationResult.signatures[0];
    await verified;
    return true;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}