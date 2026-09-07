import { MarketTicker, SymbolData, ConfluenceFactor } from '../types';

export const MARKET_TICKERS: MarketTicker[] = [
  { symbol: 'BTC/USDT', price: '$67,482.50', changePct: '+3.24%', isPositive: true, atr: '1420' },
  { symbol: 'ETH/USDT', price: '$3,540.20', changePct: '+1.85%', isPositive: true, atr: '84.5' },
  { symbol: 'SOL/USDT', price: '$182.15', changePct: '-0.62%', isPositive: false, atr: '9.8' },
  { symbol: 'XAU/USD', price: '$2,388.40', changePct: '+0.45%', isPositive: true, atr: '18.2' },
  { symbol: 'EUR/USD', price: '1.0842', changePct: '-0.12%', isPositive: false, atr: '0.0054' },
];

export const DEFAULT_FACTORS: ConfluenceFactor[] = [
  {
    id: 1,
    title: 'ФАКТОР 1',
    indicator: 'Momentum',
    statusText: 'RSI Bullish (64.2)',
    value: '64.2',
    passed: true,
    description: 'RSI (14) 50-ден жоғары және өсу трендімен динамикалық растау алды.'
  },
  {
    id: 2,
    title: 'ФАКТОР 2',
    indicator: 'Sniper HMA',
    statusText: 'Тренд жасыл (Up)',
    value: 'Bullish Vector',
    passed: true,
    description: 'Hull Moving Average 9 кезеңдік сүзгісі жасыл түске боялып, институционалды импульсті көрсетеді.'
  },
  {
    id: 3,
    title: 'ФАКТОР 3',
    indicator: 'Volatility',
    statusText: 'Green Light Қосулы',
    value: 'Active Expansion',
    passed: true,
    description: 'ATR және Bollinger Band қысылуынан кейінгі күшті импульсті серпіліс.'
  },
  {
    id: 4,
    title: 'ФАКТОР 4',
    indicator: 'MACD Wave',
    statusText: '0-ден жоғары қиылыс',
    value: '+142.8',
    passed: true,
    description: 'MACD гистограммасы нөл сызығын кесіп өтіп, оң аймақта экспоненциалды ұлғаюда.'
  },
  {
    id: 5,
    title: 'ФАКТОР 5',
    indicator: 'Structure BOS',
    statusText: 'Нөлдік өтім расталды',
    value: 'Break of Structure',
    passed: true,
    description: 'D1/H4 негізгі қарсылық деңгейі институционалды көлеммен бұзылып (BOS), FVG аймағы сыналды.'
  }
];

export const SYMBOLS_DATA: Record<string, SymbolData> = {
  'BTC/USDT.P': {
    id: 'BTC/USDT.P',
    name: 'Bitcoin Perpetual',
    pair: 'BTC/USDT.P',
    timeframe: '4 сағат (4H)',
    price: 63850.00,
    atr: 840.20,
    direction: 'BUY',
    entryPrice: 63850.00,
    takeProfit: 65530.40,
    stopLoss: 63009.80,
    rrRatio: '1 : 2.00',
    entryNote: 'Оптималды FVG Тест',
    confluenceScore: 5,
    maxConfluence: 5,
    factors: DEFAULT_FACTORS,
    fvgZone: 'H4 FVG (Fair Value Gap)',
    bosPattern: 'D1 BULLISH BOS ТАБЫЛДЫ',
    sweepVolume: '+248% Institutional Sweep',
    aiConfidence: 98.4,
    chartImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8mZRsjPmkAsHz-chWH_cmKHyXNH6BL7woe4m3VQnaAmAtM0CT1Q3e4WLg4tOdNE-gXT8_-Ubkl3ZhrgdzOqICXfYvcnbqobxaY2QjJ2l0OJx8g7kDraqHt0WJmP1xJReZe818o-Rsc2Qa93Jf6Dsf_mP_RL0sQwcOsp43dZ85LBy1Zz8-XGmbg4X987E4hQYzf0gA3YFMw3T0VxiRnoFGJltD5lfojy3pzwLGk5aGQvI14Qd6mNM'
  },
  'ETH/USDT.P': {
    id: 'ETH/USDT.P',
    name: 'Ethereum Perpetual',
    pair: 'ETH/USDT.P',
    timeframe: '1 сағат (1H)',
    price: 3540.20,
    atr: 42.10,
    direction: 'BUY',
    entryPrice: 3540.20,
    takeProfit: 3624.40,
    stopLoss: 3498.10,
    rrRatio: '1 : 2.00',
    entryNote: 'Bullish Order Block Тест',
    confluenceScore: 5,
    maxConfluence: 5,
    factors: DEFAULT_FACTORS.map(f => ({ ...f })),
    fvgZone: 'H1 FVG 50% Mitigated',
    bosPattern: 'H4 BULLISH BOS РАСТАЛДЫ',
    sweepVolume: '+185% Volume Surge',
    aiConfidence: 96.2,
    chartImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8mZRsjPmkAsHz-chWH_cmKHyXNH6BL7woe4m3VQnaAmAtM0CT1Q3e4WLg4tOdNE-gXT8_-Ubkl3ZhrgdzOqICXfYvcnbqobxaY2QjJ2l0OJx8g7kDraqHt0WJmP1xJReZe818o-Rsc2Qa93Jf6Dsf_mP_RL0sQwcOsp43dZ85LBy1Zz8-XGmbg4X987E4hQYzf0gA3YFMw3T0VxiRnoFGJltD5lfojy3pzwLGk5aGQvI14Qd6mNM'
  },
  'SOL/USDT.P': {
    id: 'SOL/USDT.P',
    name: 'Solana Perpetual',
    pair: 'SOL/USDT.P',
    timeframe: '4 сағат (4H)',
    price: 182.15,
    atr: 4.60,
    direction: 'SELL',
    entryPrice: 182.15,
    takeProfit: 172.95,
    stopLoss: 186.75,
    rrRatio: '1 : 2.00',
    entryNote: 'Bearish Liquidity Sweep',
    confluenceScore: 4,
    maxConfluence: 5,
    factors: [
      { id: 1, title: 'ФАКТОР 1', indicator: 'Momentum', statusText: 'RSI Bearish (38.4)', value: '38.4', passed: true, description: 'RSI төмендеу бағытында' },
      { id: 2, title: 'ФАКТОР 2', indicator: 'Sniper HMA', statusText: 'Тренд қызыл (Down)', value: 'Bearish Vector', passed: true, description: 'HMA қызыл трендте' },
      { id: 3, title: 'ФАКТОР 3', indicator: 'Volatility', statusText: 'Breakdown Expansion', value: 'High', passed: true, description: 'Қарқынды сату импульсі' },
      { id: 4, title: 'ФАКТОР 4', indicator: 'MACD Wave', statusText: '0-ден төмен қиылыс', value: '-8.4', passed: true, description: 'MACD төмен қарай қозғалуда' },
      { id: 5, title: 'ФАКТОР 5', indicator: 'Structure BOS', statusText: 'CHoCH төмен бұзылу', value: 'Bearish Sweep', passed: true, description: 'Сұраныс аймағы бұзылды' }
    ],
    fvgZone: 'H4 Bearish FVG Imbalance',
    bosPattern: 'D1 BEARISH CHoCH ТАБЫЛДЫ',
    sweepVolume: '+310% Bearish Dump Volume',
    aiConfidence: 94.8,
    chartImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8mZRsjPmkAsHz-chWH_cmKHyXNH6BL7woe4m3VQnaAmAtM0CT1Q3e4WLg4tOdNE-gXT8_-Ubkl3ZhrgdzOqICXfYvcnbqobxaY2QjJ2l0OJx8g7kDraqHt0WJmP1xJReZe818o-Rsc2Qa93Jf6Dsf_mP_RL0sQwcOsp43dZ85LBy1Zz8-XGmbg4X987E4hQYzf0gA3YFMw3T0VxiRnoFGJltD5lfojy3pzwLGk5aGQvI14Qd6mNM'
  },
  'XAU/USD': {
    id: 'XAU/USD',
    name: 'Gold vs US Dollar',
    pair: 'XAU/USD',
    timeframe: '1 күн (1D)',
    price: 2388.40,
    atr: 24.50,
    direction: 'BUY',
    entryPrice: 2388.40,
    takeProfit: 2437.40,
    stopLoss: 2363.90,
    rrRatio: '1 : 2.00',
    entryNote: 'Daily Order Block Bounce',
    confluenceScore: 5,
    maxConfluence: 5,
    factors: DEFAULT_FACTORS,
    fvgZone: 'Daily Fair Value Gap',
    bosPattern: 'W1 MACRO BULLISH BOS',
    sweepVolume: '+192% Institutional Inflow',
    aiConfidence: 99.1,
    chartImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8mZRsjPmkAsHz-chWH_cmKHyXNH6BL7woe4m3VQnaAmAtM0CT1Q3e4WLg4tOdNE-gXT8_-Ubkl3ZhrgdzOqICXfYvcnbqobxaY2QjJ2l0OJx8g7kDraqHt0WJmP1xJReZe818o-Rsc2Qa93Jf6Dsf_mP_RL0sQwcOsp43dZ85LBy1Zz8-XGmbg4X987E4hQYzf0gA3YFMw3T0VxiRnoFGJltD5lfojy3pzwLGk5aGQvI14Qd6mNM'
  },
  'EUR/USD': {
    id: 'EUR/USD',
    name: 'Euro / US Dollar',
    pair: 'EUR/USD',
    timeframe: '4 сағат (4H)',
    price: 1.0842,
    atr: 0.0054,
    direction: 'SELL',
    entryPrice: 1.0842,
    takeProfit: 1.0734,
    stopLoss: 1.0896,
    rrRatio: '1 : 2.00',
    entryNote: 'London Liquidity Sweep',
    confluenceScore: 4,
    maxConfluence: 5,
    factors: DEFAULT_FACTORS.map(f => ({ ...f, passed: f.id !== 3 })),
    fvgZone: 'H4 Bearish Imbalance',
    bosPattern: 'H4 LIQUIDITY SWEEP',
    sweepVolume: '+140% Sweep Inflow',
    aiConfidence: 93.5,
    chartImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg8mZRsjPmkAsHz-chWH_cmKHyXNH6BL7woe4m3VQnaAmAtM0CT1Q3e4WLg4tOdNE-gXT8_-Ubkl3ZhrgdzOqICXfYvcnbqobxaY2QjJ2l0OJx8g7kDraqHt0WJmP1xJReZe818o-Rsc2Qa93Jf6Dsf_mP_RL0sQwcOsp43dZ85LBy1Zz8-XGmbg4X987E4hQYzf0gA3YFMw3T0VxiRnoFGJltD5lfojy3pzwLGk5aGQvI14Qd6mNM'
  }
};

export const PINE_SCRIPT_V6_CODE = `//@version=6
// ═════════════════════════════════════════════════════════════════════════════════
// UNIFIED SMC SWING CONFLUENCE ENGINE V6 - ALGORITHMIC INSTITUTIONAL SYSTEM
// ═════════════════════════════════════════════════════════════════════════════════
indicator("Unified SMC Swing Confluence Engine [V6 PRO]", overlay=true, max_boxes_count=500, max_lines_count=500)

// ─── ИНПУТТАР ЖӘНЕ БАПТАУЛАР ───
grp_smc = "1. Smart Money Concepts (SMC) Баптаулары"
show_fvg = input.bool(true, "FVG (Fair Value Gaps) көрсету", group=grp_smc)
show_bos = input.bool(true, "BOS / CHoCH деңгейлерін белгілеу", group=grp_smc)
show_ob  = input.bool(true, "Институционалды Order Blocks (OB)", group=grp_smc)
swing_len = input.int(5, "Swing High/Low ұзындығы", minval=2, maxval=20, group=grp_smc)

grp_factors = "2. 5-Factor Confluence сүзгілері"
use_rsi = input.bool(true, "Factor 1: RSI Momentum (64.2 Bullish / 35.8 Bearish)", group=grp_factors)
use_hma = input.bool(true, "Factor 2: Sniper Hull Moving Average (HMA Trend)", group=grp_factors)
use_vol = input.bool(true, "Factor 3: Volatility Expansion (ATR Green Light)", group=grp_factors)
use_macd= input.bool(true, "Factor 4: MACD Wave 0-Cross Flow", group=grp_factors)
use_bos = input.bool(true, "Factor 5: Structure BOS / CHoCH Validation", group=grp_factors)

grp_risk = "3. Тәуекел және Позиция Параметрлері"
atr_mult_tp = input.float(2.0, "Take Profit ATR Көбейткіші (2.0x)", group=grp_risk)
atr_mult_sl = input.float(1.0, "Stop Loss ATR Көбейткіші (1.0x)", group=grp_risk)
atr_period  = input.int(14, "ATR Периоды", group=grp_risk)

// ─── 1-ФАКТОР: MOMENTUM (RSI) ───
rsi_val = ta.rsi(close, 14)
rsi_bull = rsi_val > 52 and rsi_val < 72
rsi_bear = rsi_val < 48 and rsi_val > 28

// ─── 2-ФАКТОР: SNIPER HMA ───
hma_len = 9
hma_val = ta.wma(2 * ta.wma(close, hma_len / 2) - ta.wma(close, hma_len), math.round(math.sqrt(hma_len)))
hma_bull = hma_val > hma_val[1]
hma_color = hma_bull ? color.new(#4edea3, 0) : color.new(#ffb2b7, 0)
plot(hma_val, "Sniper HMA", color=hma_color, linewidth=2)

// ─── 3-ФАКТОР: VOLATILITY (ATR GREEN LIGHT) ───
atr_val = ta.atr(atr_period)
atr_ma = ta.sma(atr_val, 20)
vol_expansion = atr_val > atr_ma

// ─── 4-ФАКТОР: MACD WAVE FLOW ───
[macd_line, macd_signal, macd_hist] = ta.macd(close, 12, 26, 9)
macd_bull = macd_hist > 0 and macd_line > macd_signal
macd_bear = macd_hist < 0 and macd_line < macd_signal

// ─── 5-ФАКТОР: SMC STRUCTURE BOS & FVG ───
ph = ta.pivothigh(high, swing_len, swing_len)
pl = ta.pivotlow(low, swing_len, swing_len)
var float last_ph = na
var float last_pl = na
if not na(ph)
    last_ph := ph
if not na(pl)
    last_pl := pl

bos_bull = ta.crossover(close, last_ph)
bos_bear = ta.crossunder(close, last_pl)

// Fair Value Gap (FVG) Detection
fvg_bull = low > high[2]
fvg_bear = high < low[2]

if fvg_bull and show_fvg
    box.new(bar_index[2], high[2], bar_index, low, border_color=color.new(#4edea3, 60), bgcolor=color.new(#4edea3, 85))
if fvg_bear and show_fvg
    box.new(bar_index[2], low[2], bar_index, high, border_color=color.new(#ffb2b7, 60), bgcolor=color.new(#ffb2b7, 85))

// ─── 5-ФАКТОРЛЫҚ КОНФЛЮЕНС ЖИНАҚТАУ ───
int bull_score = (rsi_bull ? 1 : 0) + (hma_bull ? 1 : 0) + (vol_expansion ? 1 : 0) + (macd_bull ? 1 : 0) + (bos_bull or fvg_bull ? 1 : 0)
int bear_score = (rsi_bear ? 1 : 0) + (not hma_bull ? 1 : 0) + (vol_expansion ? 1 : 0) + (macd_bear ? 1 : 0) + (bos_bear or fvg_bear ? 1 : 0)

// ─── СИГНАЛДАРДЫ ГЕНЕРАЦИЯЛАУ (5/5 НЕ 4/5 ОҢТАЙЛЫ) ───
bool long_condition = bull_score >= 4 and (bos_bull or fvg_bull)
bool short_condition = bear_score >= 4 and (bos_bear or fvg_bear)

// Динамикалық TP және SL
var float tp_price = na
var float sl_price = na
if long_condition and not long_condition[1]
    tp_price := close + (atr_val * atr_mult_tp)
    sl_price := close - (atr_val * atr_mult_sl)
    alert("UNIFIED SMC BUY: " + str.tostring(close) + " TP: " + str.tostring(tp_price) + " SL: " + str.tostring(sl_price), alert.freq_once_per_bar_close)

plotshape(long_condition and not long_condition[1], "BUY SIGNAL", shape.labelup, location.belowbar, color=#4edea3, text="BUY 5/5", textcolor=#003824, size=size.normal)
plotshape(short_condition and not short_condition[1], "SELL SIGNAL", shape.labeldown, location.abovebar, color=#ffb2b7, text="SELL 5/5", textcolor=#67001b, size=size.normal)
`;
