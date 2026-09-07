import React, { useState, useEffect } from 'react';

export const Footer: React.FC = () => {
  const [utcTime, setUtcTime] = useState<string>('00:00:00 UTC');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="main-footer" className="w-full bg-[#0a0e18] py-3 border-t border-[#1c1f2a] mt-auto">
      <div className="w-full px-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-[#bcc9cd] uppercase text-[11px] font-semibold">
            © 2024 UNIFIED SMC ENGINE • ALGORITHMIC INSTITUTIONAL TRADING
          </span>
          <span className="text-[#869397] text-[10px] hidden sm:inline">
            ENGINE V6.4.2 PRO
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
            <span className="text-[#bcc9cd] text-[11px]">CORE MATCHING: OPTIMAL</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[#869397] text-[11px]">SERVER TIME:</span>
            <span id="utc-clock-display" className="text-[#dfe2f1] font-bold text-[12px]">
              {utcTime}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
