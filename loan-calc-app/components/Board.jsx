'use client';

import { useState, useCallback } from 'react';
import LoanCard from './LoanCard';

let cardIdCounter = 0;

export default function Board({ 
  type,
  title, 
  icon, 
  color,
  bgColor,
  onTotalUpdate,
}) {
  const [cards, setCards] = useState([]);

  const addCard = () => {
    const newCard = { id: `${type}-${cardIdCounter++}` };
    setCards(prev => [...prev, newCard]);
  };

  const removeCard = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
    onTotalUpdate?.(id, null, 'remove');
  };

  const updateCard = useCallback((id, data) => {
    onTotalUpdate?.(id, data, 'update');
  }, [onTotalUpdate]);

  return (
    <div 
      className="flex-shrink-0 w-[320px] rounded-2xl flex flex-col max-h-full border-2 border-gray-200/80"
      style={{ background: bgColor, boxShadow: '0 4px 16px rgba(2, 56, 82, 0.08)' }}
    >
      {/* Board Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${color}20` }}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-navy text-sm">{title}</h3>
            <p className="text-xs text-gray-500">{cards.length} รายการ</p>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3 hide-scrollbar">
        {cards.map((card) => (
          <LoanCard
            key={card.id}
            id={card.id}
            accentColor={color}
            onRemove={removeCard}
            onUpdate={updateCard}
          />
        ))}

        {cards.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">ยังไม่มีรายการ</p>
            <p className="text-xs mt-1">กดปุ่ม + เพื่อเพิ่ม</p>
          </div>
        )}
      </div>

      {/* Add Button */}
      <div className="p-3">
        <button
          onClick={addCard}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-sm font-medium flex items-center justify-center gap-2 hover:border-gray-400 hover:text-gray-600 transition-all hover:bg-white/50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          เพิ่มรายการ
        </button>
      </div>
    </div>
  );
}
