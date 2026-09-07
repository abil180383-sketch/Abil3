export type SignalDirection = 'BUY' | 'SELL';

export type TabType = 
  | 'live-signals' 
  | 'chart-terminal' 
  | '5-factor-confluence' 
  | 'pine-script-v6-model' 
  | 'risk-calc';

export interface MarketTicker {
  symbol: string;
  price: string;
  changePct: string;
  isPositive: boolean;
  atr: string;
}

export interface ConfluenceFactor {
  id: number;
  title: string;
  indicator: string;
  statusText: string;
  value: string;
  passed: boolean;
  description: string;
}

export interface SymbolData {
  id: string;
  name: string;
  pair: string;
  timeframe: string;
  price: number;
  atr: number;
  direction: SignalDirection;
  entryPrice: number;
  takeProfit: number;
  stopLoss: number;
  rrRatio: string;
  entryNote: string;
  confluenceScore: number;
  maxConfluence: number;
  factors: ConfluenceFactor[];
  fvgZone: string;
  bosPattern: string;
  sweepVolume: string;
  aiConfidence: number;
  chartImage: string;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  isBullish: boolean;
}
