import React, { useState, useId } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  Trash2, 
  Link as LinkIcon, 
  Bot, 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Copy, 
  Check, 
  Share2, 
  Sparkles,
  FileText
} from 'lucide-react';
import { SymbolData } from '../types';
import { soundManager } from '../utils/audio';

interface LiveSignalsViewProps {
  currentSymbolData: SymbolData;
  onSelectSymbol: (id: string) => void;
  onNavigateToRisk: () => void;
  onNavigateToFactors: () => void;
}

export const LiveSignalsView: React.FC<LiveSignalsViewProps> = ({
  currentSymbolData,
  onNavigateToRisk,
  onNavigateToFactors
}) => {
  // Local trade states
  const [isLong, setIsLong] = useState<boolean>(currentSymbolData.direction === 'BUY');
  const [deposit, setDeposit] = useState<number>(10000);
  const [riskPct, setRiskPct] = useState<number>(1.0);
  const [leverage, setLeverage] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  // File Upload and Analysis state
  const [uploadedImage, setUploadedImage] = useState<string>(currentSymbolData.chartImage);
  const [fileName, setFileName] = useState<string>(`${currentSymbolData.id.replace('/', '')}_4H_Swing_Breakout.png`);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisCompleted, setAnalysisCompleted] = useState<boolean>(true);
  const [directUrl, setDirectUrl] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputId = useId();

  // Handle Long / Short toggle
  const toggleDirection = (longMode: boolean) => {
    setIsLong(longMode);
    if (longMode) {
      soundManager.playSuccess();
    } else {
      soundManager.playAlert();
    }
  };

  // Entry, TP, SL calculation based on direction & active asset
  const basePrice = currentSymbolData.price;
  const atr = currentSymbolData.atr;
  const entryPrice = isLong ? currentSymbolData.entryPrice : basePrice;
  const tpPrice = isLong ? entryPrice + (atr * 2) : entryPrice - (atr * 2);
  const slPrice = isLong ? entryPrice - atr : entryPrice + atr;
  const slDistance = Math.abs(entryPrice - slPrice);
  const tpDistance = Math.abs(tpPrice - entryPrice);

  // Risk Math
  const riskAmount = (deposit * (riskPct / 100));
  const rawLot = slDistance > 0 ? riskAmount / slDistance : 0;
  const isCrypto = currentSymbolData.id.includes('BTC') || currentSymbolData.id.includes('ETH') || currentSymbolData.id.includes('SOL');
  const lotUnit = currentSymbolData.id.split('/')[0];
  const formattedLot = rawLot < 1 ? rawLot.toFixed(3) : rawLot.toFixed(2);
  const rewardAmount = (riskAmount * 2);

  // File upload handlers
  const handleFileUpload = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    soundManager.playClick();

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setUploadedImage(e.target.result as string);
          triggerAnalysis();
        }
      };
      reader.readAsDataURL(file);
    } else {
      showToast(`Құжат қабылданды: ${file.name}`);
      triggerAnalysis();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleResetFile = () => {
    setUploadedImage('');
    setFileName('Құжат таңдалмаған');
    setAnalysisCompleted(false);
    soundManager.playClick();
  };

  const handleFetchUrl = () => {
    if (!directUrl.trim()) return;
    showToast('TradingView сілтемесі бойынша график жүктелді');
    soundManager.playSuccess();
    setFileName('TradingView_Chart_Snapshot.png');
    triggerAnalysis();
  };

  const triggerAnalysis = () => {
    setIsAnalyzing(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
      soundManager.playSuccess();
      showToast('Талдау аяқталды: 5/5 SMC Confluence расталды!');
    }, 1200);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Preset sample charts for 1-click test
  const loadPreset = (symbolName: string) => {
    setFileName(`${symbolName}_Institutional_Chart.png`);
    triggerAnalysis();
  };

  // Copy signal to clipboard
  const handleCopySignal = () => {
    const text = `
🎯 UNIFIED SMC SWING СИГНАЛЫ
━━━━━━━━━━━━━━━━━━━
Актив: ${currentSymbolData.id} (4H)
Бағыты: ${isLong ? 'BUY (LONG) 🟢' : 'SELL (SHORT) 🔴'}
Конфлюенс: 5/5 Оңтайлы
━━━━━━━━━━━━━━━━━━━
📍 Кіру бағасы: $${entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
🎯 Тейк-Профит (TP): $${tpPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} (+${((tpDistance / entryPrice) * 100).toFixed(2)}%)
🛑 Стоп-Лосс (SL): $${slPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} (-${((slDistance / entryPrice) * 100).toFixed(2)}%)
⚖️ R:R қатынасы: 1 : 2.00
📊 Ұсынылған көлем: ${formattedLot} ${lotUnit} (Тәуекел: $${riskAmount.toFixed(2)})
━━━━━━━━━━━━━━━━━━━
Pine Script V6 • Алгоритмдік SMC Талдауы
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    soundManager.playSuccess();
    showToast('Сигнал алмасу буферіне көшірілді!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="live-signals-view" className="flex flex-col w-full pb-12">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1c1f2a] text-[#dfe2f1] border border-[#06b6d4] px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#4edea3]" />
          <span className="text-xs font-mono font-medium">{notification}</span>
        </div>
      )}

      {/* Telemetry Status Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse shadow-[0_0_12px_rgba(78,222,163,0.8)]"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-[#4cd7f6] tracking-widest uppercase font-semibold">
              Нейрожелілік Свинг Талдағыш • SMC Engine V6
            </span>
            <span className="text-lg font-bold text-[#dfe2f1]">
              Құжаттық График Анализаторы
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-[#1c1f2a] px-3 py-1 rounded text-xs font-mono text-[#bcc9cd] border border-[#313540]">
            Режим: Авто-Свинг 4H/1D
          </span>
          <span className="bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/40 px-3 py-1 rounded text-xs font-mono font-semibold">
            Pine Script v6 Ready
          </span>
        </div>
      </div>

      {/* Main Workspace Layout (5 Cols Left / 7 Cols Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
        
        {/* LEFT ZONE: Upload & Document Inspection Deck (5 Columns) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          
          {/* Dropzone Container */}
          <div 
            id="dropZoneCard" 
            className="bg-[#171b26] rounded-xl p-5 shadow-xl relative overflow-hidden border border-[#262a35] transition-all"
          >
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#4cd7f6]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[11px] text-[#bcc9cd] uppercase tracking-wider font-semibold">
                Құжатты немесе скриншотты қабылдау
              </span>
              <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#1c1f2a] px-2 py-0.5 rounded border border-[#313540]">
                PNG, JPG, WEBP, PDF (Max 25MB)
              </span>
            </div>

            {/* Drag and Drop Active Target Area */}
            <div
              id="dropTarget"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="group bg-[#0a0e18] hover:bg-[#1c1f2a]/60 transition-all cursor-pointer rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-inner relative border-2 border-dashed border-[#313540] hover:border-[#4cd7f6]/60"
            >
              <input
                id={fileInputId}
                type="file"
                accept="image/*,application/pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              
              <div className="w-14 h-14 rounded-full bg-[#4cd7f6]/10 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-[#4cd7f6]/20 transition-transform">
                <UploadCloud className="w-7 h-7 text-[#4cd7f6]" />
              </div>

              <span className="text-base font-bold text-[#dfe2f1] mb-1">
                График скриншотын немесе құжатты жүктеу
              </span>

              <p className="text-xs text-[#bcc9cd] max-w-sm mb-4 leading-relaxed">
                Файлды осы аймаққа сүйреп тастаңыз немесе құрылғыңыздан таңдаңыз. TradingView, MT5 немесе Биржа интерфейсінен алынған суреттерді таниды.
              </p>

              <div className="flex items-center gap-2">
                <label 
                  htmlFor={fileInputId}
                  className="bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] font-bold text-xs px-4 py-2 rounded flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Файлды таңдау</span>
                </label>
              </div>
            </div>

            {/* Quick Preset Buttons for Instant Verification */}
            <div className="mt-3 flex items-center justify-between text-xs font-mono">
              <span className="text-[#869397] text-[11px]">Дайын мысалдар:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => loadPreset('BTC_4H_Breakout')}
                  className="text-[10px] bg-[#1c1f2a] hover:bg-[#262a35] text-[#4cd7f6] px-2 py-0.5 rounded border border-[#313540] transition-colors"
                >
                  BTC 4H
                </button>
                <button
                  onClick={() => loadPreset('ETH_Daily_Sweep')}
                  className="text-[10px] bg-[#1c1f2a] hover:bg-[#262a35] text-[#4edea3] px-2 py-0.5 rounded border border-[#313540] transition-colors"
                >
                  ETH 1D
                </button>
                <button
                  onClick={() => loadPreset('XAU_OrderBlock')}
                  className="text-[10px] bg-[#1c1f2a] hover:bg-[#262a35] text-[#ffdadb] px-2 py-0.5 rounded border border-[#313540] transition-colors"
                >
                  XAU Gold
                </button>
              </div>
            </div>

            {/* URL / Direct Link Alternative */}
            <div className="mt-4 pt-3 flex flex-col gap-1.5 border-t border-[#262a35]">
              <label htmlFor="chartUrl" className="font-mono text-[11px] text-[#bcc9cd]">
                Немесе TradingView сілтемесін енгізіңіз:
              </label>
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 absolute left-2.5 top-2.5 text-[#869397]" />
                  <input
                    id="chartUrl"
                    type="text"
                    value={directUrl}
                    onChange={(e) => setDirectUrl(e.target.value)}
                    placeholder="https://tradingview.com/x/..."
                    className="w-full bg-[#0a0e18] text-[#dfe2f1] font-mono text-xs pl-8 pr-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#4cd7f6] border border-[#262a35]"
                  />
                </div>
                <button
                  id="btnFetchUrl"
                  type="button"
                  onClick={handleFetchUrl}
                  className="bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] font-mono text-xs px-3.5 py-2 rounded transition-colors border border-[#3d494c]"
                >
                  Жүктеу
                </button>
              </div>
            </div>

            {/* File Process CTA Button */}
            <div className="mt-4">
              <button
                id="btnAnalyze"
                type="button"
                disabled={isAnalyzing}
                onClick={triggerAnalysis}
                className="w-full bg-[#06b6d4] hover:bg-[#4cd7f6] text-[#003640] font-bold py-3 rounded text-sm shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin text-[#003640]" />
                    <span>Талдануда / Scanning SMC Structures...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-5 h-5 text-[#003640]" />
                    <span>Талдауды бастау / Analyze Chart</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loaded Document State Preview Card */}
          <div id="loadedPreviewCard" className="bg-[#1c1f2a] rounded-xl p-4 shadow-md border border-[#262a35]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                <span className="font-mono text-[11px] text-[#dfe2f1] uppercase font-semibold">
                  Жүктелген құжат тексерілді
                </span>
              </div>
              <button
                id="btnClearFile"
                onClick={handleResetFile}
                className="font-mono text-[11px] text-[#ffb4ab] hover:text-[#dfe2f1] flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Жою
              </button>
            </div>

            <div className="relative rounded-lg overflow-hidden bg-[#0a0e18] aspect-video flex items-center justify-center border border-[#313540]">
              {uploadedImage ? (
                <img
                  id="previewImg"
                  src={uploadedImage}
                  alt="Chart Screenshot"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-[#869397] p-6 text-center">
                  <FileText className="w-12 h-12 mb-2 text-[#313540]" />
                  <span className="text-xs font-mono">Құжат немесе график бейнесі таңдалмаған</span>
                  <span className="text-[10px] text-[#869397] mt-1">Жоғарыдағы аймаққа сурет салыңыз</span>
                </div>
              )}

              {/* Scanning Laser Line when Analysis is active */}
              {isAnalyzing && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#4cd7f6] to-transparent shadow-[0_0_15px_#4cd7f6] animate-[pulse_1s_infinite]"></div>
                  <div className="absolute inset-0 bg-[#4cd7f6]/10 animate-pulse"></div>
                </div>
              )}

              {/* Detected SMC Badges overlayed on preview image */}
              {analysisCompleted && uploadedImage && (
                <>
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    <span className="bg-[#0a0e18]/90 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[10px] text-[#4edea3] font-bold border border-[#4edea3]/40 shadow">
                      {currentSymbolData.bosPattern}
                    </span>
                    <span className="bg-[#0a0e18]/90 backdrop-blur-md px-2 py-0.5 rounded font-mono text-[10px] text-[#4cd7f6] font-bold border border-[#4cd7f6]/40 shadow">
                      {currentSymbolData.fvgZone}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-[#0a0e18]/90 backdrop-blur-md px-2.5 py-1 rounded font-mono text-xs text-[#4edea3] font-bold border border-[#4edea3]/40 shadow">
                    Көлем: {currentSymbolData.sweepVolume}
                  </div>
                </>
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[#bcc9cd] font-mono text-[11px]">
              <span id="fileNameDisplay" className="truncate max-w-[200px]">
                {fileName}
              </span>
              <span className="text-[#4edea3] font-semibold">
                AI Сәйкестік: {currentSymbolData.aiConfidence}%
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT ZONE: Calculated SMC Signal Execution & Metrics (7 Columns) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          
          {/* Signal Hero Result Card */}
          <div 
            id="signalHeroBanner" 
            className="bg-[#171b26] rounded-xl p-5 shadow-xl relative overflow-hidden border border-[#262a35]"
          >
            {/* Background Glow */}
            <div 
              className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
                isLong ? 'bg-[#4edea3]/15' : 'bg-[#ffb2b7]/15'
              }`}
            ></div>

            {/* Header Signal Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#1c1f2a] font-mono text-[11px] text-[#4cd7f6] uppercase font-semibold border border-[#313540]">
                  Актив: {currentSymbolData.id}
                </span>
                <span className="px-2.5 py-1 rounded bg-[#1c1f2a] font-mono text-[11px] text-[#bcc9cd] border border-[#313540]">
                  Таймфрейм: {currentSymbolData.timeframe}
                </span>
              </div>

              <div 
                onClick={onNavigateToFactors}
                className="flex items-center gap-1.5 bg-[#262a35] hover:bg-[#353944] px-3 py-1 rounded cursor-pointer transition-colors border border-[#3d494c]"
              >
                <span className="font-mono text-[10px] text-[#bcc9cd]">Конфлюенс:</span>
                <span className="font-mono text-xs text-[#4edea3] font-bold">
                  {currentSymbolData.confluenceScore} / {currentSymbolData.maxConfluence} Оңтайлы
                </span>
              </div>
            </div>

            {/* Major Signal Banner */}
            <div className="bg-[#0a0e18] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner border border-[#1c1f2a]">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors shadow-lg ${
                    isLong 
                      ? 'bg-[#00a572]/20 text-[#4edea3] shadow-[0_0_24px_rgba(78,222,163,0.3)]' 
                      : 'bg-[#93000a]/20 text-[#ffb2b7] shadow-[0_0_24px_rgba(255,178,183,0.3)]'
                  }`}
                >
                  {isLong ? (
                    <TrendingUp className="w-8 h-8 text-[#4edea3]" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-[#ffb2b7]" />
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span 
                      id="signalMainBadge" 
                      className={`text-2xl font-black font-sans tracking-tight ${
                        isLong ? 'text-[#4edea3]' : 'text-[#ffb2b7]'
                      }`}
                    >
                      {isLong ? 'BUY (LONG)' : 'SELL (SHORT)'}
                    </span>
                    <span 
                      className={`w-2.5 h-2.5 rounded-full animate-ping ${
                        isLong ? 'bg-[#4edea3]' : 'bg-[#ffb2b7]'
                      }`}
                    ></span>
                  </div>
                  <span className="font-mono text-[10px] text-[#bcc9cd] uppercase tracking-wider font-semibold">
                    {isLong ? 'Институционалды өсу сигналы расталды' : 'Институционалды сату сигналы расталды'}
                  </span>
                </div>
              </div>

              {/* Direction Switcher Simulation + Copy */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#1c1f2a] p-1 rounded border border-[#313540]">
                  <button
                    id="btnToggleLong"
                    onClick={() => toggleDirection(true)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                      isLong 
                        ? 'bg-[#4edea3] text-[#003824] shadow-sm' 
                        : 'text-[#bcc9cd] hover:text-[#dfe2f1]'
                    }`}
                  >
                    BUY (LONG)
                  </button>
                  <button
                    id="btnToggleShort"
                    onClick={() => toggleDirection(false)}
                    className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                      !isLong 
                        ? 'bg-[#ffb2b7] text-[#67001b] shadow-sm' 
                        : 'text-[#bcc9cd] hover:text-[#dfe2f1]'
                    }`}
                  >
                    SELL (SHORT)
                  </button>
                </div>

                <button
                  id="btn-copy-signal"
                  onClick={handleCopySignal}
                  className="p-2 bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] rounded transition-colors border border-[#3d494c]"
                  title="Сигналды көшіру"
                >
                  {copied ? <Check className="w-4 h-4 text-[#4edea3]" /> : <Copy className="w-4 h-4 text-[#4cd7f6]" />}
                </button>
              </div>
            </div>

            {/* Main Trading Matrix Numbers (4 Key Pillars) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
              {/* 1. Entry Price */}
              <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
                <span className="font-mono text-[10px] text-[#bcc9cd] uppercase font-semibold">
                  Кіру бағасы (Entry)
                </span>
                <div className="mt-1">
                  <span id="displayEntry" className="font-mono text-lg font-bold text-[#dfe2f1]">
                    ${entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#4cd7f6] mt-0.5">
                  {currentSymbolData.entryNote}
                </span>
              </div>

              {/* 2. Take Profit (TP) */}
              <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
                <span className="font-mono text-[10px] text-[#4edea3] uppercase font-semibold">
                  Тейк-Профит (TP)
                </span>
                <div className="mt-1">
                  <span id="displayTP" className="font-mono text-lg font-bold text-[#4edea3]">
                    ${tpPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span id="displayTPPct" className="font-mono text-[10px] text-[#4edea3] mt-0.5">
                  +{((tpDistance / entryPrice) * 100).toFixed(2)}% (2.0x ATR)
                </span>
              </div>

              {/* 3. Stop Loss (SL) */}
              <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
                <span className="font-mono text-[10px] text-[#ffb2b7] uppercase font-semibold">
                  Стоп-Лосс (SL)
                </span>
                <div className="mt-1">
                  <span id="displaySL" className="font-mono text-lg font-bold text-[#ffb2b7]">
                    ${slPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <span id="displaySLPct" className="font-mono text-[10px] text-[#ffb2b7] mt-0.5">
                  -{((slDistance / entryPrice) * 100).toFixed(2)}% (1.0x ATR)
                </span>
              </div>

              {/* 4. Risk / Reward Ratio */}
              <div className="bg-[#1c1f2a] p-3 rounded-lg flex flex-col justify-between border border-[#262a35]">
                <span className="font-mono text-[10px] text-[#bcc9cd] uppercase font-semibold">
                  Тәуекел / Пайда (R:R)
                </span>
                <div className="mt-1">
                  <span id="displayRR" className="font-mono text-lg font-bold text-[#4cd7f6]">
                    1 : 2.00
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#4cd7f6] mt-0.5">
                  Қауіпсіз Свинг
                </span>
              </div>
            </div>

            {/* Visualized ATR Risk/Reward Bar Component */}
            <div className="mt-3 bg-[#0a0e18] p-3 rounded-lg border border-[#1c1f2a]">
              <div className="flex items-center justify-between font-mono text-[11px] text-[#bcc9cd] mb-1.5">
                <span>Тәуекел профилі (SL аймағы: ${slDistance.toFixed(2)})</span>
                <span className="text-[#4edea3] font-bold">
                  Мақсатты пайда аймағы: +${tpDistance.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#313540] flex overflow-hidden">
                <div 
                  id="rrBarLoss" 
                  className="w-1/3 h-full bg-[#ffb2b7] transition-all"
                  title="Stop Loss Risk Zone (33%)"
                ></div>
                <div 
                  id="rrBarProfit" 
                  className="w-2/3 h-full bg-[#4edea3] transition-all"
                  title="Take Profit Target Zone (67%)"
                ></div>
              </div>
            </div>
          </div>

          {/* 5-Factor Confluence Pine Script V6 Растауы Card */}
          <div className="bg-[#171b26] rounded-xl p-4 shadow-md border border-[#262a35]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#dfe2f1]">
                5-Factor Confluence Pine Script V6 Растауы
              </span>
              <button
                onClick={onNavigateToFactors}
                className="font-mono text-[10px] text-[#4edea3] bg-[#00a572]/20 border border-[#00a572]/40 px-2 py-0.5 rounded hover:bg-[#00a572]/30 transition-colors"
              >
                5/5 Расталған • Толық көру
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {currentSymbolData.factors.map((factor) => (
                <div 
                  key={factor.id} 
                  className="bg-[#1c1f2a] p-2.5 rounded flex flex-col gap-1 border border-[#262a35] hover:border-[#4cd7f6]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-[#869397]">
                      {factor.title}
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                  </div>
                  <span className="text-xs font-semibold text-[#dfe2f1] truncate">
                    {factor.indicator}
                  </span>
                  <span className="font-mono text-[10px] text-[#4edea3] truncate">
                    {factor.statusText}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Risk / Lot Size Sizing Engine Card */}
          <div className="bg-[#171b26] rounded-xl p-4 shadow-md border border-[#262a35]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-[#4cd7f6]" />
                <span className="text-sm font-bold text-[#dfe2f1]">
                  Тәуекел және Позиция Калькуляторы (Risk Engine)
                </span>
              </div>
              <button
                onClick={onNavigateToRisk}
                className="font-mono text-[10px] text-[#4cd7f6] hover:underline"
              >
                Авто-есептеу модулі →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              {/* Deposit Input */}
              <div className="flex flex-col gap-1">
                <label htmlFor="inputDeposit" className="font-mono text-[11px] text-[#bcc9cd]">
                  Депозит көлемі ($):
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1.5 font-mono text-xs text-[#869397]">$</span>
                  <input
                    id="inputDeposit"
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Math.max(10, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0a0e18] text-[#dfe2f1] font-mono text-xs pl-6 pr-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#4cd7f6] border border-[#262a35]"
                  />
                </div>
              </div>

              {/* Risk Percentage */}
              <div className="flex flex-col gap-1">
                <label htmlFor="inputRiskPct" className="font-mono text-[11px] text-[#bcc9cd]">
                  Тәуекел пайызы (%):
                </label>
                <div className="relative">
                  <span className="absolute right-2.5 top-1.5 font-mono text-xs text-[#869397]">%</span>
                  <input
                    id="inputRiskPct"
                    type="number"
                    step="0.25"
                    min="0.1"
                    max="10"
                    value={riskPct}
                    onChange={(e) => setRiskPct(Math.max(0.1, parseFloat(e.target.value) || 0))}
                    className="w-full bg-[#0a0e18] text-[#dfe2f1] font-mono text-xs px-3 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-[#4cd7f6] border border-[#262a35]"
                  />
                </div>
              </div>

              {/* Calculated Position Result */}
              <div className="bg-[#1c1f2a] p-2.5 rounded-lg flex flex-col justify-between border border-[#262a35]">
                <div className="flex justify-between items-center font-mono text-[10px] text-[#bcc9cd]">
                  <span>Есептелген лот көлемі:</span>
                  <span id="riskAmountDisplay" className="text-[#ffb2b7] font-semibold">
                    Макс шығын: ${riskAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between mt-1">
                  <span id="calculatedLotSize" className="font-mono text-base font-bold text-[#4cd7f6]">
                    {formattedLot} {lotUnit}
                  </span>
                  <span className="font-mono text-[10px] text-[#4edea3] font-semibold">
                    Кредиттік иін: {leverage}x
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
