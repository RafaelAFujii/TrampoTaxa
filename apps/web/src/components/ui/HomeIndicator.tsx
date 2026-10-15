import React from 'react';

interface HomeIndicatorProps {
  className?: string;
}

export const HomeIndicator: React.FC<HomeIndicatorProps> = ({ className = '' }) => {
  return (
    <div className={`md:hidden w-full flex justify-center pb-2 pt-3 ${className}`}>
      <div className="w-32 h-1 bg-white/40 rounded-full" />
    </div>
  );
};
