import React from 'react';
import { Wifi, Battery } from 'lucide-react';

interface StatusBarProps {
  time?: string;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ time = '9:41', className = '' }) => {
  return (
    <div className={`md:hidden w-full flex items-center justify-between px-6 pt-3 pb-1 select-none text-white text-xs font-semibold tracking-tight z-30 ${className}`}>
      <span>{time}</span>
      <div className="flex items-center space-x-1.5">
        <svg className="w-3.5 h-3 fill-current text-white" viewBox="0 0 16 12">
          <rect x="0" y="9" width="2.5" height="3" rx="0.5" />
          <rect x="4" y="6.5" width="2.5" height="5.5" rx="0.5" />
          <rect x="8" y="3.5" width="2.5" height="8.5" rx="0.5" />
          <rect x="12" y="0.5" width="2.5" height="11.5" rx="0.5" />
        </svg>
        <Wifi className="w-3.5 h-3.5 text-white" />
        <Battery className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};
