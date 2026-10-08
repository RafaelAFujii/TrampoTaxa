import React, { useState, useMemo } from 'react';
import { 
  Power, 
  Wallet, 
  MapPin, 
  Clock, 
  ArrowRight,
  X,
  WifiOff,
  Filter,
  Sparkles,
  ShieldCheck,
  Building2,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { GigMarker } from '../components/map/GigMarker';
import { GigOfferBottomSheet } from './GigOfferBottomSheet';
import { mockGigs } from '../data/mockGigs';
import { GigOffer } from '../types';
import { useAuth } from '../context/AuthContext';

export interface MapDashboardScreenProps {
  gigs?: GigOffer[];
  onSelectGig?: (gig: GigOffer) => void;
  selectedGigId?: string;
  isOnline?: boolean;
  onToggleOnline?: () => void;
  onOpenProfile?: () => void;
  onOpenEarnings?: () => void;
  earningsToday?: string;
  onAcceptGigSuccess?: (gig: GigOffer) => void;
}

export const MapDashboardScreen: React.FC<MapDashboardScreenProps> = ({
  gigs: propGigs,
  onSelectGig: externalSelectGig,
  selectedGigId: externalSelectedGigId,
  isOnline: controlledOnline,
  onToggleOnline,
  onOpenProfile,
  onOpenEarnings,
  earningsToday = 'R$ 150,00',
  onAcceptGigSuccess,
}) => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();

  // Injeção de dados: Usa propGigs se fornecido, caso contrário utiliza mockGigs.ts
  const allGigs = propGigs || mockGigs;

  // Estado de radar online/offline
  const [internalOnline, setInternalOnline] = useState(true);
  const isOnline = controlledOnline !== undefined ? controlledOnline : internalOnline;

  // Filtros de profissão
  const [filterProfession, setFilterProfession] = useState<'All' | 'Bartender' | 'Garçom'>('All');

  // Estado do Bottom Sheet e vaga selecionada
  const [selectedGig, setSelectedGig] = useState<GigOffer | null>(() => {
    if (externalSelectedGigId) {
      return allGigs.find((g) => g.id === externalSelectedGigId) || null;
    }
    return null;
  });
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isMobileCardDismissed, setIsMobileCardDismissed] = useState(false);

  // Alterna radar online
  const handleToggleOnline = () => {
    if (onToggleOnline) {
      onToggleOnline();
    } else {
      setInternalOnline((prev) => !prev);
    }
  };

  // Filtragem de vagas baseada no filtro e status online
  const displayedGigs = useMemo(() => {
    if (!isOnline) return [];
    return allGigs.filter((g) => {
      if (filterProfession === 'All') return true;
      return g.profession === filterProfession;
    });
  }, [allGigs, isOnline, filterProfession]);

  // Ação ao clicar em um marcador ou item da lista
  const handleMarkerClick = (gig: GigOffer) => {
    setSelectedGig(gig);
    setIsBottomSheetOpen(true);
    setIsMobileCardDismissed(false);
    if (externalSelectGig) {
      externalSelectGig(gig);
    }
  };

  // Aceitar a vaga através do Bottom Sheet
  const handleAcceptGig = (gig: GigOffer) => {
    setIsBottomSheetOpen(false);
    if (onAcceptGigSuccess) {
      onAcceptGigSuccess(gig);
    } else {
      // Redireciona para o turno ativo via React Router
      navigate('/active-gig', { state: { gig } });
    }
  };

  // Recusar a vaga
  const handleDeclineGig = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row relative bg-[#0A0B0E] h-[calc(100vh-4rem)] min-h-[500px] overflow-hidden">
      {/* ======================================================== */}
      {/* SIDEBAR DESKTOP: Painel de Vagas & Status do Radar       */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex w-96 flex-col justify-between border-r border-white/5 bg-[#0F1117] z-20 shrink-0 h-full">
        <div className="p-5 flex flex-col h-full overflow-hidden">
          {/* Header do Perfil & Ganhos do Dia */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={
                    user?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
                  }
                  alt="Perfil"
                  className="w-10 h-10 rounded-full object-cover border border-[#00E676]/60 shadow-[0_0_10px_rgba(0,230,118,0.2)]"
                />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0F1117] ${
                    isOnline ? 'bg-[#00E676]' : 'bg-zinc-600'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">
                    {user?.name || 'Gabriel Silva'}
                  </h3>
                  <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-white/10 text-zinc-300">
                    {user?.role || 'Freelancer'}
                  </span>
                </div>
                <span className={`text-[11px] font-medium ${isOnline ? 'text-[#00E676]' : 'text-zinc-500'}`}>
                  {isOnline ? 'Radar Ativo em Curitiba' : 'Desconectado'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenEarnings ? onOpenEarnings : () => navigate('/earnings')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              title="Ver Extrato de Ganhos"
            >
              <Wallet className="w-3.5 h-3.5 text-[#00E676]" />
              <span className="text-xs font-black text-white">{earningsToday}</span>
            </button>
          </div>

          {/* Filtros de Profissão (Disponíveis quando Online) */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">
                {isOnline ? `Vagas no Radar (${displayedGigs.length})` : 'Radar Desativado'}
              </span>
              <span className="text-[11px] text-zinc-500">Curitiba, PR</span>
            </div>

            {isOnline && (
              <div className="flex items-center bg-[#151821] p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setFilterProfession('All')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterProfession === 'All'
                      ? 'bg-[#00E676] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Todas
                </button>
                <button
                  type="button"
                  onClick={() => setFilterProfession('Bartender')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterProfession === 'Bartender'
                      ? 'bg-[#00E676] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Bartender
                </button>
                <button
                  type="button"
                  onClick={() => setFilterProfession('Garçom')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterProfession === 'Garçom'
                      ? 'bg-[#00E676] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Garçom
                </button>
              </div>
            )}
          </div>

          {/* Lista de Vagas na Sidebar */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 custom-scrollbar">
            {isOnline ? (
              displayedGigs.length > 0 ? (
                displayedGigs.map((gig) => {
                  const isSelected = selectedGig?.id === gig.id;
                  return (
                    <div
                      key={gig.id}
                      onClick={() => handleMarkerClick(gig)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#18201C] border-[#00E676]/60 shadow-[0_0_15px_rgba(0,230,118,0.15)]'
                          : 'bg-[#13161F] border-white/5 hover:border-white/20 hover:bg-[#181C26]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#00E676]/15 text-[#00E676] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                              {gig.profession}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-medium">
                              {gig.distance}
                            </span>
                          </div>
                          <h4 className="font-bold text-white text-sm mt-1">
                            {gig.venueName}
                          </h4>
                          <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-zinc-500" />
                            {gig.neighborhood}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-black text-[#00E676]">
                            {gig.rateFormatted}
                          </span>
                          <span className="block text-[10px] text-zinc-400 mt-0.5">
                            {gig.shiftDuration}
                          </span>
                        </div>
                      </div>

                      {/* Dica rápida Speckit preview */}
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1 text-zinc-300">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {gig.shiftTime}
                        </span>
                        <span className="text-[#00E676] font-bold flex items-center gap-1 hover:underline">
                          Ver taxa <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-zinc-500 text-xs flex flex-col items-center">
                  <Filter className="w-6 h-6 mb-2 opacity-40" />
                  Nenhuma vaga encontrada para o filtro selecionado.
                </div>
              )
            ) : (
              <div className="py-16 text-center text-zinc-500 text-xs flex flex-col items-center justify-center p-4">
                <WifiOff className="w-8 h-8 text-zinc-600 mb-3" />
                <p className="font-semibold text-zinc-300 mb-1">Radar Desativado</p>
                <p className="text-[11px] text-zinc-500 leading-relaxed max-w-[200px]">
                  Fique online para ver as vagas em tempo real em Curitiba.
                </p>
              </div>
            )}
          </div>

          {/* Botão de Controle Online/Offline */}
          <div className="pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isOnline
                  ? 'bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                  : 'bg-[#00E676] text-black hover:bg-[#00c864] shadow-[0_0_15px_rgba(0,230,118,0.4)]'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isOnline ? 'DESATIVAR RADAR (OFFLINE)' : 'ATIVAR RADAR (FICAR ONLINE)'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* ÁREA PRINCIPAL: MAPA + INJEÇÃO DE MARCADORES (GigMarker) */}
      {/* ======================================================== */}
      <main
        className="flex-1 relative w-full h-[calc(100vh-4rem)] min-h-[500px] overflow-hidden bg-[#0A0D14]"
        style={{ height: 'calc(100vh - 4rem)', minHeight: '500px' }}
      >
        {/* Componente MapPlaceholder com os dados injetados */}
        <MapPlaceholder
          gigs={displayedGigs}
          selectedGigId={selectedGig?.id}
          onSelectGig={handleMarkerClick}
          isOnline={isOnline}
        />

        {/* Camada de controle superior móvel: Status e Alternador */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Badge Online/Offline */}
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={handleToggleOnline}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full backdrop-blur-md border text-xs font-black shadow-xl transition-all cursor-pointer ${
                isOnline
                  ? 'bg-[#121620]/90 border-[#00E676]/40 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                  : 'bg-[#181A20]/90 border-white/10 text-zinc-400'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-[#00E676] animate-pulse' : 'bg-zinc-600'
                }`}
              />
              <span>{isOnline ? 'ONLINE • RECEBENDO TAXAS' : 'OFFLINE'}</span>
            </button>
          </div>

          {/* Botão de Troca Rápida de Perfil (Freelancer / Contratante) para testes */}
          <div className="pointer-events-auto hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                switchRole(user?.role === 'Freelancer' ? 'Contratante' : 'Freelancer')
              }
              className="bg-[#121620]/90 hover:bg-[#1A1F2D] border border-white/10 text-zinc-300 text-xs px-3 py-2 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-colors cursor-pointer"
              title="Alternar Perfil para Validação"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Perfil: <strong className="text-white">{user?.role || 'Freelancer'}</strong></span>
            </button>
          </div>
        </div>

        {/* Card Flutuante Mobile para Vaga Selecionada */}
        {isOnline && selectedGig && !isMobileCardDismissed && !isBottomSheetOpen && (
          <div className="lg:hidden absolute bottom-20 left-4 right-4 z-30 animate-fadeIn pointer-events-auto">
            <div
              onClick={() => setIsBottomSheetOpen(true)}
              className="bg-[#141722]/95 backdrop-blur-xl border border-[#00E676]/40 p-4 rounded-2xl shadow-2xl cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#00E676]/20 text-[#00E676] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      {selectedGig.profession}
                    </span>
                    <span className="text-[11px] text-zinc-400">{selectedGig.distance}</span>
                  </div>
                  <h4 className="text-base font-black text-white mt-1">
                    {selectedGig.venueName}
                  </h4>
                  <p className="text-xs text-zinc-400">{selectedGig.neighborhood}, Curitiba</p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-[#00E676]">
                    {selectedGig.rateFormatted}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMobileCardDismissed(true);
                    }}
                    className="block ml-auto mt-1 text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-400">{selectedGig.shiftTime}</span>
                <span className="text-[#00E676] font-bold flex items-center gap-1">
                  Ver detalhes & Aceitar <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 4. BOTTOM SHEET E INTEGRAÇÃO SPECKIT                     */}
      {/* ======================================================== */}
      <GigOfferBottomSheet
        gig={selectedGig}
        isOpen={isBottomSheetOpen}
        onAccept={handleAcceptGig}
        onDecline={handleDeclineGig}
        onClose={() => setIsBottomSheetOpen(false)}
      />
    </div>
  );
};
