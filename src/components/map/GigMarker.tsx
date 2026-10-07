import React from 'react';
import { GigOffer } from '../../types';

interface GigMarkerProps {
  gig: GigOffer;
  isSelected?: boolean;
  onClick: (gig: GigOffer) => void;
}

export const GigMarker: React.FC<GigMarkerProps> = ({
  gig,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick(gig);
      }}
      style={{
        left: `${gig.coords.x}%`,
        top: `${gig.coords.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`absolute z-30 cursor-pointer select-none transition-all duration-200 ${
        isSelected ? 'z-40 scale-110' : 'hover:scale-105'
      }`}
    >
      <div
        className={`px-3 py-1 rounded-full text-xs font-black tracking-tight transition-all flex items-center gap-1.5 shadow-lg ${
          isSelected
            ? 'bg-[#00E676] text-black ring-2 ring-white shadow-[0_0_20px_rgba(0,230,118,0.6)]'
            : 'bg-[#12141C]/90 backdrop-blur-md text-white border border-white/20 hover:border-[#00E676]/80'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isSelected ? 'bg-black' : 'bg-[#00E676]'
          }`}
        />
        <span>{gig.rateFormatted}</span>
      </div>
    </div>
  );
};
