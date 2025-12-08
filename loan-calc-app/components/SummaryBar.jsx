'use client';

import UserMenu from './UserMenu';

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

export default function SummaryBar({ items, onLoginClick, syncStatus }) {
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
  const longestName = longestItem?.name || '-';

  return (
    <div className="bg-navy text-white">
      <div className="max-w-[1800px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg">Loan Calculator Pro</h1>
                {/* Sync Status */}
                {syncStatus === 'saving' && (
                  <span className="px-2 py-0.5 bg-yellow/20 rounded text-xs text-yellow animate-pulse">
                    ⏳ กำลังบันทึก...
                  </span>
                )}
                {syncStatus === 'saved' && (
                  <span className="px-2 py-0.5 bg-mint/20 rounded text-xs text-mint">
                    ✅ บันทึกแล้ว
                  </span>
                )}
                {syncStatus === 'error' && (
                  <span className="px-2 py-0.5 bg-red/20 rounded text-xs text-red">
                    ❌ บันทึกไม่สำเร็จ
                  </span>
                )}
              </div>
              <p className="text-xs text-white/60">{activeItems.length} รายการ</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Total Monthly */}
            <div className="text-center">
              <p className="text-xs text-white/60 mb-0.5">ผ่อนรวม/เดือน</p>
              <p className="text-xl md:text-2xl font-bold text-yellow animate-count">
                ฿{formatNumber(totals.monthlyPayment)}
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-white/20 hidden sm:block" />

            {/* Principal */}
            <div className="text-center hidden md:block">
              <p className="text-xs text-white/60 mb-0.5">เงินต้นรวม</p>
              <p className="text-lg font-semibold text-mint">
                ฿{formatCompact(totals.principal)}
              </p>
            </div>

            {/* Interest */}
            <div className="text-center hidden sm:block">
              <p className="text-xs text-white/60 mb-0.5">ดอกเบี้ยรวม</p>
              <p className="text-lg font-semibold text-orange">
                ฿{formatCompact(totals.totalInterest)}
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-10 bg-white/20 hidden lg:block" />

            {/* Longest End Date */}
            {longestMonths > 0 && (
              <div className="text-center hidden lg:block">
                <p className="text-xs text-white/60 mb-0.5">📅 หมดหนี้ทั้งหมด</p>
                <p className="text-lg font-semibold text-mint">
                  {longestEndDate}
                </p>
                <p className="text-[10px] text-white/40 truncate max-w-[100px]">
                  ({longestName})
                </p>
              </div>
            )}
          </div>

          {/* Right Side - User Menu & Details */}
          <div className="flex items-center gap-3">
            {/* Items List - Dropdown */}
            {activeItems.length > 0 && (
              <details className="relative group">
                <summary className="cursor-pointer list-none flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="text-sm">รายละเอียด</span>
                  <svg className="w-4 h-4 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-card-xl p-4 z-50 max-h-96 overflow-y-auto">
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
                    {longestMonths > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">📅 หมดหนี้ทั้งหมด</span>
                        <span className="font-semibold text-navy">{longestEndDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            )}

            {/* User Menu */}
            <UserMenu onLoginClick={onLoginClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
