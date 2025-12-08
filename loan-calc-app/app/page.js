'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Board from '../components/Board';
import SummaryBar from '../components/SummaryBar';
import LoginModal from '../components/LoginModal';
import { useAuth } from '../contexts/AuthContext';

const boards = [
  {
    type: 'credit',
    title: 'บัตรเครดิต',
    icon: '💳',
    color: '#9333EA',
    bgColor: '#F5F0FF',
  },
  {
    type: 'home',
    title: 'สินเชื่อบ้าน',
    icon: '🏠',
    color: '#079FA0',
    bgColor: '#E6F7F7',
  },
  {
    type: 'car',
    title: 'สินเชื่อรถยนต์',
    icon: '🚗',
    color: '#2563EB',
    bgColor: '#EEF4FF',
  },
  {
    type: 'personal',
    title: 'สินเชื่อส่วนบุคคล',
    icon: '👤',
    color: '#F58B01',
    bgColor: '#FFF7E6',
  },
  {
    type: 'education',
    title: 'สินเชื่อการศึกษา',
    icon: '🎓',
    color: '#059669',
    bgColor: '#E6FAF2',
  },
  {
    type: 'other',
    title: 'อื่นๆ',
    icon: '📋',
    color: '#DC2E2F',
    bgColor: '#FFF0F0',
  },
];

export default function Home() {
  const [allItems, setAllItems] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null); // null, 'saving', 'saved', 'error'
  const { user, saveLoanData, loadLoanData, loading } = useAuth();
  const saveTimeoutRef = useRef(null);
  const hasLoadedRef = useRef(false);

  // Load data when user logs in
  useEffect(() => {
    if (user && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadLoanData().then(result => {
        if (result.data) {
          setAllItems(result.data);
        }
      });
    }
    if (!user) {
      hasLoadedRef.current = false;
    }
  }, [user, loadLoanData]);

  // Auto-save with debounce
  useEffect(() => {
    if (!user) return;
    
    // Clear previous timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Don't save if no items
    const hasItems = Object.values(allItems).some(item => item?.monthlyPayment > 0);
    if (!hasItems) return;

    // Set saving status
    setSyncStatus('saving');

    // Debounce save
    saveTimeoutRef.current = setTimeout(async () => {
      const result = await saveLoanData(allItems);
      if (result.error) {
        setSyncStatus('error');
      } else {
        setSyncStatus('saved');
        // Clear saved status after 3 seconds
        setTimeout(() => setSyncStatus(null), 3000);
      }
    }, 2000); // Wait 2 seconds after last change

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [allItems, user, saveLoanData]);

  const handleTotalUpdate = useCallback((id, data, action) => {
    setAllItems(prev => {
      if (action === 'remove') {
        const newItems = { ...prev };
        delete newItems[id];
        return newItems;
      }
      return { ...prev, [id]: data };
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Summary Bar */}
      <div className="sticky top-0 z-50">
        <SummaryBar 
          items={allItems} 
          onLoginClick={() => setShowLoginModal(true)}
          syncStatus={syncStatus}
        />
      </div>

      {/* Boards Container */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-x-auto board-scroll">
          <div className="flex gap-4 p-4 min-h-full" style={{ height: 'calc(100vh - 76px)' }}>
            {boards.map((board) => (
              <Board
                key={board.type}
                {...board}
                onTotalUpdate={handleTotalUpdate}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Summary (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-navy text-white p-4 sm:hidden z-40 shadow-card-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/60">ผ่อนรวม/เดือน</p>
            <p className="text-xl font-bold text-yellow">
              ฿{new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(
                Object.values(allItems).reduce((sum, item) => sum + (item?.monthlyPayment || 0), 0)
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/60">รายการ</p>
            <p className="text-lg font-semibold">
              {Object.values(allItems).filter(i => i?.monthlyPayment > 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Not logged in banner */}
      {!user && !loading && (
        <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white rounded-2xl shadow-2xl p-4 z-30 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-xl">💡</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-navy text-sm">บันทึกข้อมูลของคุณ</p>
              <p className="text-xs text-gray-500 mt-0.5">เข้าสู่ระบบเพื่อบันทึกข้อมูลและเข้าถึงจากทุกอุปกรณ์</p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="mt-2 px-4 py-1.5 bg-teal text-white text-sm font-medium rounded-lg hover:bg-teal/90 transition-colors"
              >
                เข้าสู่ระบบ
              </button>
            </div>
            <button
              onClick={(e) => e.target.closest('.fixed').style.display = 'none'}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
