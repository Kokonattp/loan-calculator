'use client';

import { useState, useCallback, useEffect } from 'react';
import Board from '../components/Board';
import SummaryBar from '../components/SummaryBar';

const STORAGE_KEY = 'loan-calculator-data';

const boardsConfig = [
  { type: 'credit', title: 'บัตรเครดิต', icon: '💳', color: '#9333EA', bgColor: '#F5F0FF' },
  { type: 'home', title: 'สินเชื่อบ้าน', icon: '🏠', color: '#079FA0', bgColor: '#E6F7F7' },
  { type: 'car', title: 'สินเชื่อรถยนต์', icon: '🚗', color: '#2563EB', bgColor: '#EEF4FF' },
  { type: 'personal', title: 'สินเชื่อส่วนบุคคล', icon: '👤', color: '#F58B01', bgColor: '#FFF7E6' },
  { type: 'education', title: 'สินเชื่อการศึกษา', icon: '🎓', color: '#059669', bgColor: '#E6FAF2' },
  { type: 'other', title: 'อื่นๆ', icon: '📋', color: '#DC2E2F', bgColor: '#FFF0F0' },
];

export default function Home() {
  const [allItems, setAllItems] = useState({});
  const [boardCards, setBoardCards] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  // โหลดข้อมูลจาก localStorage ตอนเริ่มต้น
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setBoardCards(data.boardCards || {});
        setAllItems(data.allItems || {});
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
    setIsLoaded(true);
  }, []);

  // บันทึกลง localStorage ทุกครั้งที่ข้อมูลเปลี่ยน
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        boardCards,
        allItems,
        savedAt: new Date().toISOString(),
      }));
    } catch (e) {
      console.error('Error saving data:', e);
    }
  }, [boardCards, allItems, isLoaded]);

  const handleCardsChange = useCallback((boardType, cards) => {
    setBoardCards(prev => ({ ...prev, [boardType]: cards }));
  }, []);

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

  const handleClearAll = () => {
    if (confirm('ต้องการลบข้อมูลทั้งหมด?')) {
      setBoardCards({});
      setAllItems({});
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // รอโหลดข้อมูลก่อน
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-main">
      {/* Sticky Summary Bar */}
      <div className="sticky top-0 z-50">
        <SummaryBar items={allItems} onClearAll={handleClearAll} />
      </div>

      {/* Boards Container */}
      <div className="flex-1 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block h-full overflow-x-auto board-scroll">
          <div className="flex gap-4 p-4 min-h-full" style={{ height: 'calc(100vh - 80px)' }}>
            {boardsConfig.map((board) => (
              <Board
                key={board.type}
                {...board}
                cards={boardCards[board.type] || []}
                onCardsChange={(cards) => handleCardsChange(board.type, cards)}
                onTotalUpdate={handleTotalUpdate}
              />
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-3 pb-28 space-y-3 overflow-y-auto" style={{ minHeight: 'calc(100vh - 140px)' }}>
          {boardsConfig.map((board) => (
            <Board
              key={board.type}
              {...board}
              cards={boardCards[board.type] || []}
              onCardsChange={(cards) => handleCardsChange(board.type, cards)}
              onTotalUpdate={handleTotalUpdate}
              isMobile={true}
            />
          ))}
        </div>
      </div>

      {/* Mobile Fixed Bottom Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-navy text-white p-3 md:hidden z-40 safe-area-bottom" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/60">ผ่อนรวม/เดือน</p>
            <p className="text-lg font-bold text-yellow">
              ฿{new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2 }).format(
                Object.values(allItems).reduce((sum, item) => sum + (item?.monthlyPayment || 0), 0)
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-white/60">ดอกเบี้ยรวม</p>
            <p className="text-sm font-semibold text-orange">
              ฿{new Intl.NumberFormat('th-TH', { maximumFractionDigits: 0 }).format(
                Object.values(allItems).reduce((sum, item) => sum + (item?.totalInterest || 0), 0)
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/60">รายการ</p>
            <p className="text-lg font-semibold">
              {Object.values(allItems).filter(i => i?.monthlyPayment > 0).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
