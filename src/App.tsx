import React, { useState, useEffect } from 'react';
import { TabType, MarketTicker } from './types';
import { MARKET_TICKERS, SYMBOLS_DATA } from './data/mockData';
import { Header } from './components/Header';
import { LiveSignalsView } from './components/LiveSignalsView';
import { ChartTerminalView } from './components/ChartTerminalView';
import { ConfluenceFactorsView } from './components/ConfluenceFactorsView';
import { PineScriptViewModel } from './components/PineScriptViewModel';
import { RiskCalcView } from './components/RiskCalcView';
import { Footer } from './components/Footer';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('live-signals');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USDT.P');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [tickers, setTickers] = useState<MarketTicker[]>(MARKET_TICKERS);

  const availableSymbols = Object.keys(SYMBOLS_DATA);
  const currentSymbolData = SYMBOLS_DATA[selectedSymbol] || SYMBOLS_DATA['BTC/USDT.P'];

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.enabled = next;
    if (next) soundManager.playSuccess();
  };

  // Subtle live price simulation for market telemetry to feel authentic
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          if (Math.random() > 0.6) {
            const isBtc = t.symbol.includes('BTC');
            const isEth = t.symbol.includes('ETH');
            const delta = isBtc ? (Math.random() * 8 - 3.8) : isEth ? (Math.random() * 1.5 - 0.7) : (Math.random() * 0.1 - 0.05);
            const num = parseFloat(t.price.replace(/[$,]/g, '')) + delta;
            return {
              ...t,
              price: isBtc || isEth 
                ? `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` 
                : num > 10 ? `$${num.toFixed(2)}` : num.toFixed(4)
            };
          }
          return t;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="unified-smc-app" className="min-h-screen flex flex-col bg-[#0f131d] text-[#dfe2f1] font-sans antialiased selection:bg-[#06b6d4]/30 selection:text-[#4cd7f6]">
      {/* Persistent Global Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={setSelectedSymbol}
        tickers={tickers}
        availableSymbols={availableSymbols}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Workspace Container */}
      <main id="main-content" className="flex-1 w-full pt-28 px-4 max-w-[1600px] mx-auto transition-all">
        {currentTab === 'live-signals' && (
          <LiveSignalsView
            currentSymbolData={currentSymbolData}
            onSelectSymbol={setSelectedSymbol}
            onNavigateToRisk={() => setCurrentTab('risk-calc')}
            onNavigateToFactors={() => setCurrentTab('5-factor-confluence')}
          />
        )}

        {currentTab === 'chart-terminal' && (
          <ChartTerminalView currentSymbolData={currentSymbolData} />
        )}

        {currentTab === '5-factor-confluence' && (
          <ConfluenceFactorsView
            currentSymbolData={currentSymbolData}
            onNavigateToPineScript={() => setCurrentTab('pine-script-v6-model')}
          />
        )}

        {currentTab === 'pine-script-v6-model' && (
          <PineScriptViewModel />
        )}

        {currentTab === 'risk-calc' && (
          <RiskCalcView currentSymbolData={currentSymbolData} />
        )}
      </main>

      {/* Global Terminal Footer */}
      <Footer />
    </div>
  );
}
