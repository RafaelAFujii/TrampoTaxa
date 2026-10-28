import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Map,
  AdvancedMarker,
  useMap,
  useApiIsLoaded,
  ColorScheme,
} from '@vis.gl/react-google-maps';
import { Navigation, WifiOff, Loader2, Plus, Minus, Layers } from 'lucide-react';
import useSupercluster from 'use-supercluster';
import type { BBox } from 'geojson';
import { GigOffer } from '@trampotaxa/shared';
import { GigMarker, ClusterMarker } from './GigMarker';
import { GOOGLE_MAPS_API_KEY } from '../../constants/maps';
import { ErrorBoundary } from '../ErrorBoundary';

interface MapPlaceholderProps {
  gigs: GigOffer[];
  selectedGigId?: string;
  onSelectGig: (gig: GigOffer) => void;
  isOnline?: boolean;
}

// Coordenadas centrais de Curitiba (Batel / Centro)
const CURITIBA_CENTER = { lat: -25.4385, lng: -49.282 };
const USER_LOCATION = { lat: -25.439, lng: -49.281 };

// MapId válido obrigatório para WebGL e AdvancedMarkerElement na Google Maps API
const GOOGLE_MAP_ID = 'DEMO_MAP_ID';

/**
 * Controles de Zoom e Centralização flutuantes
 */
function MapControls({
  onZoomIn,
  onZoomOut,
  onRecenter,
}: {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onRecenter?: () => void;
}) {
  const map = useMap();

  const handleRecenter = () => {
    if (onRecenter) {
      onRecenter();
      return;
    }
    if (!map) return;
    map.panTo(CURITIBA_CENTER);
    map.setZoom(13.5);
  };

  const handleZoomIn = () => {
    if (onZoomIn) {
      onZoomIn();
      return;
    }
    if (!map) return;
    const current = map.getZoom() || 13;
    map.setZoom(Math.min(current + 1, 19));
  };

  const handleZoomOut = () => {
    if (onZoomOut) {
      onZoomOut();
      return;
    }
    if (!map) return;
    const current = map.getZoom() || 13;
    map.setZoom(Math.max(current - 1, 9));
  };

  return (
    <div className="flex flex-col gap-1.5 shadow-2xl">
      <button
        type="button"
        onClick={handleRecenter}
        className="w-9 h-9 rounded-xl bg-[#12141C]/90 hover:bg-[#1C202C] text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:border-[#00E676]/40"
        title="Recentralizar radar em Curitiba"
      >
        <Navigation className="w-4 h-4 text-[#00E676]" />
      </button>

      <button
        type="button"
        onClick={handleZoomIn}
        className="w-9 h-9 rounded-xl bg-[#12141C]/90 hover:bg-[#1C202C] text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:border-[#00E676]/40"
        title="Aproximar zoom"
      >
        <Plus className="w-4 h-4 text-white" />
      </button>

      <button
        type="button"
        onClick={handleZoomOut}
        className="w-9 h-9 rounded-xl bg-[#12141C]/90 hover:bg-[#1C202C] text-zinc-300 hover:text-white border border-white/10 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer hover:border-[#00E676]/40"
        title="Afastar zoom"
      >
        <Minus className="w-4 h-4 text-white" />
      </button>
    </div>
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
 * Integra useSupercluster para clustering dinâmico dos pontos de gigs.
 * Exibe marcadores agrupados quando o zoom está distante, expandindo para
 * marcadores individuais ao aproximar ou clicar no cluster.
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

  // Estado sincronizado do viewport para alimentar o useSupercluster
  const [zoom, setZoom] = useState<number>(13);
  const [bounds, setBounds] = useState<BBox | undefined>(undefined);

  useEffect(() => {
    if (!map) return;

    const updateCameraState = () => {
      const currentZoom = map.getZoom();
      if (typeof currentZoom === 'number') {
        setZoom(Math.round(currentZoom));
      }
      const currentBounds = map.getBounds();
      if (currentBounds) {
        const sw = currentBounds.getSouthWest();
        const ne = currentBounds.getNorthEast();
        setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
      }
    };

    updateCameraState();

    const idleListener = map.addListener('idle', updateCameraState);
    const zoomListener = map.addListener('zoom_changed', updateCameraState);

    return () => {
      google.maps.event.removeListener(idleListener);
      google.maps.event.removeListener(zoomListener);
    };
  }, [map]);

  // Transforma os Gigs em GeoJSON Feature points
  const points = useMemo(() => {
    return gigs.map((gig) => {
      const lat = gig.latLng?.lat ?? CURITIBA_CENTER.lat + (gig.coords.y - 50) * 0.001;
      const lng = gig.latLng?.lng ?? CURITIBA_CENTER.lng + (gig.coords.x - 50) * 0.001;
      return {
        type: 'Feature' as const,
        properties: {
          cluster: false as const,
          gigId: gig.id,
          gig,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat] as [number, number],
        },
      };
    });
  }, [gigs]);

  // Algoritmo de clustering geoespacial supercluster
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: {
      radius: 70,
      maxZoom: 16,
    },
  });

  // Ação ao clicar em um cluster: expande para o zoom que dissolve o grupo
  const handleClusterClick = useCallback(
    (clusterId: number, lat: number, lng: number) => {
      if (!map) return;
      const expansionZoom = Math.min(
        supercluster?.getClusterExpansionZoom(clusterId) ?? zoom + 2,
        18
      );
      map.panTo({ lat, lng });
      map.setZoom(expansionZoom);
    },
    [map, supercluster, zoom]
  );

  // Trava de segurança assíncrona
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

      {/* Renderização Clustered dos pontos quando Online */}
      {isOnline &&
        clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster, point_count: pointCount } = cluster.properties as {
            cluster?: boolean;
            point_count?: number;
            gig?: GigOffer;
          };

          if (isCluster) {
            return (
              <ClusterMarker
                key={`cluster-${cluster.id}`}
                count={pointCount || 2}
                lat={latitude}
                lng={longitude}
                onClick={() => handleClusterClick(cluster.id as number, latitude, longitude)}
              />
            );
          }

          const gig = cluster.properties.gig as GigOffer;
          if (!gig) return null;

          return (
            <GigMarker
              key={gig.id}
              gig={gig}
              isSelected={gig.id === selectedGigId}
              onClick={onSelectGig}
            />
          );
        })}

      {/* Botões de controle de zoom e recentralização */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <MapControls />
      </div>
    </>
  );
}

/**
 * Mapa vetorial minimalista (Fallback resiliente quando sem API ou em falhas de rede)
 * Também conta com suporte a agrupamento/clustering com zoom interativo.
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
  const [vectorZoom, setVectorZoom] = useState(13);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDraggingRef.current = true;
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: panOffset.x,
        panY: panOffset.y,
      };
    },
    [panOffset]
  );

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

  // Transforma os Gigs em GeoJSON Feature points para clustering
  const points = useMemo(() => {
    return gigs.map((gig) => {
      const lat = gig.latLng?.lat ?? CURITIBA_CENTER.lat + (gig.coords.y - 50) * 0.001;
      const lng = gig.latLng?.lng ?? CURITIBA_CENTER.lng + (gig.coords.x - 50) * 0.001;
      return {
        type: 'Feature' as const,
        properties: {
          cluster: false as const,
          gigId: gig.id,
          gig,
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [lng, lat] as [number, number],
        },
      };
    });
  }, [gigs]);

  const { clusters, supercluster } = useSupercluster({
    points,
    zoom: vectorZoom,
    options: {
      radius: 80,
      maxZoom: 16,
    },
  });

  const handleClusterExpand = (clusterId: number) => {
    const nextZoom = Math.min(
      supercluster?.getClusterExpansionZoom(clusterId) ?? vectorZoom + 2,
      17
    );
    setVectorZoom(nextZoom);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0A0D14]">
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
          <path
            d="M 300 400 L 700 400 L 700 650 L 300 650 Z"
            stroke="#161B24"
            strokeWidth="3"
            fill="none"
          />
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
              className={`w-3.5 h-3.5 rounded-full ${
                isOnline
                  ? 'bg-[#00E676] border-2 border-white shadow-[0_0_8px_#00E676]'
                  : 'bg-zinc-500 border-2 border-zinc-700'
              }`}
            />
          </div>
        </div>

        {/* Marcadores e Clusters minimalistas */}
        {isOnline &&
          clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates;
            const { cluster: isCluster, point_count: pointCount } = cluster.properties as {
              cluster?: boolean;
              point_count?: number;
              gig?: GigOffer;
            };

            // Cálculo aproximado de coordenadas percentuais de tela
            const xPercent = 50 + (longitude - CURITIBA_CENTER.lng) * 450;
            const yPercent = 50 + (latitude - CURITIBA_CENTER.lat) * -450;

            if (isCluster) {
              return (
                <ClusterMarker
                  key={`v-cluster-${cluster.id}`}
                  count={pointCount || 2}
                  lat={latitude}
                  lng={longitude}
                  xPercent={Math.max(10, Math.min(90, xPercent))}
                  yPercent={Math.max(10, Math.min(90, yPercent))}
                  onClick={() => handleClusterExpand(cluster.id as number)}
                  isVectorFallback={true}
                />
              );
            }

            const gig = cluster.properties.gig as GigOffer;
            if (!gig) return null;

            return (
              <GigMarker
                key={gig.id}
                gig={gig}
                isSelected={gig.id === selectedGigId}
                onClick={onSelectGig}
                isVectorFallback={true}
              />
            );
          })}
      </div>

      {/* Controles do mapa vetorial */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <MapControls
          onZoomIn={() => setVectorZoom((z) => Math.min(z + 1, 18))}
          onZoomOut={() => setVectorZoom((z) => Math.max(z - 1, 10))}
          onRecenter={() => {
            setPanOffset({ x: 0, y: 0 });
            setVectorZoom(13);
          }}
        />
      </div>

      {/* Indicador de Clustering Ativo */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12141C]/80 border border-white/5 text-[10px] text-zinc-400 backdrop-blur-md">
          <Layers className="w-3 h-3 text-[#00E676]" />
          <span>Clustering Geoespacial Ativo (Zoom {vectorZoom})</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Componente principal do Radar/Mapa
 */
export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  gigs,
  selectedGigId,
  onSelectGig,
  isOnline = true,
}) => {
  const [mapAuthError, setMapAuthError] = useState(() => {
    try {
      return sessionStorage.getItem('gmp_billing_disabled') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleAuthFailure = () => {
      console.warn(
        '[Google Maps] gm_authFailure detectado (BillingNotEnabledMapError). Alternando para o mapa vetorial resiliente.'
      );
      try {
        sessionStorage.setItem('gmp_billing_disabled', 'true');
      } catch {}
      setMapAuthError(true);
    };

    const win = window as unknown as { gm_authFailure?: () => void };
    const prevAuthFailure = win.gm_authFailure;
    win.gm_authFailure = () => {
      handleAuthFailure();
      if (typeof prevAuthFailure === 'function') {
        prevAuthFailure();
      }
    };

    const handleWindowError = (event: ErrorEvent) => {
      if (
        event.message?.includes('BillingNotEnabledMapError') ||
        event.message?.includes('Google Maps')
      ) {
        handleAuthFailure();
      }
    };

    const handleCustomBillingEvent = () => {
      handleAuthFailure();
    };

    window.addEventListener('error', handleWindowError);
    window.addEventListener('gmp_billing_error', handleCustomBillingEvent);

    return () => {
      win.gm_authFailure = prevAuthFailure;
      window.removeEventListener('error', handleWindowError);
      window.removeEventListener('gmp_billing_error', handleCustomBillingEvent);
    };
  }, []);

  const hasKey = Boolean(
    !mapAuthError && GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim().length > 5
  );

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
    <div className="relative w-full h-full min-h-0 overflow-hidden bg-[#0A0D14] select-none">
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
              defaultZoom={13}
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
