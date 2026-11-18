import React, { useEffect, useRef, useState } from 'react';
import {
  AdvancedMarker,
  ColorScheme,
  Map,
  useMapsLibrary,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  Navigation,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Phone,
  ChevronLeft,
  MessageSquare,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { GOOGLE_MAPS_API_KEY } from '../constants/maps';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ManagerChatModal } from '../components/chat/ManagerChatModal';
import { MasterQrScannerModal } from '../components/flow/MasterQrScannerModal';
import { VenueReviewModal } from '../components/flow/VenueReviewModal';
import { useFreelancerGigFlow } from '../hooks/useFreelancerGigFlow';
import type { GigOffer } from '@trampotaxa/shared';

interface ActiveGigScreenProps {
  gig?: GigOffer;
  onFinishShift?: (gig: GigOffer) => void;
  onOpenNavigation?: () => void;
  onCancelGig?: () => void;
  onBackToDashboard?: () => void;
}

// Local de partida do Freelancer (Praça Tiradentes, Curitiba)
const USER_ORIGIN = { lat: -25.4297, lng: -49.2719 };

// Cálculo de fallback aproximado caso a Routes API não esteja disponível no projeto
function computeFallbackRouteInfo(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): { distance: string; duration: string } {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLng / 2) ** 2;
  const straightKm = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const roadKm = Math.max(0.5, straightKm * 1.3);
  const mins = Math.max(4, Math.round((roadKm / 26) * 60));
  return {
    distance: `${roadKm.toFixed(1)} km`,
    duration: `${mins} min`,
  };
}

// Componente interno para cálculo e renderização da rota via Routes API moderna (Route.computeRoutes)
// Ref: https://developers.google.com/maps/documentation/javascript/routes?utm_campaign=gmp_mcp_codeassist_v1_aistudio
function RealRouteRenderer({
  destination,
  venueName,
}: {
  destination: { lat: number; lng: number };
  venueName: string;
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    let cancelled = false;

    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    setRouteError(null);

    const request: google.maps.routes.ComputeRoutesRequest = {
      origin: USER_ORIGIN,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
      internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
    };

    routesLibrary.Route.computeRoutes(request)
      .then(({ routes }) => {
        if (cancelled) return;
        const primaryRoute = routes?.[0];
        if (!primaryRoute) {
          setRouteInfo(computeFallbackRouteInfo(USER_ORIGIN, destination));
          return;
        }

        const newPolylines = primaryRoute.createPolylines({
          polylineOptions: {
            strokeColor: '#5FA780',
            strokeWeight: 6,
            strokeOpacity: 0.95,
          },
        });
        newPolylines.forEach((polyline) => {
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport);
        }

        const distanceMeters = primaryRoute.distanceMeters ?? 0;
        const durationMillis = primaryRoute.durationMillis ?? 0;
        if (distanceMeters > 0 || durationMillis > 0) {
          setRouteInfo({
            distance: `${(distanceMeters / 1000).toFixed(1)} km`,
            duration: `${Math.max(1, Math.round(durationMillis / 60000))} min`,
          });
        } else {
          setRouteInfo(computeFallbackRouteInfo(USER_ORIGIN, destination));
        }
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        console.warn('Google Routes API error:', err);
        setRouteError('Não foi possível carregar o traçado da rota. Exibindo estimativa.');
        setRouteInfo(computeFallbackRouteInfo(USER_ORIGIN, destination));
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLibrary, map, destination]);

  return (
    <>
      <AdvancedMarker position={USER_ORIGIN} title="Sua localização atual">
        <div className="flex items-center justify-center">
          <span className="w-4 h-4 rounded-full bg-white border-2 border-[#5FA780]" />
        </div>
      </AdvancedMarker>

      <AdvancedMarker position={destination} title={venueName}>
        <div className="px-2.5 py-1 rounded-full bg-[#5FA780] text-black text-[11px] font-black shadow-lg border border-black/20">
          {venueName}
        </div>
      </AdvancedMarker>

      {routeInfo && (
        <>
          <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5FA780] animate-pulse" />
            <span className="text-xs font-bold text-white">
              ETA Google Maps: {routeInfo.distance}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-20 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-200 shadow-lg">
            ~ {routeInfo.duration} de trânsito em Curitiba
          </div>
        </>
      )}

      {routeError && (
        <div className="absolute bottom-4 left-4 z-20 bg-amber-500/15 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-[11px] font-medium text-amber-200 shadow-lg">
          {routeError}
        </div>
      )}
    </>
  );
}

import { useActiveGigQuery } from '../hooks/useGigsQuery';

export const ActiveGigScreen: React.FC<ActiveGigScreenProps> = ({
  gig: propGig,
  onFinishShift: _onFinishShift,
  onOpenNavigation: _onOpenNavigation,
  onCancelGig,
  onBackToDashboard,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateGig = (location.state as { gig?: GigOffer })?.gig;
  const targetGigId = propGig?.id || stateGig?.id;
  const { data: queryGig, isLoading, isError, refetch } = useActiveGigQuery(targetGigId);
  const gig = propGig || stateGig || queryGig;

  const {
    activeShift,
    performCheckIn,
    requestCheckOut,
    submitVenueReview,
    finishAndReceive,
  } = useFreelancerGigFlow();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Status unificado do turno
  const currentPhase: 'heading' | 'in_shift' | 'awaiting_auto_checkout' | 'pix_scheduled' =
    activeShift?.status === 'em_turno'
      ? 'in_shift'
      : activeShift?.status === 'checkout_pendente_aprovacao'
        ? 'awaiting_auto_checkout'
        : activeShift?.status === 'pix_agendado'
          ? 'pix_scheduled'
          : 'heading';
  const [mapAuthError, setMapAuthError] = useState(() => {
    try {
      return sessionStorage.getItem('gmp_billing_disabled') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleAuthFailure = () => {
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
      if (event.message?.includes('BillingNotEnabledMapError')) {
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

  const apiKey = !mapAuthError && GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim().length > 5;

  if (!gig) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#171B1A] text-white">
        <p>{isLoading ? 'Carregando a vaga...' : 'Não foi possível carregar a vaga.'}</p>
        {isError && (
          <button className="underline" onClick={() => void refetch()}>
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  const gigLocation = gig.latLng || { lat: -25.4398, lng: -49.2885 };

  const handlePrimaryAction = () => {
    if (currentPhase === 'heading') {
      setIsScannerOpen(true);
    } else if (currentPhase === 'in_shift') {
      requestCheckOut();
    } else if (currentPhase === 'pix_scheduled') {
      setIsReviewOpen(true);
    }
  };

  const handleScanSuccess = (payload: string) => {
    performCheckIn(payload);
  };

  const handleReviewCompleted = (rating: number, tags: string[]) => {
    submitVenueReview({
      gigId: gig.id,
      rating,
      tags,
    });
    setIsReviewOpen(false);
    finishAndReceive();
    navigate('/earnings', { state: { justCompletedGig: gig, rating } });
  };

  const handleBack = () => {
    if (onBackToDashboard) {
      onBackToDashboard();
    } else {
      navigate('/map');
    }
  };

  const handleCancel = () => {
    if (onCancelGig) {
      onCancelGig();
    } else {
      navigate('/map');
    }
  };

  const externalNavigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${USER_ORIGIN.lat},${USER_ORIGIN.lng}&destination=${gigLocation.lat},${gigLocation.lng}&travelmode=driving`;

  const fallbackRouteVisual = (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#171B1A]">
      <div className="w-12 h-12 rounded-lg bg-[#5FA780]/10 border border-[#5FA780]/20 flex items-center justify-center text-[#5FA780] mb-3">
        <Navigation className="w-6 h-6 animate-pulse" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">
        Rota Curitiba: Centro → {gig.neighborhood}
      </h4>
      <p className="text-xs text-zinc-400 max-w-xs mb-3">
        Distância estimada: {gig.distance} • Tempo aproximado: ~12 minutos
      </p>
      <div className="flex items-center gap-2 text-[11px] font-bold text-[#5FA780] bg-[#5FA780]/10 px-3 py-1 rounded-full border border-[#5FA780]/30">
        <MapPin className="w-3.5 h-3.5" />
        <span>Destino: {gig.venueName}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex justify-center pb-24 lg:pb-10 bg-[#171B1A]">
      <div className="w-full max-w-4xl space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#5FA780]" />
            </button>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5FA780] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#5FA780]" />
              </span>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                Turno em Andamento
              </h1>
            </div>
          </div>

          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#5FA780]/15 text-[#5FA780] border border-[#5FA780]/30">
            {currentPhase === 'heading'
              ? 'A Caminho (Check-in Pendente)'
              : currentPhase === 'in_shift'
                ? 'Em Turno Ativo'
                : currentPhase === 'awaiting_auto_checkout'
                  ? 'Janela de Auto-Checkout (2h)'
                  : 'Aprovada - PIX Agendado'}
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[#5FA780]">
            <span className="w-2 h-2 rounded-full bg-[#5FA780] animate-pulse" />
            Carregando detalhes do turno (React Query)...
          </div>
        )}
        {isError && (
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-300">
            <span className="min-w-0 flex-1">Erro ao carregar detalhes do turno.</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="shrink-0 px-2 py-0.5 rounded bg-red-500/20 hover:bg-red-500/30 font-bold text-white transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Desktop Split Grid: Details Left, Map & Actions Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Gig Info & Presentation Rules */}
          <div className="lg:col-span-5 space-y-5">
            {/* Restaurant Card */}
            <div className="bg-[#202421] border border-white/10 rounded-xl p-6 shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#5FA780] bg-[#5FA780]/10 px-2.5 py-0.5 rounded-full border border-[#5FA780]/20">
                    {gig.profession}
                  </span>
                  <h2 className="text-2xl font-black text-white mt-2 tracking-tight">
                    {gig.venueName}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{gig.neighborhood} • Curitiba, PR</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    TAXA
                  </span>
                  <span className="text-2xl font-black text-[#5FA780] block">
                    {gig.rateFormatted}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#5FA780]" />
                  <span className="font-semibold">{gig.shiftTime}</span>
                </div>
                <span className="text-xs text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md">
                  {gig.shiftDuration}
                </span>
              </div>
            </div>

            {/* Regras de Apresentação Card */}
            <div className="bg-[#202421] border border-white/10 rounded-xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#5FA780]">
                <ShieldCheck className="w-4 h-4" />
                <span>Regras de Apresentação</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {gig.microtraining.description}
              </p>
            </div>

            {/* Establishment Contact & Chat com o Gerente */}
            <div className="bg-[#202421] border border-white/10 rounded-xl p-5 space-y-3.5 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-lg bg-[#5FA780]/15 border border-[#5FA780]/30 flex items-center justify-center text-[#5FA780]">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#5FA780] border-2 border-[#202421]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white block">Gerência de Salão</span>
                      <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-[#5FA780]/15 text-[#5FA780] border border-[#5FA780]/30">
                        Online
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Canal direto de comunicação</span>
                  </div>
                </div>

                <a
                  href="tel:41987654321"
                  title="Ligar para o estabelecimento"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#5FA780]" />
                </a>
              </div>

              {/* Botão de Abrir Chat com o Gerente */}
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="w-full py-3 px-4 rounded-lg bg-[#5FA780]/10 hover:bg-[#5FA780]/20 border border-[#5FA780]/30 hover:border-[#5FA780]/60 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
              >
                <MessageSquare className="w-4 h-4 text-[#5FA780] transition-transform group-hover:scale-110" />
                <span>Chat com o Gerente</span>
                <span className="w-2 h-2 rounded-full bg-[#5FA780] animate-pulse ml-1" />
              </button>
            </div>
          </div>

          {/* Right Column (7 cols): Real Google Maps Route & Actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Route Map Card with Real Google Maps API */}
            <div className="bg-[#202421] border border-white/10 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Rota Real GPS no Google Maps
                </span>
                <span className="text-xs font-semibold text-[#5FA780] bg-[#5FA780]/10 px-2.5 py-0.5 rounded-full border border-[#5FA780]/20">
                  Trânsito em Tempo Real
                </span>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-white/10 h-72 w-full bg-[#0c0f14]">
                {apiKey ? (
                  <ErrorBoundary fallback={fallbackRouteVisual}>
                    <Map
                      id="active-gig-map"
                      mapId="DEMO_MAP_ID"
                      colorScheme={ColorScheme.DARK}
                      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      defaultCenter={gigLocation}
                      defaultZoom={14}
                      gestureHandling="greedy"
                      disableDefaultUI={true}
                      className="w-full h-full"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <RealRouteRenderer destination={gigLocation} venueName={gig.venueName} />
                    </Map>
                  </ErrorBoundary>
                ) : (
                  fallbackRouteVisual
                )}
              </div>

              {/* Navigation launch link */}
              <a
                href={externalNavigationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#202421] hover:bg-[#20222a] text-white border border-white/10 rounded-lg font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm group"
              >
                <Navigation className="w-4 h-4 text-[#5FA780] transition-transform group-hover:scale-110" />
                <span>Abrir Rota Externa (Waze / Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 ml-1" />
              </a>
            </div>

            {/* Primary Action Button & Auto-Checkout Banner */}
            <div className="space-y-3">
              {currentPhase === 'awaiting_auto_checkout' && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2 text-center animate-pulse">
                  <div className="font-extrabold flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span>Janela de Auto-Checkout Iniciada (2 Horas)</span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    O encerramento do turno foi registrado. Se o gerente não contestar no prazo de 2 horas (simulada em segundos neste teste), o sistema aprovará automaticamente e agendará seu PIX.
                  </p>
                </div>
              )}

              {currentPhase === 'pix_scheduled' && (
                <div className="p-4 rounded-lg bg-[#5FA780]/15 border border-[#5FA780]/40 text-[#5FA780] text-xs space-y-1.5 text-center shadow-lg">
                  <div className="font-black text-sm flex items-center justify-center gap-2">
                    <span>🎉 TAXA APROVADA - PIX AGENDADO!</span>
                  </div>
                  <p className="text-[11px] text-zinc-200">
                    A janela encerrou sem contestação. Avalie o local para liberar a visualização no extrato.
                  </p>
                </div>
              )}

              <PrimaryButton
                onClick={handlePrimaryAction}
                icon={
                  currentPhase === 'heading' ? (
                    <QrCode className="w-4 h-4 text-black" />
                  ) : currentPhase === 'in_shift' ? (
                    <Clock className="w-4 h-4 text-black" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-black" />
                  )
                }
              >
                {currentPhase === 'heading'
                  ? 'ESCANEAR QR CODE MESTRE (CHECK-IN)'
                  : currentPhase === 'in_shift'
                    ? 'FINALIZAR TURNO (SOLICITAR CHECK-OUT)'
                    : currentPhase === 'awaiting_auto_checkout'
                      ? 'AGUARDANDO AUTO-CHECKOUT (2H)...'
                      : 'AVALIAR LOCAL E VER MEU PIX (5★)'}
              </PrimaryButton>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-xs text-red-400/80 hover:text-red-300 transition-colors cursor-pointer py-1"
                >
                  Precisa cancelar este turno?
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Chat com o Gerente */}
      <ManagerChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        gig={gig}
        phoneNumber="(41) 98765-4321"
      />

      {/* Modal Leitor de QR Code Mestre do Salão */}
      <MasterQrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />

      {/* Modal de Avaliação 5 Estrelas Obrigatório Sem Loading */}
      <VenueReviewModal
        isOpen={isReviewOpen}
        venueName={gig.venueName}
        onCompleteReview={handleReviewCompleted}
      />
    </div>
  );
};
