'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function UserMenu({ onLoginClick }) {
  const { user, logout, biometricAvailable, biometricRegistered, setupBiometric, loading } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [settingUpBiometric, setSettingUpBiometric] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    await logout();
    setShowMenu(false);
  };

  const handleSetupBiometric = async () => {
    setSettingUpBiometric(true);
    setMessage('');
    const result = await setupBiometric();
    if (result.error) {
      setMessage(`❌ ${result.error}`);
    } else {
      setMessage('✅ ลงทะเบียน Face ID / Fingerprint สำเร็จ!');
    }
    setSettingUpBiometric(false);
  };

  if (!user) {
    return (
      <button
        onClick={onLoginClick}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span className="text-sm font-medium">เข้าสู่ระบบ</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
      >
        {user.photoURL ? (
          <img 
            src={user.photoURL} 
            alt={user.displayName} 
            className="w-8 h-8 rounded-full border-2 border-white/30"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white font-bold">
            {user.displayName?.[0] || user.email?.[0] || '?'}
          </div>
        )}
        <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate">
          {user.displayName || user.email}
        </span>
        <svg className={`w-4 h-4 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
            {/* User Info */}
            <div className="p-4 bg-gradient-to-r from-navy to-teal text-white">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName} 
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                    {user.displayName?.[0] || user.email?.[0] || '?'}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{user.displayName || 'User'}</p>
                  <p className="text-xs text-white/70 truncate">{user.email}</p>
                </div>
              </div>
              {/* Provider Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-white/20 rounded text-xs">
                  {user.provider === 'google.com' ? '🔵 Google' : 
                   user.provider === 'line' ? '🟢 LINE' : '🔐 Biometric'}
                </span>
                {biometricRegistered && (
                  <span className="px-2 py-0.5 bg-mint/30 rounded text-xs">👆 Biometric</span>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {/* Biometric Setup */}
              {biometricAvailable && !biometricRegistered && (
                <button
                  onClick={handleSetupBiometric}
                  disabled={settingUpBiometric}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left disabled:opacity-50"
                >
                  <span className="text-xl">👆</span>
                  <div>
                    <p className="font-medium text-navy text-sm">ตั้งค่า Face ID / Fingerprint</p>
                    <p className="text-xs text-gray-500">เข้าสู่ระบบเร็วขึ้น</p>
                  </div>
                </button>
              )}

              {biometricRegistered && (
                <div className="flex items-center gap-3 p-3 bg-mint/10 rounded-xl">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-medium text-navy text-sm">Face ID / Fingerprint พร้อมใช้</p>
                    <p className="text-xs text-gray-500">คุณสามารถล็อกอินด้วย Biometric ได้</p>
                  </div>
                </div>
              )}

              {/* Message */}
              {message && (
                <div className="p-3 text-sm text-center">
                  {message}
                </div>
              )}

              <hr className="my-2 border-gray-100" />

              {/* Sync Info */}
              <div className="flex items-center gap-3 p-3 text-gray-500">
                <span className="text-lg">☁️</span>
                <p className="text-xs">ข้อมูลจะบันทึกอัตโนมัติไปยัง Cloud</p>
              </div>

              <hr className="my-2 border-gray-100" />

              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red/5 transition-colors text-left group"
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium text-red group-hover:text-red">ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
