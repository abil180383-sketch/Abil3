import React, { useState } from 'react';
import { 
  Calculator, 
  ShieldAlert, 
  TrendingUp, 
  TrendingDown, 
  Percent, 
  DollarSign, 
  Zap, 
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { SymbolData } from '../types';
import { soundManager } from '../utils/audio';

interface RiskCalcViewProps {
  currentSymbolData: SymbolData;
}

export const RiskCalcView: React.FC<RiskCalcViewProps> = ({ currentSymbolData }) => {
  const [deposit, setDeposit] = useState<number>(10000);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [direction, setDirection] = useState<'BUY' | 'SELL'>(currentSymbolData.direction);
  const [entryPrice, setEntryPrice] = useState<number>(currentSymbolData.entryPrice);
  const [stopLoss, setStopLoss] = useState<number>(currentSymbolData.stopLoss);
  const [takeProfit, setTakeProfit] = useState<number>(currentSymbolData.takeProfit);
  const [leverage, setLeverage] = useState<number>(5);

  // Computations
  const riskDollar = deposit * (riskPct / 100);
  const slDistance = Math.abs(entryPrice - stopLoss) || 1;
  const tpDistance = Math.abs(takeProfit - entryPrice) || 1;
  const positionSize = riskDollar / slDistance;
  const positionValue = positionSize * entryPrice;
  const marginRequired = positionValue / leverage;
  const rewardDollar = positionSize * tpDistance;
  const rrRatio = slDistance > 0 ? (tpDistance / slDistance).toFixed(2) : '2.00';

  const isCrypto = currentSymbolData.id.includes('BTC') || currentSymbolData.id.includes('ETH') || currentSymbolData.id.includes('SOL');
  const unit = currentSymbolData.id.split('/')[0];

  // Scale-out targets
  const tp1 = direction === 'BUY' ? entryPrice + (slDistance * 1.5) : entryPrice - (slDistance * 1.5);
  const tp2 = direction === 'BUY' ? entryPrice + (slDistance * 2.0) : entryPrice - (slDistance * 2.0);
  const tp3 = direction === 'BUY' ? entryPrice + (slDistance * 3.0) : entryPrice - (slDistance * 3.0);

  return (
    <div id="risk-calc-view" className="flex flex-col w-full gap-4 pb-12">
      {/* Top Banner */}
      <div className="bg-[#171b26] p-5 rounded-xl border border-[#262a35] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/20 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Calculator className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-[#dfe2f1]">
              Институционалды Тәуекел және Позиция Калькуляторы
            </span>
            <span className="text-xs text-[#bcc9cd] mt-0.5">
              Smart Money депозитін қорғау: 1-2% қатаң тәуекел моделі және динамикалық позиция көлемін есептеу.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#1c1f2a] px-3 py-1 rounded text-xs font-mono text-[#4cd7f6] border border-[#313540]">
            Актив: {currentSymbolData.id}
          </span>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-[#171b26] p-5 rounded-xl border border-[#262a35] shadow-xl flex flex-col gap-4">
          <span className="font-mono text-xs text-[#4cd7f6] uppercase tracking-wider font-semibold border-b border-[#262a35] pb-2">
            Параметрлерді енгізу
          </span>

          {/* Direction toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="font-mono text-[11px] text-[#bcc9cd]">Сауда бағыты:</label>
            <div className="grid grid-cols-2 gap-2 bg-[#0a0e18] p-1 rounded border border-[#1c1f2a]">
              <button
                type="button"
                onClick={() => {
                  setDirection('BUY');
                  soundManager.playClick();
                }}
                className={`py-2 rounded font-mono text-xs font-bold transition-all ${
                  direction === 'BUY' ? 'bg-[#4edea3] text-[#003824]' : 'text-[#bcc9cd] hover:text-[#dfe2f1]'
                }`}
              >
                BUY (LONG)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDirection('SELL');
                  soundManager.playClick();
                }}
                className={`py-2 rounded font-mono text-xs font-bold transition-all ${
                  direction === 'SELL' ? 'bg-[#ffb2b7] text-[#67001b]' : 'text-[#bcc9cd] hover:text-[#dfe2f1]'
                }`}
              >
                SELL (SHORT)
              </button>
            </div>
          </div>

          {/* Deposit & Risk Pct */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="riskDeposit" className="font-mono text-[11px] text-[#bcc9cd]">Депозит көлемі ($):</label>
              <input
                id="riskDeposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Math.max(10, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#0a0e18] text-[#dfe2f1] font-mono text-xs px-3 py-2 rounded border border-[#262a35] focus:outline-none focus:ring-1 focus:ring-[#4cd7f6]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="riskPercentage" className="font-mono text-[11px] text-[#bcc9cd]">Тәуекел (%):</label>
              <input
                id="riskPercentage"
                type="number"
                step="0.25"
                min="0.1"
                max="10"
                value={riskPct}
                onChange={(e) => setRiskPct(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full bg-[#0a0e18] text-[#dfe2f1] font-mono text-xs px-3 py-2 rounded border border-[#262a35] focus:outline-none focus:ring-1 focus:ring-[#4cd7f6]"
              />
            </div>
          </div>

          {/* Entry, SL, TP */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="riskEntry" className="font-mono text-[11px] text-[#bcc9cd]">Кіру бағасы (Entry $):</label>
              <input
                id="riskEntry"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#0a0e18] text-[#dfe2f1] font-mono text-xs px-3 py-2 rounded border border-[#262a35] focus:outline-none focus:ring-1 focus:ring-[#4cd7f6]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="riskSL" className="font-mono text-[11px] text-[#ffb2b7]">Стоп-Лосс (SL $):</label>
                <input
                  id="riskSL"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0e18] text-[#ffb2b7] font-mono text-xs px-3 py-2 rounded border border-[#93000a]/40 focus:outline-none focus:ring-1 focus:ring-[#ffb2b7]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="riskTP" className="font-mono text-[11px] text-[#4edea3]">Тейк-Профит (TP $):</label>
                <input
                  id="riskTP"
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0a0e18] text-[#4edea3] font-mono text-xs px-3 py-2 rounded border border-[#00a572]/40 focus:outline-none focus:ring-1 focus:ring-[#4edea3]"
                />
              </div>
            </div>
          </div>

          {/* Leverage Slider */}
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#bcc9cd]">Кредиттік иін (Leverage):</span>
              <span className="text-[#4cd7f6] font-bold">{leverage}x</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
              className="w-full accent-[#06b6d4] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#869397]">
              <span>1x (Спот)</span>
              <span>5x (Қауіпсіз Свинг)</span>
              <span>20x</span>
              <span>50x</span>
            </div>
          </div>
        </div>

        {/* Right Output Dashboard (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Output Metric Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#bcc9cd] uppercase">Позиция көлемі</span>
              <div className="mt-2">
                <span className="font-mono text-lg font-bold text-[#4cd7f6]">
                  {positionSize < 1 ? positionSize.toFixed(3) : positionSize.toFixed(2)} {unit}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#869397] mt-1">
                Құны: ${positionValue.toFixed(0)}
              </span>
            </div>

            <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#ffb2b7] uppercase">Максималды шығын</span>
              <div className="mt-2">
                <span className="font-mono text-lg font-bold text-[#ffb2b7]">
                  ${riskDollar.toFixed(2)}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#ffb2b7] mt-1">
                -{riskPct}% депозит
              </span>
            </div>

            <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#4edea3] uppercase">Мақсатты пайда</span>
              <div className="mt-2">
                <span className="font-mono text-lg font-bold text-[#4edea3]">
                  +${rewardDollar.toFixed(2)}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#4edea3] mt-1">
                +{(riskPct * parseFloat(rrRatio)).toFixed(1)}% өсім
              </span>
            </div>

            <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] flex flex-col justify-between">
              <span className="font-mono text-[10px] text-[#bcc9cd] uppercase">Қажетті маржа</span>
              <div className="mt-2">
                <span className="font-mono text-lg font-bold text-[#dfe2f1]">
                  ${marginRequired.toFixed(2)}
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#4cd7f6] mt-1">
                {leverage}x Иінмен
              </span>
            </div>
          </div>

          {/* Multi-Target Scale Out Plan */}
          <div className="bg-[#171b26] p-5 rounded-xl border border-[#262a35] shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#dfe2f1]">
                Институционалды Scale-Out (Бөліп жабу) жоспары:
              </span>
              <span className="font-mono text-xs text-[#4edea3]">
                R:R = 1 : {rrRatio}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35] flex flex-col gap-1">
                <span className="font-mono text-[10px] text-[#4cd7f6] font-semibold">1-МАҚСАТ (TP1 - 50% Жабу)</span>
                <span className="font-mono text-sm font-bold text-[#dfe2f1]">${tp1.toFixed(2)}</span>
                <span className="text-[10px] text-[#bcc9cd]">1.5R • Қауіпсіздікке (Breakeven) көшіру</span>
              </div>

              <div className="bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35] flex flex-col gap-1">
                <span className="font-mono text-[10px] text-[#4edea3] font-semibold">2-МАҚСАТ (TP2 - 30% Жабу)</span>
                <span className="font-mono text-sm font-bold text-[#4edea3]">${tp2.toFixed(2)}</span>
                <span className="text-[10px] text-[#bcc9cd]">2.0R • Негізгі FVG тесті аяқталуы</span>
              </div>

              <div className="bg-[#1c1f2a] p-3 rounded-lg border border-[#262a35] flex flex-col gap-1">
                <span className="font-mono text-[10px] text-[#ffdadb] font-semibold">3-МАҚСАТ (TP3 - 20% Раннер)</span>
                <span className="font-mono text-sm font-bold text-[#ffdadb]">${tp3.toFixed(2)}</span>
                <span className="text-[10px] text-[#bcc9cd]">3.0R • Ликвидтілікті толық алу</span>
              </div>
            </div>
          </div>

          {/* Risk Discipline Card */}
          <div className="bg-[#0a0e18] p-4 rounded-xl border border-[#1c1f2a] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
              <span className="text-[#dfe2f1]">Тәуекел лимиті тексерілді:</span>
              <span className="text-[#4edea3] font-bold">1% ережесі сақталған</span>
            </div>
            <span className="text-[#869397]">
              Депозит қорғанысы: 100 қатарынан сәтсіздікке төтеп береді
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
