'use client';

import { useState } from 'react';

function formatNumber(num) {
  if (!num || isNaN(num)) return '0.00';
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}

function formatCompact(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toFixed(0);
}

function getLongestEndDate(months) {
  if (!months || months <= 0) return '-';
  const now = new Date();
  const endDate = new Date(now.setMonth(now.getMonth() + months));
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${thaiMonths[endDate.getMonth()]} ${endDate.getFullYear() + 543}`;
}

export default function SummaryBar({ items, onClearAll }) {
  const [showDetails, setShowDetails] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const activeItems = Object.values(items).filter(item => item?.monthlyPayment > 0);
  
  const totals = activeItems.reduce((acc, item) => ({
    monthlyPayment: acc.monthlyPayment + (item.monthlyPayment || 0),
    totalInterest: acc.totalInterest + (item.totalInterest || 0),
    totalPayment: acc.totalPayment + (item.totalPayment || 0),
    principal: acc.principal + (item.principal || 0),
  }), { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, principal: 0 });

  // หารายการที่ผ่อนนานที่สุด
  const longestItem = activeItems.reduce((longest, item) => {
    if (!longest || (item.months || 0) > (longest.months || 0)) {
      return item;
    }
    return longest;
  }, null);

  const longestMonths = longestItem?.months || 0;
  const longestEndDate = getLongestEndDate(longestMonths);

  return (
    <div className="bg-navy text-white">
      <div className="max-w-[1800px] mx-auto px-3 md:px-4 py-2 md:py-3">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-teal flex items-center justify-center">
              <span className="text-base md:text-xl">💰</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm md:text-lg">Loan Calculator</h1>
              <p className="text-[10px] md:text-xs text-white/60">{activeItems.length} รายการ</p>
            </div>
          </div>

          {/* Stats - Desktop */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {/* Total Monthly */}
            <div className="text-center">
              <p className="text-xs text-white/60 mb-0.5">ผ่อนรวม/เดือน</p>
              <p className="text-xl lg:text-2xl font-bold text-yellow">
                ฿{formatNumber(totals.monthlyPayment)}
              </p>
            </div>

            <div className="w-px h-10 bg-white/20" />

            {/* Principal */}
            <div className="text-center">
              <p className="text-xs text-white/60 mb-0.5">เงินต้นรวม</p>
              <p className="text-lg font-semibold text-mint">
                ฿{formatCompact(totals.principal)}
              </p>
            </div>

            {/* Interest */}
            <div className="text-center">
              <p className="text-xs text-white/60 mb-0.5">ดอกเบี้ยรวม</p>
              <p className="text-lg font-semibold text-orange">
                ฿{formatCompact(totals.totalInterest)}
              </p>
            </div>

            {/* Longest End Date */}
            {longestMonths > 0 && (
              <>
                <div className="w-px h-10 bg-white/20 hidden lg:block" />
                <div className="text-center hidden lg:block">
                  <p className="text-xs text-white/60 mb-0.5">📅 หมดหนี้ทั้งหมด</p>
                  <p className="text-lg font-semibold text-mint">
                    {longestEndDate}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Mobile Stats Summary */}
          <div className="flex md:hidden items-center gap-3">
            <div className="text-center">
              <p className="text-[9px] text-white/60">ผ่อน/เดือน</p>
              <p className="text-sm font-bold text-yellow">
                ฿{formatCompact(totals.monthlyPayment)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[9px] text-white/60">ดอกเบี้ย</p>
              <p className="text-sm font-semibold text-orange">
                ฿{formatCompact(totals.totalInterest)}
              </p>
            </div>
          </div>

          {/* Details Button */}
          {activeItems.length > 0 && (
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-xs md:text-sm"
              >
                <span className="hidden sm:inline">รายละเอียด</span>
                <span className="sm:hidden">{activeItems.length}</span>
                <svg className={`w-4 h-4 transition-transform ${showDetails ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDetails && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowDetails(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white rounded-xl shadow-card-xl p-4 z-50 max-h-[70vh] overflow-y-auto">
                    <h4 className="font-semibold text-navy text-sm mb-3">📋 รายการทั้งหมด</h4>
                    <div className="space-y-2">
                      {activeItems.map((item, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-navy truncate max-w-[140px]">
                              {item.name || `รายการ ${idx + 1}`}
                            </span>
                            <span className="text-sm font-bold text-teal">
                              ฿{formatNumber(item.monthlyPayment)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{item.months} งวด</span>
                            <span>หมด {item.endDate || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary Footer */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-navy">รวมผ่อน/เดือน</span>
                        <span className="font-bold text-lg text-teal">฿{formatNumber(totals.monthlyPayment)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-gray-600">ดอกเบี้ยรวม</span>
                        <span className="font-semibold text-orange">฿{formatNumber(totals.totalInterest)}</span>
                      </div>
                      {longestMonths > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">📅 หมดหนี้ทั้งหมด</span>
                          <span className="font-semibold text-navy">{longestEndDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Clear Button */}
                    <button
                      onClick={() => { setShowDetails(false); onClearAll?.(); }}
                      className="w-full mt-4 py-2 rounded-lg border border-red/30 text-red text-sm hover:bg-red/5 transition-colors"
                    >
                      🗑️ ลบข้อมูลทั้งหมด
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
