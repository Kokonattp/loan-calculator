// LINE Login Utility
// ⚠️ ต้องตั้งค่าที่ LINE Developers Console
// 1. ไปที่ https://developers.line.biz/console/
// 2. สร้าง Provider และ LINE Login Channel
// 3. ได้ Channel ID และ Channel Secret
// 4. ตั้งค่า Callback URL เป็น https://your-domain.com/api/auth/line/callback

const LINE_CHANNEL_ID = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || 'YOUR_LINE_CHANNEL_ID';
const REDIRECT_URI = typeof window !== 'undefined' 
  ? `${window.location.origin}/api/auth/line/callback`
  : '';

// Generate random state for security
const generateState = () => {
  const array = new Uint8Array(16);
  if (typeof window !== 'undefined') {
    window.crypto.getRandomValues(array);
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const signInWithLine = () => {
  if (typeof window === 'undefined') return;
  
  const state = generateState();
  sessionStorage.setItem('line_auth_state', state);
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: LINE_CHANNEL_ID,
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: 'profile openid email',
  });
  
  window.location.href = `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`;
};

// LIFF SDK Alternative (simpler for client-side)
let liff = null;

export const initLiff = async (liffId) => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Dynamic import LIFF SDK
    const liffModule = await import('@line/liff');
    liff = liffModule.default;
    await liff.init({ liffId });
    return true;
  } catch (error) {
    console.error('LIFF init error:', error);
    return false;
  }
};

export const liffLogin = async () => {
  if (!liff) return { user: null, error: 'LIFF not initialized' };
  
  try {
    if (!liff.isLoggedIn()) {
      liff.login();
      return { user: null, error: null }; // Will redirect
    }
    
    const profile = await liff.getProfile();
    return {
      user: {
        uid: profile.userId,
        displayName: profile.displayName,
        photoURL: profile.pictureUrl,
        provider: 'line',
      },
      error: null,
    };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

export const liffLogout = () => {
  if (liff && liff.isLoggedIn()) {
    liff.logout();
  }
};

export const isLiffLoggedIn = () => {
  return liff ? liff.isLoggedIn() : false;
};
