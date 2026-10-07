import React from 'react';
import { Star, ShieldAlert, Sparkles, MapPin, X, Clock, Calendar, CheckCircle } from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { GigOffer } from '../types';

interface GigOfferModalProps {
  gig: GigOffer;
  onAccept: (gig: GigOffer) => void;
  onDecline: (gig: GigOffer) => void;
  onClose?: () => void;
}

export const GigOfferBottomSheet: React.FC<GigOfferModalProps> = ({
  gig,
  onAccept,
  onDecline,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={onClose || (() => onDecline(gig))} 
      />

      {/* Modal Card - Bottom sheet on mobile, centered dialog on desktop */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#141519] border border-white/10 sm:rounded-3xl rounded-t-[32px] p-6 shadow-2xl overflow-hidden flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
        {/* Mobile handle indicator */}
        <div className="sm:hidden w-12 h-1 bg-zinc-700/80 rounded-full mx-auto -mt-2 mb-1" />

        {/* Header: Tag + Fechar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
              {gig.profession}
            </span>
            <span className="bg-[#202227] text-zinc-300 text-xs font-medium px-3 py-1 rounded-full border border-white/5">
              {gig.distance}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose || (() => onDecline(gig))}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Venue Information */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {gig.venueName}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <span className="text-[#00E676] flex items-center gap-1 font-bold">
              <Star className="w-3.5 h-3.5 fill-[#00E676] text-[#00E676]" />
              {gig.rating.toFixed(1)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-zinc-400" />
              {gig.neighborhood}, Curitiba
            </span>
          </div>
        </div>

        {/* Rate & Shift Details */}
        <div className="bg-[#1A1C22] border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              VALOR DO TURNO
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#00E676] tracking-tight mt-0.5">
              {gig.rateFormatted}
            </span>
          </div>

          <div className="w-px h-10 bg-white/10" />

          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              HORÁRIO
            </span>
            <span className="text-sm sm:text-base font-bold text-white mt-0.5">
              {gig.shiftTime}
            </span>
            <span className="text-[11px] text-zinc-400">
              {gig.shiftDuration}
            </span>
          </div>
        </div>

        {/* Speckit Microtraining Guidelines */}
        <div className="bg-[#181B20] border border-white/5 rounded-2xl p-4 text-left flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#00E676]/15 border border-[#00E676]/40 flex items-center justify-center text-[#00E676]">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black uppercase text-[#00E676] tracking-wider">
              {gig.microtraining.title}
            </span>
          </div>

          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1">
              {gig.microtraining.rulesTitle}
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {gig.microtraining.description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => onDecline(gig)}
            className="sm:order-1 order-2 flex-1 py-3.5 px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Recusar Proposta
          </button>

          <div className="sm:order-2 order-1 flex-1">
            <PrimaryButton onClick={() => onAccept(gig)}>
              ACEITAR TAXA ({gig.rateFormatted})
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
