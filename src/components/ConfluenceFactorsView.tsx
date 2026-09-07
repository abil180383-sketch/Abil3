import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Sliders, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  FileCode2,
  Info
} from 'lucide-react';
import { SymbolData } from '../types';
import { soundManager } from '../utils/audio';

interface ConfluenceFactorsViewProps {
  currentSymbolData: SymbolData;
  onNavigateToPineScript: () => void;
}

export const ConfluenceFactorsView: React.FC<ConfluenceFactorsViewProps> = ({
  currentSymbolData,
  onNavigateToPineScript
}) => {
  // Factor simulator states
  const [f1Active, setF1Active] = useState<boolean>(true); // RSI
  const [f2Active, setF2Active] = useState<boolean>(true); // HMA
  const [f3Active, setF3Active] = useState<boolean>(true); // Volatility
  const [f4Active, setF4Active] = useState<boolean>(true); // MACD
  const [f5Active, setF5Active] = useState<boolean>(true); // BOS

  const activeCount = [f1Active, f2Active, f3Active, f4Active, f5Active].filter(Boolean).length;
  const isHighConviction = activeCount >= 4;

  const factorsDetailed = [
    {
      id: 1,
      title: 'ФАКТОР 1: Momentum Oscillator (RSI)',
      param: 'RSI(14) Bullish = 64.2',
      status: f1Active,
      setter: setF1Active,
      details: 'Импульс көрсеткіші 50 орталық сызығынан сенімді түрде жоғары көтеріліп, 64.2 мәніне жетті. Бұл сатып алушылардың институционалды үстемдігін растайды және шамадан тыс сатып алу аймағына (70+) жеткенге дейін өсу кеңістігі бар.',
      pineCode: 'rsi_bull = ta.rsi(close, 14) > 52 and ta.rsi(close, 14) < 72'
    },
    {
      id: 2,
      title: 'ФАКТОР 2: Sniper Hull Moving Average (HMA)',
      param: '9-Period HMA Vector = Жасыл (Up)',
      status: f2Active,
      setter: setF2Active,
      details: 'Ең төменгі кідірісі бар Hull Moving Average динамикалық сызығы өсу бағытына бұрылып, жасыл индикаторға боялды. Баға HMA сызығының үстінде саудалануда.',
      pineCode: 'hma_val = ta.wma(2*ta.wma(close, 4.5) - ta.wma(close, 9), 3)'
    },
    {
      id: 3,
      title: 'ФАКТОР 3: Volatility Expansion (Green Light)',
      param: 'ATR Expansion = Green Light Қосулы',
      status: f3Active,
      setter: setF3Active,
      details: 'ATR және Bollinger Bands консолидациясынан кейінгі күшті импульстік қозғалыс. Қысылу аймағынан серпіліс басталды, көлем институционалды деңгейге көтерілді.',
      pineCode: 'vol_expansion = ta.atr(14) > ta.sma(ta.atr(14), 20)'
    },
    {
      id: 4,
      title: 'ФАКТОР 4: MACD Wave Flow (0-Cross)',
      param: 'MACD Hist = +142.8 (0-ден жоғары)',
      status: f4Active,
      setter: setF4Active,
      details: 'MACD толқын гистограммасы нөлдік деңгейден жоғары өтіп, жедел өсу бағытында кеңеюде. Сигнал сызығынан жоғары қиылысу орындалды.',
      pineCode: 'macd_bull = macd_hist > 0 and macd_line > macd_signal'
    },
    {
      id: 5,
      title: 'ФАКТОР 5: Smart Money Structure (BOS / FVG)',
      param: 'D1/H4 BOS = Нөлдік өтім расталды',
      status: f5Active,
      setter: setF5Active,
      details: 'Жоғары таймфреймдегі (D1) негізгі қарсылық нүктесі бұзылып (Break of Structure), 4 сағаттық графикте пайда болған FVG (Fair Value Gap) сыналды. Бұл Smart Money саудагерлерінің кіру деңгейі.',
      pineCode: 'bos_bull = ta.crossover(close, last_ph) or fvg_bull'
    }
  ];

  return (
    <div id="confluence-factors-view" className="flex flex-col w-full gap-4 pb-12">
      {/* Top Confluence Summary Banner */}
      <div className="bg-[#171b26] p-5 rounded-xl border border-[#262a35] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#06b6d4]/20 flex items-center justify-center text-[#4cd7f6] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#dfe2f1]">
                5-Factor Confluence Матрицасы
              </span>
              <span className={`px-2.5 py-0.5 rounded font-mono text-xs font-bold ${
                isHighConviction ? 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40' : 'bg-[#93000a]/20 text-[#ffb2b7] border border-[#93000a]/40'
              }`}>
                {activeCount} / 5 {isHighConviction ? 'Оңтайлы (Execution Ready)' : 'Күту режимі (Neutral)'}
              </span>
            </div>
            <span className="text-xs text-[#bcc9cd] mt-0.5">
              Pine Script v6 алгоритмі саудаға кіру үшін кемінде 4 фактордың бір мезгілде орындалуын талап етеді.
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateToPineScript}
          className="bg-[#262a35] hover:bg-[#353944] text-[#4cd7f6] px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 transition-colors border border-[#3d494c]"
        >
          <FileCode2 className="w-4 h-4" />
          <span>Pine Script кодын көру</span>
        </button>
      </div>

      {/* Interactive Confluence Checklist Details */}
      <div className="grid grid-cols-1 gap-3">
        {factorsDetailed.map((factor) => (
          <div
            key={factor.id}
            className={`p-4 rounded-xl border transition-all ${
              factor.status 
                ? 'bg-[#171b26] border-[#262a35] hover:border-[#4cd7f6]/50' 
                : 'bg-[#171b26]/50 border-[#262a35]/40 opacity-70'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    factor.setter(!factor.status);
                    soundManager.playClick();
                  }}
                  className="transition-transform hover:scale-110"
                >
                  {factor.status ? (
                    <CheckCircle2 className="w-5 h-5 text-[#4edea3]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#869397]" />
                  )}
                </button>
                <span className="font-bold text-sm text-[#dfe2f1]">
                  {factor.title}
                </span>
                <span className="font-mono text-xs text-[#4cd7f6] bg-[#00424f]/40 px-2 py-0.5 rounded border border-[#00424f]">
                  {factor.param}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#869397]">Индикатор күйі:</span>
                <span className={`font-mono text-xs font-bold ${factor.status ? 'text-[#4edea3]' : 'text-[#869397]'}`}>
                  {factor.status ? 'АКТИВТІ (Расталған)' : 'ӨШІРУЛІ'}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#bcc9cd] leading-relaxed mb-3 pl-7">
              {factor.details}
            </p>

            {/* Pine Script snippet for this factor */}
            <div className="pl-7">
              <div className="bg-[#0a0e18] px-3 py-1.5 rounded font-mono text-[11px] text-[#4edea3] flex items-center justify-between border border-[#1c1f2a]">
                <code>{factor.pineCode}</code>
                <span className="text-[9px] text-[#869397] uppercase">TradingView v6 Logic</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Educational SMC Notes */}
      <div className="bg-[#1c1f2a] p-4 rounded-xl border border-[#262a35] flex items-start gap-3 text-xs text-[#bcc9cd]">
        <Info className="w-5 h-5 text-[#4cd7f6] flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 leading-relaxed">
          <span className="font-bold text-[#dfe2f1]">Smart Money институционалды ережесі:</span>
          <span>
            Жай ғана индикаторлар бойынша сауда жасау жиі жалған сигналдарға әкеледі. Бұл жүйеде BOS (құрылымдық бұзылу) немесе FVG (теңсіздік аймағы) расталмайынша, импульс пен индикаторлар сигнал бермейді. Бұл өтімділікті жинаушы ірі банктер мен маркетмейкерлердің ізімен кіруге кепілдік береді.
          </span>
        </div>
      </div>
    </div>
  );
};
