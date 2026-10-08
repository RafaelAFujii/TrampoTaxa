import React, { useEffect, useState } from 'react';
import {
  Map,
  useMapsLibrary,
  useMap,
  ColorScheme
} from '@vis.gl/react-google-maps';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  ShieldCheck, 
  Phone, 
  ChevronLeft 
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { GigOffer } from '../types';
import { GOOGLE_MAPS_API_KEY } from '../constants/maps';
import { mockGigs } from '../data/mockGigs';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface ActiveGigScreenProps {
  gig?: GigOffer;
  onFinishShift?: (gig: GigOffer) => void;
  onOpenNavigation?: () => void;
  onCancelGig?: () => void;
  onBackToDashboard?: () => void;
}

// Local de partida do Freelancer (Praça Tiradentes, Curitiba)
const USER_ORIGIN = { lat: -25.4297, lng: -49.2719 };

// Componente interno para cálculo e renderização da rota real do Google Maps
function RealRouteRenderer({ destination }: { destination: { lat: number; lng: number } }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary('routes');
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);

  useEffect(() => {
    if (!routesLibrary || !map) return;

    const renderer = new routesLibrary.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#00E676',
        strokeWeight: 6,
        strokeOpacity: 0.95,
      }
    });

    setDirectionsService(new routesLibrary.DirectionsService());
    setDirectionsRenderer(renderer);

    return () => {
      renderer.setMap(null);
    };
  }, [routesLibrary, map]);

  useEffect(() => {
    if (!directionsService || !directionsRenderer) return;

    directionsService.route({
      origin: USER_ORIGIN,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }).then((res: google.maps.DirectionsResult | null) => {
      if (res) {
        directionsRenderer.setDirections(res);
        const leg = res.routes[0]?.legs[0];
        if (leg) {
          setRouteInfo({
            distance: leg.distance?.text || '3.8 km',
            duration: leg.duration?.text || '11 mins',
          });
        }
      }
    }).catch((err: unknown) => {
      console.warn('Google Directions route error:', err);
    });
  }, [directionsService, directionsRenderer, destination]);

  return (
    <>
      {routeInfo && (
        <>
          <div className="absolute top-4 left-4 z-20 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-xs font-bold text-white">
              ETA Google Maps: {routeInfo.distance}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 z-20 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-zinc-200 shadow-lg">
            ~ {routeInfo.duration} de trânsito em Curitiba
          </div>
        </>
      )}
    </>
  );
}

// Estilo noturno do mapa para a rota
const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0d1017' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090b10' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#171c26' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#222938' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#06080b' }] },
];

export const ActiveGigScreen: React.FC<ActiveGigScreenProps> = ({
  gig: propGig,
  onFinishShift,
  onOpenNavigation,
  onCancelGig,
  onBackToDashboard,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const gig = propGig || (location.state as { gig?: GigOffer })?.gig || mockGigs[0];

  const [shiftStatus, setShiftStatus] = useState<'heading_to_venue' | 'arrived_working'>('heading_to_venue');
  const apiKey = GOOGLE_MAPS_API_KEY;

  const gigLocation = gig.latLng || { lat: -25.4398, lng: -49.2885 };

  const handlePrimaryAction = () => {
    if (shiftStatus === 'heading_to_venue') {
      setShiftStatus('arrived_working');
    } else {
      if (onFinishShift) {
        onFinishShift(gig);
      } else {
        navigate('/earnings');
      }
    }
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
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0d1017]">
      <div className="w-12 h-12 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center text-[#00E676] mb-3">
        <Navigation className="w-6 h-6 animate-pulse" />
      </div>
      <h4 className="text-sm font-bold text-white mb-1">Rota Curitiba: Centro → {gig.neighborhood}</h4>
      <p className="text-xs text-zinc-400 max-w-xs mb-3">
        Distância estimada: {gig.distance} • Tempo aproximado: ~12 minutos
      </p>
      <div className="flex items-center gap-2 text-[11px] font-bold text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/30">
        <MapPin className="w-3.5 h-3.5" />
        <span>Destino: {gig.venueName}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex justify-center pb-24 lg:pb-10 bg-[#0A0B0E]">
      <div className="w-full max-w-4xl space-y-6">
        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-[#00E676]" />
            </button>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00E676]" />
              </span>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                Turno em Andamento
              </h1>
            </div>
          </div>

          <span className="text-xs font-black uppercase px-3 py-1 rounded-full bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30">
            {shiftStatus === 'heading_to_venue' ? 'A Caminho do Local' : 'Em Turno Ativo'}
          </span>
        </div>

        {/* Desktop Split Grid: Details Left, Map & Actions Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Gig Info & Speckit Rules */}
          <div className="lg:col-span-5 space-y-5">
            {/* Restaurant Card */}
            <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 shadow-md space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2.5 py-0.5 rounded-full border border-[#00E676]/20">
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
                  <span className="text-2xl font-black text-[#00E676] block">
                    {gig.rateFormatted}
                  </span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-zinc-300">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#00E676]" />
                  <span className="font-semibold">{gig.shiftTime}</span>
                </div>
                <span className="text-xs text-zinc-400 bg-white/5 px-2.5 py-1 rounded-md">
                  {gig.shiftDuration}
                </span>
              </div>
            </div>

            {/* Microtraining Guidelines Card */}
            <div className="bg-[#121418] border border-white/10 rounded-3xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-[#00E676]">
                <ShieldCheck className="w-4 h-4" />
                <span>{gig.microtraining.title}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white">
                {gig.microtraining.rulesTitle}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {gig.microtraining.description}
              </p>
            </div>

            {/* Establishment Contact */}
            <div className="bg-[#121418] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-[#00E676]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Gerência de Salão</span>
                  <span className="text-[11px] text-zinc-400">(41) 98765-4321</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert(`Ligando para a gerência de ${gig.venueName}...`)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-white cursor-pointer transition-colors"
              >
                Chamar
              </button>
            </div>
          </div>

          {/* Right Column (7 cols): Real Google Maps Route & Actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Route Map Card with Real Google Maps API */}
            <div className="bg-[#121418] border border-white/10 rounded-3xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Rota Real GPS no Google Maps
                </span>
                <span className="text-xs font-semibold text-[#00E676] bg-[#00E676]/10 px-2.5 py-0.5 rounded-full border border-[#00E676]/20">
                  Trânsito em Tempo Real
                </span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 h-72 w-full bg-[#0c0f14]">
                {apiKey ? (
                  <ErrorBoundary fallback={fallbackRouteVisual}>
                    <Map
                      id="active-gig-map"
                      mapId="DEMO_MAP_ID"
                      colorScheme={ColorScheme.DARK}
                      defaultCenter={gigLocation}
                      defaultZoom={14}
                      gestureHandling="greedy"
                      disableDefaultUI={true}
                      className="w-full h-full"
                      style={{ width: '100%', height: '100%' }}
                    >
                      <RealRouteRenderer destination={gigLocation} />
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
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#181a20] hover:bg-[#20222a] text-white border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm group"
              >
                <Navigation className="w-4 h-4 text-[#00E676] transition-transform group-hover:scale-110" />
                <span>Abrir Rota Externa (Waze / Google Maps)</span>
                <ExternalLink className="w-3.5 h-3.5 text-zinc-400 ml-1" />
              </a>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-3">
              <PrimaryButton
                onClick={handlePrimaryAction}
                icon={
                  shiftStatus === 'heading_to_venue' ? (
                    <MapPin className="w-4 h-4 text-black" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-black" />
                  )
                }
              >
                {shiftStatus === 'heading_to_venue'
                  ? 'CHEGUEI NO LOCAL (INICIAR TURNO)'
                  : 'FINALIZAR TURNO E RECEBER TAXA'}
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
    </div>
  );
};
