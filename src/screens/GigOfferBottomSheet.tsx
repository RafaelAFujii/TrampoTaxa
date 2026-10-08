import React, { useState } from 'react';
import { 
  Star, 
  MapPin, 
  X, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  Zap, 
  Shirt, 
  Info,
  DollarSign
} from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { GigOffer } from '../types';

export interface GigOfferBottomSheetProps {
  gig: GigOffer | null;
  isOpen?: boolean;
  onAccept: (gig: GigOffer) => void;
  onDecline?: (gig: GigOffer) => void;
  onClose?: () => void;
}

export const GigOfferBottomSheet: React.FC<GigOfferBottomSheetProps> = ({
  gig,
  isOpen = true,
  onAccept,
  onDecline,
  onClose,
}) => {
  const [acknowledgedDressCode, setAcknowledgedDressCode] = useState(false);

  if (!isOpen || !gig) return null;

  const handleDecline = () => {
    if (onDecline) {
      onDecline(gig);
    } else if (onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (onDecline) {
      onDecline(gig);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Click outside backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={handleClose} 
      />

      {/* Modal / Bottom Sheet Container */}
      <div className="relative z-10 w-full sm:max-w-lg bg-[#12141A] border border-white/10 sm:rounded-3xl rounded-t-[32px] p-6 shadow-2xl overflow-hidden flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-zinc-700/80 rounded-full mx-auto -mt-2 mb-1" />

        {/* Header: Categoria e Botão Fechar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              Taxa de {gig.profession}
            </span>
            <span className="bg-[#1C2029] text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-white/5">
              {gig.distance}
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Fechar detalhes da vaga"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. TÍTULO & LOCAL */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {gig.venueName}
            </h2>
            <div className="flex items-center gap-1 bg-[#1A1E27] px-2 py-1 rounded-lg border border-white/5">
              <Star className="w-3.5 h-3.5 fill-[#00E676] text-[#00E676]" />
              <span className="text-xs font-bold text-white">{gig.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Local detalhado */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-[#00E676] shrink-0" />
            <span className="text-zinc-200 font-medium">Local:</span>
            <span>{gig.neighborhood}, Curitiba - PR</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-400">{gig.distance}</span>
          </div>
        </div>

        {/* 2. VALOR DO TURNO & HORÁRIOS */}
        <div className="bg-[#171A22] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-inner">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-[#00E676]" />
              VALOR DA TAXA
            </span>
            <span className="text-3xl font-black text-[#00E676] tracking-tight mt-0.5 drop-shadow-[0_0_12px_rgba(0,230,118,0.3)]">
              {gig.rateFormatted}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium mt-0.5">
              Repasse imediato via PIX ao término
            </span>
          </div>

          <div className="w-px h-12 bg-white/10" />

          <div className="flex flex-col text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-end gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              HORÁRIO
            </span>
            <span className="text-base font-bold text-white mt-0.5">
              {gig.shiftTime}
            </span>
            <span className="text-[11px] text-zinc-400">
              {gig.shiftDuration}
            </span>
          </div>
        </div>

        {/* 3. SPECKIT MICROTRAINING (Diferencial exclusivo em tempo real) */}
        {/* Posicionado diretamente acima do botão principal de 'Aceitar Taxa' */}
        <div className="bg-gradient-to-br from-[#121A16] to-[#151C26] border border-[#00E676]/30 rounded-2xl p-4 text-left flex flex-col gap-2.5 relative overflow-hidden shadow-lg">
          {/* Subtle glow effect */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-[#00E676]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#00E676]/20 border border-[#00E676]/50 flex items-center justify-center text-[#00E676]">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00E676] flex items-center gap-1">
                SPECKIT MICROTRAINING
                <span className="bg-[#00E676]/20 text-[#00E676] text-[9px] px-1.5 py-0.2 rounded font-mono font-bold">
                  LIVE
                </span>
              </span>
            </div>
            <span className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Dica em tempo real
            </span>
          </div>

          <div className="bg-[#0D1015]/80 border border-white/5 rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Shirt className="w-3.5 h-3.5 text-[#00E676] shrink-0" />
              <h4 className="text-xs font-bold text-white">
                {gig.microtraining?.rulesTitle || 'Dress Code & Requisitos do Contratante'}
              </h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed pl-5">
              {gig.microtraining?.description ||
                'Dress code exigido pelo contratante: Camisa preta lisa, calça escura e sapato fechado confortável. Chegue com 15 minutos de antecedência.'}
            </p>
          </div>

          {/* Confirmação rápida de visualização do micro-treinamento */}
          <div 
            onClick={() => setAcknowledgedDressCode(!acknowledgedDressCode)}
            className="flex items-center gap-2.5 cursor-pointer pt-1 select-none"
          >
            <div
              className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                acknowledgedDressCode
                  ? 'bg-[#00E676] text-black shadow-[0_0_8px_#00E676]'
                  : 'border border-zinc-600 bg-black/40'
              }`}
            >
              {acknowledgedDressCode && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span className="text-[11px] text-zinc-300">
              Estou ciente do dress code e requisitos deste contratante.
            </span>
          </div>
        </div>

        {/* 4. BOTÃO PRINCIPAL DE ACEITAR TAXA & RECUSAR */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={handleDecline}
            className="sm:order-1 order-2 flex-1 py-3.5 px-4 rounded-2xl border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
          >
            Recusar Proposta
          </button>

          <div className="sm:order-2 order-1 flex-1">
            <PrimaryButton 
              onClick={() => onAccept(gig)}
              icon={<ShieldCheck className="w-4 h-4 text-black" />}
            >
              ACEITAR TAXA ({gig.rateFormatted})
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
