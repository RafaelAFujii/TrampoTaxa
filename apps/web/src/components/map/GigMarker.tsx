import React from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { GigOffer } from '@trampotaxa/shared';

export interface GigMarkerProps {
  gig: GigOffer;
  isSelected?: boolean;
  onClick: (gig: GigOffer) => void;
  isVectorFallback?: boolean;
}

export interface ClusterMarkerProps {
  count: number;
  lat: number;
  lng: number;
  onClick: () => void;
  isVectorFallback?: boolean;
  xPercent?: number;
  yPercent?: number;
}

/**
 * Coordenadas de referência de Curitiba para cálculo de posições relativas
 */
const CURITIBA_CENTER = { lat: -25.4385, lng: -49.282 };

/**
 * Marcador de Cluster agrupado (exibe a quantidade de taxas na região)
 * Expande e aproxima quando clicado pelo usuário.
 */
export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  count,
  lat,
  lng,
  onClick,
  isVectorFallback = false,
  xPercent,
  yPercent,
}) => {
  const map = useMap();

  if (isVectorFallback) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        style={{
          left: `${xPercent ?? 50}%`,
          top: `${yPercent ?? 50}%`,
          transform: 'translate(-50%, -50%)',
        }}
        className="absolute z-35 cursor-pointer select-none transition-all duration-200 hover:scale-110 active:scale-95"
        title={`${count} taxas agrupadas nesta área. Clique para aproximar.`}
      >
        <div className="relative flex items-center justify-center">
          <span className="w-10 h-10 rounded-full bg-[#00E676]/25 animate-ping absolute" />
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D1117] border-2 border-[#00E676] shadow-[0_0_18px_rgba(0,230,118,0.5)]">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" />
            <span className="text-xs font-black text-white">{count}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00E676]">
              taxas
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Se for Google Maps mas o mapa ainda não estiver instanciado
  if (!map) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{ lat, lng }}
      onClick={onClick}
      zIndex={50}
      title={`${count} taxas agrupadas nesta região. Clique para aproximar.`}
    >
      <div className="relative flex items-center justify-center group cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 select-none">
        <span className="w-11 h-11 rounded-full bg-[#00E676]/25 animate-ping absolute pointer-events-none" />
        <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D1117]/95 backdrop-blur-md border-2 border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.45)] group-hover:border-white transition-colors">
          <span className="w-2 h-2 rounded-full bg-[#00E676] group-hover:bg-white transition-colors" />
          <span className="text-xs font-black text-white">{count}</span>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00E676] group-hover:text-white transition-colors">
            taxas
          </span>
        </div>
      </div>
    </AdvancedMarker>
  );
};

/**
 * Componente de Marcador Individual de Taxa/Vaga (GigMarker)
 */
export const GigMarker: React.FC<GigMarkerProps> = ({
  gig,
  isSelected = false,
  onClick,
  isVectorFallback = false,
}) => {
  const map = useMap();

  // Renderização para o mapa vetorial minimalista (Fallback CSS puro)
  if (isVectorFallback) {
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
            className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-[#00E676]'}`}
          />
          <span>{gig.rateFormatted}</span>
        </div>
      </div>
    );
  }

  // Trava de segurança assíncrona para Google Maps AdvancedMarker
  if (!map) {
    return null;
  }

  // Coordenadas geográficas reais
  const position = gig.latLng || {
    lat: CURITIBA_CENTER.lat + (gig.coords.y - 50) * 0.001,
    lng: CURITIBA_CENTER.lng + (gig.coords.x - 50) * 0.001,
  };

  return (
    <AdvancedMarker
      position={position}
      onClick={() => onClick(gig)}
      zIndex={isSelected ? 100 : 20}
      title={`${gig.profession} • ${gig.venueName} (${gig.rateFormatted})`}
    >
      <div
        className={`px-3 py-1 rounded-full text-xs font-black tracking-tight transition-all duration-200 flex items-center gap-1.5 shadow-lg select-none cursor-pointer ${
          isSelected
            ? 'bg-[#00E676] text-black ring-2 ring-white shadow-[0_0_20px_rgba(0,230,118,0.6)] scale-110'
            : 'bg-[#12141C]/90 backdrop-blur-md text-white border border-white/20 hover:border-[#00E676]/80 hover:scale-105'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : 'bg-[#00E676]'}`} />
        <span>{gig.rateFormatted}</span>
      </div>
    </AdvancedMarker>
  );
};
