import React from 'react';
import { AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { GigOffer } from '../../types';

export interface GigMarkerProps {
  gig: GigOffer;
  isSelected?: boolean;
  onClick: (gig: GigOffer) => void;
  isVectorFallback?: boolean;
}

/**
 * Coordenadas de referência de Curitiba para cálculo de posições relativas
 */
const CURITIBA_CENTER = { lat: -25.4385, lng: -49.2820 };

/**
 * Componente de Marcador de Taxa/Vaga (GigMarker)
 * Suporta:
 * 1. Google Maps AdvancedMarker com trava assíncrona (useMap) para evitar colapsos e erros no ErrorBoundary
 * 2. Fallback vetorial minimalista para ambiente sem API ou offline
 */
export const GigMarker: React.FC<GigMarkerProps> = ({
  gig,
  isSelected = false,
  onClick,
  isVectorFallback = false,
}) => {
  // Hook nativo da biblioteca oficial @vis.gl/react-google-maps
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
            className={`w-1.5 h-1.5 rounded-full ${
              isSelected ? 'bg-black' : 'bg-[#00E676]'
            }`}
          />
          <span>{gig.rateFormatted}</span>
        </div>
      </div>
    );
  }

  // Trava de segurança assíncrona (Requisito 2):
  // Impede renderização antecipada do AdvancedMarker antes que a instância
  // do Google Maps e seu WebGL/mapId estejam 100% instanciados.
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
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isSelected ? 'bg-black' : 'bg-[#00E676]'
          }`}
        />
        <span>{gig.rateFormatted}</span>
      </div>
    </AdvancedMarker>
  );
};

