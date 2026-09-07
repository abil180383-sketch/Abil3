import React, { useState } from 'react';
import { 
  Activity, 
  Volume2, 
  VolumeX, 
  User, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown,
  CheckCircle2
} from 'lucide-react';
import { TabType, MarketTicker } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedSymbol: string;
  onSelectSymbol: (sym: string) => void;
  tickers: MarketTicker[];
  availableSymbols: string[];
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  selectedSymbol,
  onSelectSymbol,
  tickers,
  availableSymbols,
  soundEnabled,
  onToggleSound
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navItems: { id: TabType; label: string }[] = [
    { id: 'chart-terminal', label: 'График талдау / Chart Terminal' },
    { id: 'live-signals', label: 'Свинг сигналдар / Live Signals' },
    { id: '5-factor-confluence', label: '5-Factor Confluence' },
    { id: 'pine-script-v6-model', label: 'Pine Script V6 Модель' },
    { id: 'risk-calc', label: 'Тәуекел калькуляторы / Risk Calc' },
  ];

  return (
    <header id="main-header" className="fixed top-0 left-0 right-0 z-50 bg-[#0a0e18]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.6)] border-b border-[#1c1f2a]">
      {/* Top Market Telemetry Strip */}
      <div className="h-9 px-4 bg-[#171b26] flex items-center justify-between overflow-x-auto text-xs font-mono border-b border-[#1c1f2a]/60">
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[#4edea3] uppercase tracking-widest font-semibold text-[10px]">
              Market Telemetry
            </span>
          </div>

          <div className="flex items-center gap-4">
            {tickers.map((t) => (
              <div 
                key={t.symbol} 
                onClick={() => {
                  const matched = availableSymbols.find(s => s.startsWith(t.symbol.split('/')[0]));
                  if (matched) {
                    onSelectSymbol(matched);
                    soundManager.playClick();
                  }
                }}
                className="flex items-center gap-1.5 cursor-pointer hover:bg-[#262a35]/60 px-1.5 py-0.5 rounded transition-colors"
                title={`${t.symbol} таңдау`}
              >
                <span className="text-[#bcc9cd]">{t.symbol}</span>
                <span className={t.isPositive ? "text-[#4edea3] font-bold" : "text-[#ffb2b7] font-bold"}>
                  {t.price}
                </span>
                <span className={`text-[10px] flex items-center ${t.isPositive ? "text-[#4edea3]" : "text-[#ffb2b7]"}`}>
                  {t.isPositive ? <TrendingUp className="w-3 h-3 mr-0.5 inline" /> : <TrendingDown className="w-3 h-3 mr-0.5 inline" />}
                  {t.changePct}
                </span>
                <span className="text-[#869397] text-[10px] hidden sm:inline">
                  ATR: {t.atr}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 pl-2">
          <div className="flex items-center gap-1.5 bg-[#1c1f2a] px-2 py-0.5 rounded text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            <span className="text-[#4edea3]">Live WebSocket - 12ms</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="h-15 px-4 flex items-center justify-between bg-[#0a0e18]">
        {/* Brand Logo & Active Pair Selector */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div 
            onClick={() => onTabChange('live-signals')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#06b6d4] to-[#00a572] flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <Activity className="w-5 h-5 text-[#003640]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#4cd7f6] group-hover:text-[#acedff] transition-colors leading-none">
                UNIFIED SMC
              </span>
              <span className="text-[10px] font-mono text-[#bcc9cd] tracking-wider uppercase">
                Swing Confluence Engine
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-[#313540] hidden sm:block"></div>

          {/* Active Symbol Switcher Dropdown */}
          <div className="relative">
            <button
              id="symbol-switcher-btn"
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                soundManager.playClick();
              }}
              className="flex items-center gap-2 bg-[#262a35] hover:bg-[#353944] px-2.5 py-1.5 rounded text-xs transition-colors border border-[#3d494c]/50"
            >
              <span className="font-mono text-[10px] text-[#4cd7f6] bg-[#4cd7f6]/10 px-1 py-0.5 rounded font-semibold">
                ACTIVE
              </span>
              <span className="font-mono font-bold text-[#dfe2f1]">
                {selectedSymbol}
              </span>
              <span className="text-[10px] text-[#bcc9cd] hidden md:inline">
                4H / 1D
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#bcc9cd]" />
            </button>

            {dropdownOpen && (
              <div 
                id="symbol-dropdown-menu"
                className="absolute left-0 mt-1.5 w-48 bg-[#1c1f2a] border border-[#313540] rounded-lg shadow-2xl py-1 z-50"
              >
                <div className="px-3 py-1 text-[10px] font-mono text-[#869397] uppercase tracking-wider border-b border-[#262a35]">
                  Қолжетімді активтер
                </div>
                {availableSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => {
                      onSelectSymbol(sym);
                      setDropdownOpen(false);
                      soundManager.playClick();
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between hover:bg-[#262a35] transition-colors ${
                      sym === selectedSymbol ? 'text-[#4cd7f6] bg-[#262a35]/60 font-bold' : 'text-[#dfe2f1]'
                    }`}
                  >
                    <span>{sym}</span>
                    {sym === selectedSymbol && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#4edea3]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav id="header-nav-tabs" className="hidden xl:flex items-center gap-1 flex-shrink-0">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  soundManager.playClick();
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#06b6d4] text-[#00424f] shadow-[0_0_12px_rgba(6,182,212,0.3)] font-bold'
                    : 'text-[#bcc9cd] hover:text-[#dfe2f1] hover:bg-[#262a35]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools: Sound, Execution State, Profile */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            id="btn-sound-toggle"
            onClick={onToggleSound}
            className={`flex items-center justify-center w-8 h-8 rounded bg-[#1c1f2a] hover:bg-[#353944] transition-colors ${
              soundEnabled ? 'text-[#4cd7f6]' : 'text-[#869397]'
            }`}
            title={soundEnabled ? 'Дыбысты өшіру' : 'Дыбысты қосу'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#4cd7f6]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#869397]" />
            )}
          </button>

          <div className="h-6 w-px bg-[#313540]"></div>

          <div className="flex items-center gap-2">
            <div className="flex flex-col text-right hidden sm:flex">
              <span className="font-mono text-[10px] text-[#dfe2f1] font-semibold">
                INST-SWING #042
              </span>
              <span className="font-mono text-[10px] text-[#4edea3] font-bold">
                EXECUTION READY
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#4cd7f6] flex items-center justify-center text-[#003640] font-bold shadow-[0_0_10px_rgba(76,215,246,0.3)]">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar for Small Screens */}
      <div className="xl:hidden flex items-center gap-1 px-3 py-2 bg-[#171b26] overflow-x-auto border-t border-[#1c1f2a]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onTabChange(item.id);
              soundManager.playClick();
            }}
            className={`px-2.5 py-1 text-[11px] font-medium whitespace-nowrap rounded ${
              currentTab === item.id
                ? 'bg-[#06b6d4] text-[#00424f] font-bold'
                : 'text-[#bcc9cd] hover:text-[#dfe2f1] bg-[#1c1f2a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
