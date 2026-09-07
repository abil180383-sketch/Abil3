import React, { useState } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PINE_SCRIPT_V6_CODE } from '../data/mockData';
import { soundManager } from '../utils/audio';

export const PineScriptViewModel: React.FC = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PINE_SCRIPT_V6_CODE);
    setCopied(true);
    soundManager.playSuccess();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([PINE_SCRIPT_V6_CODE], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Unified_SMC_Swing_V6.pine';
    link.click();
    URL.revokeObjectURL(url);
    soundManager.playSuccess();
  };

  const lines = PINE_SCRIPT_V6_CODE.trim().split('\n');

  return (
    <div id="pine-script-view-model" className="flex flex-col w-full gap-4 pb-12">
      {/* Top Header Card */}
      <div className="bg-[#171b26] p-5 rounded-xl border border-[#262a35] shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#00a572]/20 flex items-center justify-center text-[#4edea3] shadow-[0_0_20px_rgba(78,222,163,0.3)]">
            <Terminal className="w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-[#dfe2f1]">
                Pine Script V6 Моделі мен Стратегиясы
              </span>
              <span className="px-2.5 py-0.5 rounded bg-[#00a572]/20 text-[#4edea3] font-mono text-xs font-bold border border-[#00a572]/40">
                v6.4.2 PRO
              </span>
            </div>
            <span className="text-xs text-[#bcc9cd] mt-0.5">
              TradingView Pine Editor 6 нұсқасына тікелей үйлесімді толық автоматтандырылған индикатор коды.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-[#262a35] hover:bg-[#353944] text-[#dfe2f1] px-3.5 py-2 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#3d494c]"
          >
            <Download className="w-4 h-4 text-[#4cd7f6]" />
            <span>.pine жүктеу</span>
          </button>

          <button
            onClick={handleCopy}
            className="bg-[#4cd7f6] hover:bg-[#06b6d4] text-[#003640] px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(76,215,246,0.3)]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#003640]" />
                <span>Көшірілді!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Кодты көшіру</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor Container */}
      <div className="bg-[#0a0e18] rounded-xl border border-[#262a35] shadow-2xl overflow-hidden">
        {/* Editor Titlebar */}
        <div className="bg-[#171b26] px-4 py-2.5 border-b border-[#262a35] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#bcc9cd]">
            <span className="w-3 h-3 rounded-full bg-[#ffb2b7]/60 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffdadb]/40 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#4edea3]/60 inline-block"></span>
            <span className="ml-2 text-[#dfe2f1] font-semibold">Unified_SMC_Confluence_V6.pine</span>
          </div>

          <span className="text-[#869397] text-[11px]">
            {lines.length} жол • TradingView Pine Script v6
          </span>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto max-h-[550px] font-mono text-xs leading-relaxed">
          <pre className="table">
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const isComment = line.trim().startsWith('//');
              const isHeading = line.includes('═════') || line.includes('───');
              const isPlot = line.includes('plot') || line.includes('box.new');

              let textColor = 'text-[#dfe2f1]';
              if (isComment) textColor = 'text-[#869397]';
              if (isHeading) textColor = 'text-[#4cd7f6] font-bold';
              if (isPlot) textColor = 'text-[#4edea3]';

              return (
                <div key={lineNum} className="table-row hover:bg-[#1c1f2a]/50">
                  <span className="table-cell pr-4 text-right select-none text-[#869397]/50 text-[11px] w-10">
                    {lineNum}
                  </span>
                  <span className={`table-cell whitespace-pre ${textColor}`}>
                    {line}
                  </span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Instructions Guide */}
      <div className="bg-[#171b26] p-4 rounded-xl border border-[#262a35] flex flex-col gap-2 text-xs">
        <div className="flex items-center gap-2 font-bold text-[#dfe2f1]">
          <BookOpen className="w-4 h-4 text-[#4cd7f6]" />
          <span>TradingView-ге қалай қосуға болады:</span>
        </div>
        <ol className="list-decimal list-inside text-[#bcc9cd] space-y-1 pl-1 leading-relaxed">
          <li>Жоғарыдағы «Кодты көшіру» түймесін басыңыз.</li>
          <li>TradingView сайтында кез келген графикке өтіп, төменгі панельден <strong>Pine Editor</strong> қойындысын ашыңыз.</li>
          <li>«Open» басып, барлық мәтінді тазалап, осы кодты қойыңыз.</li>
          <li><strong>«Add to chart»</strong> (Графикке қосу) түймесін басыңыз.</li>
          <li>Барлық 5-факторлы свинг сигналдар, FVG теңсіздік аймақтары және динамикалық Stop-Loss / Take-Profit автоматты түрде пайда болады.</li>
        </ol>
      </div>
    </div>
  );
};
