'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { onAuthChange, signInWithGoogle, signOutUser, saveLoanItems, getUserData } from '../lib/firebase';
import { isPlatformAuthenticatorAvailable, registerBiometric, authenticateWithBiometric, hasBiometricRegistered } from '../lib/biometric';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricRegistered, setBiometricRegistered] = useState(false);

  // Check biometric availability
  useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setBiometricAvailable);
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          provider: firebaseUser.providerData[0]?.providerId || 'unknown',
        };
        setUser(userData);
        setBiometricRegistered(hasBiometricRegistered(firebaseUser.uid));
      } else {
        setUser(null);
        setBiometricRegistered(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    setLoading(false);
    return result;
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    const result = await signOutUser();
    setUser(null);
    setLoading(false);
    return result;
  };

  // Register biometric
  const setupBiometric = async () => {
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อน' };
    
    const result = await registerBiometric(user.uid, user.displayName);
    if (!result.error) {
      setBiometricRegistered(true);
    }
    return result;
  };

  // Login with biometric
  const loginWithBiometric = async (userId) => {
    const result = await authenticateWithBiometric(userId);
    return result;
  };

  // Save loan data
  const saveLoanData = useCallback(async (items) => {
    if (!user) return { error: 'กรุณาเข้าสู่ระบบก่อน' };
    return await saveLoanItems(user.uid, items);
  }, [user]);

  // Load loan data
  const loadLoanData = useCallback(async () => {
    if (!user) return { data: null, error: 'กรุณาเข้าสู่ระบบก่อน' };
    const result = await getUserData(user.uid);
    return { data: result.data?.loanItems || null, error: result.error };
  }, [user]);

  const value = {
    user,
    loading,
    biometricAvailable,
    biometricRegistered,
    loginWithGoogle,
    logout,
    setupBiometric,
    loginWithBiometric,
    saveLoanData,
    loadLoanData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
