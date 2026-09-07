import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  Eye, 
  Layers, 
  Maximize2, 
  RefreshCw, 
  Sliders, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Sparkles
} from 'lucide-react';
import { SymbolData } from '../types';
import { soundManager } from '../utils/audio';

interface ChartTerminalViewProps {
  currentSymbolData: SymbolData;
}

export const ChartTerminalView: React.FC<ChartTerminalViewProps> = ({ currentSymbolData }) => {
  const [timeframe, setTimeframe] = useState<string>('4H');
  const [showFVG, setShowFVG] = useState<boolean>(true);
  const [showBOS, setShowBOS] = useState<boolean>(true);
  const [showOrderBlocks, setShowOrderBlocks] = useState<boolean>(true);
  const [showHMA, setShowHMA] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<any | null>(null);

  // Generate deterministic realistic candles around current symbol price
  const candles = useMemo(() => {
    const list = [];
    const count = 28;
    const base = currentSymbolData.price;
    const volatility = currentSymbolData.atr * 0.35;
    let prevClose = base - (volatility * 4);

    for (let i = 0; i < count; i++) {
      const isUp = i === 12 || i === 18 || i >= 22 ? true : Math.sin(i * 1.3) > -0.2;
      const change = (Math.sin(i * 0.8) + (isUp ? 1 : -0.8)) * (volatility * 0.7);
      const open = prevClose;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * (volatility * 0.5);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.5);
      const volume = Math.floor(1200 + Math.abs(change * 80) + (i === 24 ? 4500 : 0));
      
      list.push({
        index: i,
        time: `${i * 4}:00`,
        open,
        high,
        low,
        close,
        volume,
        isBullish: close >= open
      });
      prevClose = close;
    }
    return list;
  }, [currentSymbolData.price, currentSymbolData.atr, timeframe]);

  // Chart coordinate math
  const minPrice = useMemo(() => Math.min(...candles.map(c => c.low)) * 0.996, [candles]);
  const maxPrice = useMemo(() => Math.max(...candles.map(c => c.high)) * 1.004, [candles]);
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 360;
  const chartWidth = 720;
  const candleSpacing = chartWidth / candles.length;
  const candleWidth = candleSpacing * 0.65;

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  return (
    <div id="chart-terminal-view" className="flex flex-col w-full gap-4 pb-12">
      {/* Top Controls Toolbar */}
      <div className="bg-[#171b26] p-3 rounded-xl border border-[#262a35] flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#4cd7f6] font-bold bg-[#1c1f2a] px-2.5 py-1 rounded border border-[#313540]">
              {currentSymbolData.id}
            </span>
            <span className="font-mono text-sm font-bold text-[#dfe2f1]">
              ${currentSymbolData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="h-4 w-px bg-[#313540]"></div>

          {/* Timeframe selector */}
          <div className="flex items-center bg-[#1c1f2a] p-0.5 rounded border border-[#313540] text-xs font-mono">
            {['15M', '1H', '4H', '1D'].map((tf) => (
              <button
                key={tf}
                onClick={() => {
                  setTimeframe(tf);
                  soundManager.playClick();
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-[#06b6d4] text-[#00424f] font-bold'
                    : 'text-[#bcc9cd] hover:text-[#dfe2f1]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* SMC Overlays Toggle Toolbar */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            onClick={() => setShowFVG(!showFVG)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors border ${
              showFVG ? 'bg-[#00a572]/20 border-[#00a572] text-[#4edea3]' : 'bg-[#1c1f2a] border-[#313540] text-[#869397]'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-[#4edea3]"></span>
            <span>FVG (Gap)</span>
          </button>

          <button
            onClick={() => setShowBOS(!showBOS)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors border ${
              showBOS ? 'bg-[#06b6d4]/20 border-[#06b6d4] text-[#4cd7f6]' : 'bg-[#1c1f2a] border-[#313540] text-[#869397]'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-[#4cd7f6]"></span>
            <span>BOS / CHoCH</span>
          </button>

          <button
            onClick={() => setShowOrderBlocks(!showOrderBlocks)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors border ${
              showOrderBlocks ? 'bg-[#ffb2b7]/20 border-[#ffb2b7] text-[#ffb2b7]' : 'bg-[#1c1f2a] border-[#313540] text-[#869397]'
            }`}
          >
            <span className="w-2 h-2 rounded-sm bg-[#ffb2b7]"></span>
            <span>Order Blocks</span>
          </button>

          <button
            onClick={() => setShowHMA(!showHMA)}
            className={`px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors border ${
              showHMA ? 'bg-[#262a35] border-[#4cd7f6] text-[#4cd7f6]' : 'bg-[#1c1f2a] border-[#313540] text-[#869397]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
            <span>Sniper HMA</span>
          </button>
        </div>
      </div>

      {/* Candlestick Canvas / SVG Terminal */}
      <div className="bg-[#171b26] rounded-xl p-4 border border-[#262a35] shadow-xl relative overflow-hidden">
        {/* Active Candle Hover Info Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#262a35] text-xs font-mono mb-2">
          <div className="flex items-center gap-4 text-[#bcc9cd]">
            <span>O: <strong className="text-[#dfe2f1]">${(hoveredCandle?.open || candles[candles.length - 1].open).toFixed(2)}</strong></span>
            <span>H: <strong className="text-[#dfe2f1]">${(hoveredCandle?.high || candles[candles.length - 1].high).toFixed(2)}</strong></span>
            <span>L: <strong className="text-[#dfe2f1]">${(hoveredCandle?.low || candles[candles.length - 1].low).toFixed(2)}</strong></span>
            <span>C: <strong className="text-[#4edea3]">${(hoveredCandle?.close || candles[candles.length - 1].close).toFixed(2)}</strong></span>
            <span>Vol: <strong className="text-[#4cd7f6]">{(hoveredCandle?.volume || candles[candles.length - 1].volume)} contracts</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#00a572]/20 text-[#4edea3] font-bold text-[11px]">
              D1 INSTITUTIONAL BIAS: BULLISH
            </span>
          </div>
        </div>

        {/* SVG Candlestick Workspace */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-[400px] select-none cursor-crosshair bg-[#0a0e18] rounded-lg border border-[#1c1f2a]"
          >
            {/* Grid horizontal price lines */}
            {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
              const y = chartHeight * ratio;
              const priceLabel = (maxPrice - ratio * priceRange).toFixed(2);
              return (
                <g key={ratio}>
                  <line x1="0" y1={y} x2={chartWidth} y2={y} stroke="#1c1f2a" strokeDasharray="3 3" />
                  <text x={chartWidth - 55} y={y - 4} fill="#869397" fontSize="9" fontFamily="monospace">
                    ${priceLabel}
                  </text>
                </g>
              );
            })}

            {/* Smart Money Concepts: Fair Value Gap (FVG Zone) */}
            {showFVG && (
              <g>
                <rect
                  x={candleSpacing * 17}
                  y={getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.4)}
                  width={candleSpacing * 9}
                  height={Math.max(16, getY(currentSymbolData.entryPrice - currentSymbolData.atr * 0.2) - getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.4))}
                  fill="#4edea3"
                  fillOpacity="0.12"
                  stroke="#4edea3"
                  strokeDasharray="4 2"
                  strokeOpacity="0.6"
                />
                <text
                  x={candleSpacing * 17 + 8}
                  y={getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.4) + 14}
                  fill="#4edea3"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  H4 FVG (Fair Value Gap)
                </text>
              </g>
            )}

            {/* Smart Money Concepts: Order Block (OB Zone) */}
            {showOrderBlocks && (
              <g>
                <rect
                  x={candleSpacing * 8}
                  y={getY(currentSymbolData.entryPrice - currentSymbolData.atr * 0.7)}
                  width={candleSpacing * 8}
                  height={22}
                  fill="#4cd7f6"
                  fillOpacity="0.15"
                  stroke="#4cd7f6"
                  strokeOpacity="0.7"
                />
                <text
                  x={candleSpacing * 8 + 6}
                  y={getY(currentSymbolData.entryPrice - currentSymbolData.atr * 0.7) + 15}
                  fill="#4cd7f6"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  BULLISH ORDER BLOCK (OB)
                </text>
              </g>
            )}

            {/* Break of Structure (BOS Line) */}
            {showBOS && (
              <g>
                <line
                  x1={candleSpacing * 14}
                  y1={getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.8)}
                  x2={chartWidth - 20}
                  y2={getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.8)}
                  stroke="#4cd7f6"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
                <rect
                  x={candleSpacing * 21}
                  y={getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.8) - 16}
                  width="110"
                  height="16"
                  fill="#0a0e18"
                  rx="3"
                  stroke="#4cd7f6"
                  strokeWidth="0.8"
                />
                <text
                  x={candleSpacing * 21 + 6}
                  y={getY(currentSymbolData.entryPrice + currentSymbolData.atr * 0.8) - 4}
                  fill="#4cd7f6"
                  fontSize="9"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  BULLISH BOS (H4)
                </text>
              </g>
            )}

            {/* Sniper HMA Dynamic Trend Curve */}
            {showHMA && (
              <path
                d={candles.map((c, idx) => {
                  const x = idx * candleSpacing + candleWidth / 2;
                  const y = getY(c.close);
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#4edea3"
                strokeWidth="2.5"
                strokeOpacity="0.85"
              />
            )}

            {/* Candlesticks Rendering */}
            {candles.map((c, idx) => {
              const x = idx * candleSpacing;
              const yOpen = getY(c.open);
              const yClose = getY(c.close);
              const yHigh = getY(c.high);
              const yLow = getY(c.low);
              const candleTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(2, Math.abs(yOpen - yClose));
              const color = c.isBullish ? '#4edea3' : '#ffb2b7';

              return (
                <g 
                  key={c.index}
                  onMouseEnter={() => setHoveredCandle(c)}
                  className="cursor-pointer transition-opacity hover:opacity-80"
                >
                  {/* Candle Wick */}
                  <line
                    x1={x + candleWidth / 2}
                    y1={yHigh}
                    x2={x + candleWidth / 2}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x}
                    y={candleTop}
                    width={candleWidth}
                    height={candleHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}

            {/* Entry Price Horizontal Indicator */}
            <line
              x1="0"
              y1={getY(currentSymbolData.entryPrice)}
              x2={chartWidth}
              y2={getY(currentSymbolData.entryPrice)}
              stroke="#4cd7f6"
              strokeWidth="1.2"
              strokeDasharray="4 2"
            />
            <rect
              x={chartWidth - 95}
              y={getY(currentSymbolData.entryPrice) - 10}
              width="90"
              height="20"
              fill="#00424f"
              stroke="#4cd7f6"
              rx="2"
            />
            <text
              x={chartWidth - 90}
              y={getY(currentSymbolData.entryPrice) + 4}
              fill="#4cd7f6"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ENTRY: ${currentSymbolData.entryPrice.toFixed(0)}
            </text>
          </svg>
        </div>

        {/* Legend strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-[#262a35] text-xs font-mono text-[#bcc9cd]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#4edea3]"></span>
              Жасыл майшамдар (Bullish Flow)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#ffb2b7]"></span>
              Қызыл майшамдар (Bearish Pullback)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-[#4edea3]"></span>
              Sniper HMA (Hull Moving Average)
            </span>
          </div>

          <div className="flex items-center gap-1 text-[#4edea3]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Үлгісі: Институционалды Ликвидтілік жинау расталды</span>
          </div>
        </div>
      </div>
    </div>
  );
};
