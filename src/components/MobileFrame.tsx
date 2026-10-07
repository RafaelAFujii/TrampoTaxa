import React from 'react';

interface MobileFrameProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <div className="mb-3 text-xs font-mono font-medium tracking-widest text-zinc-400 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
          {title}
        </div>
      )}

      {/* Device Body */}
      <div className="relative w-[340px] sm:w-[365px] h-[740px] bg-[#000000] rounded-[48px] p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-white/10 overflow-hidden flex flex-col">
        {/* Dynamic Island pill on top */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-40 flex items-center justify-between px-2.5 border border-white/5 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0b0c10] border border-zinc-800" />
          <div className="w-2 h-2 rounded-full bg-[#051a0e]" />
        </div>

        {/* Screen inner content */}
        <div className="w-full h-full rounded-[38px] overflow-hidden bg-[#0A0B0E] relative flex flex-col">
          {children}
        </div>

        {/* Subtle glass reflection gradient */}
        <div className="absolute inset-0 rounded-[48px] pointer-events-none bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.04]" />
      </div>
    </div>
  );
};
