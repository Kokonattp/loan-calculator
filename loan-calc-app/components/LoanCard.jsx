'use client';

import { useState, useMemo, useEffect } from 'react';

function formatNumber(num) {
  if (!num || isNaN(num)) return '0.00';
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
}

function getEndDate(months) {
  const now = new Date();
  const endDate = new Date(now.setMonth(now.getMonth() + months));
  const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
  return `${thaiMonths[endDate.getMonth()]} ${endDate.getFullYear() + 543}`;
}

export default function LoanCard({ 
  id, 
  itemName: initialName = '',
  onRemove, 
  onUpdate,
  accentColor = '#079FA0',
}) {
  const [itemName, setItemName] = useState(initialName);
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('15');
  const [months, setMonths] = useState('12');
  const [minPayment, setMinPayment] = useState('');
  const [isReducing, setIsReducing] = useState(true);
  const [calcMode, setCalcMode] = useState('months');
  const [isExpanded, setIsExpanded] = useState(true);

  const calculation = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const annualRate = (parseFloat(interestRate) || 0) / 100;
    const monthlyRate = annualRate / 12;

    if (P <= 0) return null;

    if (calcMode === 'months') {
      const n = parseInt(months) || 1;
      if (isReducing) {
        if (monthlyRate === 0) {
          return { monthlyPayment: P / n, totalInterest: 0, totalPayment: P, months: n, endDate: getEndDate(n) };
        }
        const monthlyPayment = P * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        return { monthlyPayment, totalInterest: monthlyPayment * n - P, totalPayment: monthlyPayment * n, months: n, endDate: getEndDate(n) };
      } else {
        const totalInterest = P * annualRate * (n / 12);
        return { monthlyPayment: (P + totalInterest) / n, totalInterest, totalPayment: P + totalInterest, months: n, endDate: getEndDate(n) };
      }
    } else {
      const payment = parseFloat(minPayment) || 0;
      if (payment <= 0) return null;
      
      if (isReducing && monthlyRate > 0) {
        const minRequired = P * monthlyRate;
        if (payment <= minRequired) return { error: 'ยอดผ่อนต่ำเกินไป', minRequired };
        const n = Math.ceil(-Math.log(1 - (P * monthlyRate / payment)) / Math.log(1 + monthlyRate));
        let balance = P, totalPaid = 0, totalInterestPaid = 0;
        for (let i = 1; i <= n; i++) {
          const int = balance * monthlyRate;
          const prin = Math.min(payment - int, balance);
          balance -= prin;
          totalPaid += payment;
          totalInterestPaid += int;
          if (balance <= 0) break;
        }
        return { monthlyPayment: payment, totalInterest: totalInterestPaid, totalPayment: totalPaid, months: n, endDate: getEndDate(n) };
      } else {
        const n = monthlyRate === 0 ? Math.ceil(P / payment) : (() => {
          let n = Math.ceil(P / payment);
          for (let i = 0; i < 100; i++) {
            const totalInt = P * annualRate * (n / 12);
            const newN = Math.ceil((P + totalInt) / payment);
            if (newN === n) break;
            n = newN;
          }
          return n;
        })();
        const totalInterest = P * annualRate * (n / 12);
        return { monthlyPayment: payment, totalInterest, totalPayment: P + totalInterest, months: n, endDate: getEndDate(n) };
      }
    }
  }, [principal, interestRate, months, minPayment, isReducing, calcMode]);

  useEffect(() => {
    if (calculation && !calculation.error) {
      onUpdate?.(id, { 
        ...calculation, 
        name: itemName || 'รายการใหม่',
        principal: parseFloat(principal) || 0,
      });
    } else {
      onUpdate?.(id, { monthlyPayment: 0, totalInterest: 0, totalPayment: 0, months: 0, name: itemName, principal: 0, endDate: null });
    }
  }, [calculation, id, onUpdate, itemName, principal]);

  return (
    <div className="bg-white rounded-2xl animate-slide-in overflow-hidden border-2 border-gray-200 hover:border-gray-300 transition-colors" style={{ boxShadow: '0 4px 12px rgba(2, 56, 82, 0.1)' }}>
      {/* Card Header */}
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer bg-gray-50/50"
        style={{ borderLeft: `5px solid ${accentColor}` }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="ชื่อรายการ..."
            className="w-full bg-transparent border-none outline-none font-medium text-navy text-sm placeholder:text-gray-400"
          />
          {calculation && !calculation.error && (
            <p className="text-xs mt-0.5" style={{ color: accentColor }}>
              ฿{formatNumber(calculation.monthlyPayment)}/เดือน
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onRemove?.(id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red/10 transition-colors group"
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card Body */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Principal */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">ยอดเงินต้น</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="0.00"
              className="input-field"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">ดอกเบี้ย (% ต่อปี)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="15"
              step="0.01"
              className="input-field"
            />
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between py-2">
            <span className="text-xs font-medium text-gray-600">ลดต้นลดดอก</span>
            <button
              onClick={() => setIsReducing(!isReducing)}
              className={`switch ${isReducing ? 'active' : ''}`}
            />
          </div>

          {/* Calc Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setCalcMode('months')}
              className={`chip flex-1 text-center ${calcMode === 'months' ? 'active' : ''}`}
            >
              กำหนดงวด
            </button>
            <button
              onClick={() => setCalcMode('payment')}
              className={`chip flex-1 text-center ${calcMode === 'payment' ? 'active' : ''}`}
            >
              กำหนดยอดผ่อน
            </button>
          </div>

          {/* Months or Payment */}
          {calcMode === 'months' ? (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">จำนวนงวด (เดือน)</label>
              <input
                type="number"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="input-field"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[6, 12, 24, 36, 48, 60].map(m => (
                  <button
                    key={m}
                    onClick={() => setMonths(m.toString())}
                    className={`chip ${parseInt(months) === m ? 'active' : ''}`}
                  >
                    {m >= 12 ? `${m/12}ปี` : `${m}ด.`}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">ยอดผ่อน/เดือน</label>
              <input
                type="number"
                value={minPayment}
                onChange={(e) => setMinPayment(e.target.value)}
                placeholder="0.00"
                className="input-field"
              />
              {calculation?.minRequired && (
                <p className="text-xs text-red mt-1">⚠️ ต้องผ่อนอย่างน้อย ฿{formatNumber(calculation.minRequired + 1)}</p>
              )}
            </div>
          )}

          {/* Result */}
          {calculation && !calculation.error && parseFloat(principal) > 0 && (
            <div 
              className="rounded-xl p-3 mt-3 border-2"
              style={{ background: `${accentColor}08`, borderColor: `${accentColor}30` }}
            >
              <div className="text-center mb-2">
                <p className="text-xs text-gray-500">{calcMode === 'months' ? 'ยอดผ่อน/เดือน' : 'ผ่อนอีก'}</p>
                <p className="text-xl font-bold" style={{ color: accentColor }}>
                  {calcMode === 'months' ? `฿${formatNumber(calculation.monthlyPayment)}` : `${calculation.months} เดือน`}
                </p>
              </div>
              
              {/* End Date */}
              <div className="text-center mb-3 py-2 bg-white/80 rounded-lg border border-gray-100">
                <p className="text-[10px] text-gray-500">📅 ผ่อนหมด</p>
                <p className="text-sm font-semibold text-navy">{calculation.endDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/80 rounded-lg p-2 border border-gray-100">
                  <p className="text-[10px] text-gray-500">ดอกเบี้ยรวม</p>
                  <p className="text-sm font-semibold text-red">฿{formatNumber(calculation.totalInterest)}</p>
                </div>
                <div className="bg-white/80 rounded-lg p-2 border border-gray-100">
                  <p className="text-[10px] text-gray-500">ชำระรวม</p>
                  <p className="text-sm font-semibold text-navy">฿{formatNumber(calculation.totalPayment)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
