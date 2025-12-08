// WebAuthn (Biometric Authentication) Utility
// รองรับ Face ID, Fingerprint, Windows Hello

// Check if WebAuthn is supported
export const isWebAuthnSupported = () => {
  return typeof window !== 'undefined' && 
         window.PublicKeyCredential !== undefined &&
         typeof window.PublicKeyCredential === 'function';
};

// Check if platform authenticator (Face ID, Fingerprint) is available
export const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported()) return false;
  
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
};

// Generate random challenge
const generateChallenge = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return array;
};

// Convert ArrayBuffer to Base64
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => binary += String.fromCharCode(byte));
  return btoa(binary);
};

// Convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Register biometric credential
export const registerBiometric = async (userId, userName) => {
  if (!isWebAuthnSupported()) {
    return { credential: null, error: 'WebAuthn not supported' };
  }

  try {
    const challenge = generateChallenge();
    
    const publicKeyCredentialCreationOptions = {
      challenge,
      rp: {
        name: "Loan Calculator Pro",
        id: window.location.hostname,
      },
      user: {
        id: new TextEncoder().encode(userId),
        name: userName || userId,
        displayName: userName || 'User',
      },
      pubKeyCredParams: [
        { alg: -7, type: "public-key" },   // ES256
        { alg: -257, type: "public-key" }, // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: "platform", // Use device's built-in authenticator
        userVerification: "required",
        residentKey: "preferred",
      },
      timeout: 60000,
      attestation: "none",
    };

    const credential = await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    });

    // Store credential ID in localStorage
    const credentialId = arrayBufferToBase64(credential.rawId);
    const storedCredentials = JSON.parse(localStorage.getItem('biometric_credentials') || '{}');
    storedCredentials[userId] = {
      credentialId,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('biometric_credentials', JSON.stringify(storedCredentials));

    return { 
      credential: { id: credentialId },
      error: null,
    };
  } catch (error) {
    console.error('Register biometric error:', error);
    return { 
      credential: null, 
      error: error.name === 'NotAllowedError' 
        ? 'ผู้ใช้ยกเลิกการลงทะเบียน' 
        : error.message,
    };
  }
};

// Authenticate with biometric
export const authenticateWithBiometric = async (userId) => {
  if (!isWebAuthnSupported()) {
    return { success: false, error: 'WebAuthn not supported' };
  }

  try {
    // Get stored credential
    const storedCredentials = JSON.parse(localStorage.getItem('biometric_credentials') || '{}');
    const userCredential = storedCredentials[userId];
    
    if (!userCredential) {
      return { success: false, error: 'ไม่พบข้อมูล Biometric กรุณาลงทะเบียนก่อน' };
    }

    const challenge = generateChallenge();
    
    const publicKeyCredentialRequestOptions = {
      challenge,
      allowCredentials: [{
        id: base64ToArrayBuffer(userCredential.credentialId),
        type: 'public-key',
        transports: ['internal'],
      }],
      userVerification: "required",
      timeout: 60000,
    };

    const assertion = await navigator.credentials.get({
      publicKey: publicKeyCredentialRequestOptions,
    });

    if (assertion) {
      return { success: true, error: null };
    }
    
    return { success: false, error: 'การยืนยันล้มเหลว' };
  } catch (error) {
    console.error('Biometric auth error:', error);
    return { 
      success: false, 
      error: error.name === 'NotAllowedError' 
        ? 'ผู้ใช้ยกเลิกการยืนยัน' 
        : error.message,
    };
  }
};

// Check if user has registered biometric
export const hasBiometricRegistered = (userId) => {
  if (typeof window === 'undefined') return false;
  const storedCredentials = JSON.parse(localStorage.getItem('biometric_credentials') || '{}');
  return !!storedCredentials[userId];
};

// Remove biometric credential
export const removeBiometric = (userId) => {
  const storedCredentials = JSON.parse(localStorage.getItem('biometric_credentials') || '{}');
  delete storedCredentials[userId];
  localStorage.setItem('biometric_credentials', JSON.stringify(storedCredentials));
};
