import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Map,
  AdvancedMarker,
  useMap,
  useApiIsLoaded,
  ColorScheme,
} from '@vis.gl/react-google-maps';
import { Navigation, WifiOff, Loader2 } from 'lucide-react';
import { GigOffer } from '../../types';
import { GigMarker } from './GigMarker';
import { GOOGLE_MAPS_API_KEY } from '../../constants/maps';
import { ErrorBoundary } from '../ErrorBoundary';

interface MapPlaceholderProps {
  gigs: GigOffer[];
  selectedGigId?: string;
  onSelectGig: (gig: GigOffer) => void;
  isOnline?: boolean;
}

// Coordenadas centrais de Curitiba (Batel / Centro)
const CURITIBA_CENTER = { lat: -25.4385, lng: -49.2820 };
const USER_LOCATION = { lat: -25.4390, lng: -49.2810 };

// MapId válido obrigatório para WebGL e AdvancedMarkerElement na Google Maps API
const GOOGLE_MAP_ID = 'DEMO_MAP_ID';

/**
 * Botão minimalista flutuante para recentralizar o Google Map
 */
function MapRecenterControl() {
  const map = useMap();

  const handleRecenter = () => {
    if (!map) return;
    map.panTo(CURITIBA_CENTER);
    map.setZoom(13.5);
  };

  return (
    <button
      type="button"
      onClick={handleRecenter}
      className="w-10 h-10 rounded-full bg-[#12141C]/90 hover:bg-[#1C202C] text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all cursor-pointer hover:border-[#00E676]/40"
      title="Recentralizar radar em Curitiba"
    >
      <Navigation className="w-4 h-4 text-[#00E676]" />
    </button>
  );
}

/**
 * Marcador de localização do usuário com guarda de segurança assíncrona (useMap)
 */
function UserLocationMarker({ isOnline }: { isOnline: boolean }) {
  const map = useMap();

  if (!map) return null;

  return (
    <AdvancedMarker position={USER_LOCATION} title="Sua localização" zIndex={60}>
      <div className="relative flex items-center justify-center pointer-events-none">
        <span
          className={`w-6 h-6 rounded-full ${
            isOnline ? 'bg-[#00E676]/25 animate-ping' : 'bg-zinc-600/20'
          } absolute`}
        />
        <span
          className={`w-3.5 h-3.5 rounded-full ${
            isOnline
              ? 'bg-[#00E676] border-2 border-white shadow-[0_0_12px_#00E676]'
              : 'bg-zinc-500 border-2 border-zinc-700 shadow-none'
          }`}
        />
      </div>
    </AdvancedMarker>
  );
}

/**
 * Camada de conteúdo interna do Google Map:
 * Executa a trava de segurança assíncrona usando useMap() e useApiIsLoaded().
 * Os <AdvancedMarker> só são renderizados após o mapa e WebGL estarem prontos.
 */
function GoogleMapLayers({
  gigs,
  selectedGigId,
  onSelectGig,
  isOnline,
}: {
  gigs: GigOffer[];
  selectedGigId?: string;
  onSelectGig: (gig: GigOffer) => void;
  isOnline: boolean;
}) {
  const map = useMap();
  const apiIsLoaded = useApiIsLoaded();

  // Trava de segurança: não renderiza nenhum marcador se a API ou o Map não estiverem instanciados
  if (!apiIsLoaded || !map) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#0A0D14]/60 pointer-events-none z-10">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#12141C] border border-white/10 text-xs text-zinc-300">
          <Loader2 className="w-3.5 h-3.5 text-[#00E676] animate-spin" />
          <span>Inicializando motor do mapa...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Marcador do Usuário */}
      <UserLocationMarker isOnline={isOnline} />

      {/* Marcadores de vagas: renderizados somente quando Online */}
      {isOnline &&
        gigs.map((gig) => (
          <GigMarker
            key={gig.id}
            gig={gig}
            isSelected={gig.id === selectedGigId}
            onClick={onSelectGig}
          />
        ))}

      {/* Botão de recentralizar */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <MapRecenterControl />
      </div>
    </>
  );
}

/**
 * Mapa vetorial minimalista (Fallback resiliente quando sem API ou em falhas de rede)
 */
function MinimalVectorMap({
  gigs,
  selectedGigId,
  onSelectGig,
  isOnline = true,
}: {
  gigs: GigOffer[];
  selectedGigId?: string;
  onSelectGig: (gig: GigOffer) => void;
  isOnline?: boolean;
}) {
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panOffset.x,
      panY: panOffset.y,
    };
  }, [panOffset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanOffset({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  return (
    <div
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A0D14] select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out',
      }}
    >
      {/* Vias suaves e minimalistas em tons de cinza/chumbo */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M 0 520 L 1000 480" stroke="#1E2430" strokeWidth="8" strokeLinecap="round" />
        <path d="M 500 0 L 490 1000" stroke="#1E2430" strokeWidth="8" strokeLinecap="round" />
        <path d="M 100 200 L 900 800" stroke="#1A202A" strokeWidth="5" />
        <path d="M 200 900 L 850 150" stroke="#1A202A" strokeWidth="5" />
        <path d="M 300 400 L 700 400 L 700 650 L 300 650 Z" stroke="#161B24" strokeWidth="3" fill="none" />
      </svg>

      {/* Ponto do usuário no fallback vetorial */}
      <div
        className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: '50%', top: '50%' }}
      >
        <div className="relative flex items-center justify-center">
          <span
            className={`w-5 h-5 rounded-full ${
              isOnline ? 'bg-[#00E676]/20 animate-ping' : 'bg-zinc-600/20'
            } absolute`}
          />
          <span
            className={`w-3 h-3 rounded-full ${
              isOnline
                ? 'bg-[#00E676] border-2 border-white shadow-[0_0_8px_#00E676]'
                : 'bg-zinc-500 border-2 border-zinc-700'
            }`}
          />
        </div>
      </div>

      {/* Marcadores minimalistas (Apenas exibidos quando o usuário estiver ONLINE) */}
      {isOnline &&
        gigs.map((gig) => (
          <GigMarker
            key={gig.id}
            gig={gig}
            isSelected={gig.id === selectedGigId}
            onClick={onSelectGig}
            isVectorFallback={true}
          />
        ))}
    </div>
  );
}

/**
 * Componente principal do Radar/Mapa
 * Aplica:
 * 1. Correção estrutural do CSS: dimensões estritas calculadas (calc(100vh - 4rem))
 * 2. Renderização condicional assíncrona: os marcadores esperam o map estar pronto
 * 3. Validação do mapId obrigatório para Advanced Markers
 */
export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  gigs,
  selectedGigId,
  onSelectGig,
  isOnline = true,
}) => {
  const hasKey = Boolean(GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim().length > 5);

  const fallbackView = useMemo(
    () => (
      <MinimalVectorMap
        gigs={gigs}
        selectedGigId={selectedGigId}
        onSelectGig={onSelectGig}
        isOnline={isOnline}
      />
    ),
    [gigs, selectedGigId, onSelectGig, isOnline]
  );

  return (
    <div
      className="relative w-full h-[calc(100vh-4rem)] min-h-[500px] overflow-hidden bg-[#0A0D14] select-none"
      style={{
        width: '100%',
        height: 'calc(100vh - 4rem)',
        minHeight: '500px',
      }}
    >
      {hasKey ? (
        <ErrorBoundary fallback={fallbackView}>
          <div
            className="absolute inset-0 w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            <Map
              id="cwb-radar-map"
              mapId={GOOGLE_MAP_ID}
              colorScheme={ColorScheme.DARK}
              defaultCenter={CURITIBA_CENTER}
              defaultZoom={13.5}
              gestureHandling="greedy"
              disableDefaultUI={true}
              className="w-full h-full"
              style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
            >
              <GoogleMapLayers
                gigs={gigs}
                selectedGigId={selectedGigId}
                onSelectGig={onSelectGig}
                isOnline={isOnline}
              />
            </Map>
          </div>
        </ErrorBoundary>
      ) : (
        fallbackView
      )}

      {/* Overlay discreto e minimalista quando Offline */}
      {!isOnline && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none animate-fadeIn">
          <div className="bg-[#12141C]/90 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-2 text-xs text-zinc-300">
            <WifiOff className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold">Você está offline</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">Fique online para visualizar e receber vagas</span>
          </div>
        </div>
      )}
    </div>
  );
};

