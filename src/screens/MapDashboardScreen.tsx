import React, { useState } from 'react';
import { 
  Power, 
  Wallet, 
  MapPin, 
  Clock, 
  ArrowRight,
  X,
  WifiOff
} from 'lucide-react';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { MapPlaceholder } from '../components/map/MapPlaceholder';
import { GigOffer } from '../types';

interface MapDashboardScreenProps {
  gigs: GigOffer[];
  onSelectGig: (gig: GigOffer) => void;
  selectedGigId?: string;
  isOnline?: boolean;
  onToggleOnline?: () => void;
  onOpenProfile?: () => void;
  onOpenEarnings?: () => void;
  earningsToday?: string;
}

export const MapDashboardScreen: React.FC<MapDashboardScreenProps> = ({
  gigs,
  onSelectGig,
  selectedGigId,
  isOnline: controlledOnline,
  onToggleOnline,
  onOpenProfile,
  onOpenEarnings,
  earningsToday = 'R$ 150,00',
}) => {
  const [internalOnline, setInternalOnline] = useState(true);
  const isOnline = controlledOnline !== undefined ? controlledOnline : internalOnline;
  const [filterProfession, setFilterProfession] = useState<'All' | 'Bartender' | 'Garçom'>('All');
  const [isMobileCardDismissed, setIsMobileCardDismissed] = useState(false);

  const handleToggle = () => {
    if (onToggleOnline) {
      onToggleOnline();
    } else {
      setInternalOnline(!internalOnline);
    }
  };

  // Vagas visíveis filtradas
  const displayedGigs = gigs.filter((g) => {
    if (filterProfession === 'All') return true;
    return g.profession === filterProfession;
  });

  // Vaga selecionada
  const activeGig = displayedGigs.find((g) => g.id === selectedGigId) || null;

  const handleSelectGigInternal = (gig: GigOffer) => {
    setIsMobileCardDismissed(false);
    onSelectGig(gig);
  };

  return (
    <div className="w-full flex-1 flex flex-col lg:flex-row relative bg-[#0A0B0E] h-[calc(100vh-4rem)] min-h-[500px] overflow-hidden">
      {/* ======================================================== */}
      {/* SIDEBAR DESKTOP: Minimalista, escura e focada             */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex w-96 flex-col justify-between border-r border-white/5 bg-[#0F1117] z-20 shrink-0 h-full">
        <div className="p-5 flex flex-col h-full overflow-hidden">
          {/* Header do Perfil & Ganhos */}
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
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
                <h3 className="text-sm font-bold text-white">Gabriel Silva</h3>
                <span className={`text-[11px] font-medium ${isOnline ? 'text-[#00E676]' : 'text-zinc-500'}`}>
                  {isOnline ? 'Disponível no Radar' : 'Desconectado'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenEarnings || onOpenProfile}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5 text-[#00E676]" />
              <span className="text-xs font-black text-white">{earningsToday}</span>
            </button>
          </div>

          {/* Filtros de Vagas (Apenas se Online) */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-zinc-400">
                {isOnline ? `Vagas disponíveis (${displayedGigs.length})` : 'Radar Desativado'}
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

          {/* Lista de Vagas: Oculta completamente quando Offline */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {!isOnline ? (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-zinc-800/80 border border-white/5 flex items-center justify-center text-zinc-400 mb-3">
                  <WifiOff className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Você está Offline</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-[220px]">
                  Fique online para receber ofertas de turnos e visualizar as vagas no mapa.
                </p>
                <button
                  type="button"
                  onClick={handleToggle}
                  className="mt-4 px-4 py-2 bg-[#00E676] text-black rounded-xl font-bold text-xs hover:bg-[#00FF77] transition-all cursor-pointer shadow-[0_0_15px_rgba(0,230,118,0.25)]"
                >
                  Ficar Online Agora
                </button>
              </div>
            ) : displayedGigs.length > 0 ? (
              displayedGigs.map((gig) => {
                const isSelected = gig.id === selectedGigId;
                return (
                  <div
                    key={gig.id}
                    onClick={() => handleSelectGigInternal(gig)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer select-none group ${
                      isSelected
                        ? 'bg-[#161A23] border-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.15)] ring-1 ring-[#00E676]/40'
                        : 'bg-[#13161F]/60 border-white/5 hover:border-white/15 hover:bg-[#161922]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/5 text-zinc-300">
                            {gig.profession}
                          </span>
                          <span className="text-xs text-zinc-400 truncate">{gig.distance}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1 truncate group-hover:text-[#00E676] transition-colors">
                          {gig.venueName}
                        </h4>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#00E676] shrink-0" />
                          <span className="truncate">{gig.neighborhood}</span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-[#00E676] block">
                          {gig.rateFormatted}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium flex items-center justify-end gap-1 mt-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {gig.shiftTime.split(' - ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Nenhuma vaga encontrada com o filtro selecionado.
              </div>
            )}
          </div>

          {/* Botão de Status Online/Offline */}
          <div className="pt-4 border-t border-white/5">
            <PrimaryButton
              onClick={handleToggle}
              variant={isOnline ? 'dark' : 'neon'}
              icon={<Power className="w-4 h-4" />}
            >
              {isOnline ? 'FICAR OFFLINE' : 'FICAR ONLINE'}
            </PrimaryButton>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAPA PRINCIPAL (100% tela limpa e minimalista)           */}
      {/* ======================================================== */}
      <div className="flex-1 relative w-full h-full min-h-[500px] overflow-hidden bg-[#0A0D14]">
        <MapPlaceholder
          gigs={displayedGigs}
          selectedGigId={selectedGigId}
          onSelectGig={handleSelectGigInternal}
          isOnline={isOnline}
        />

        {/* ======================================================== */}
        {/* BARRA SUPERIOR FLUTUANTE MINIMALISTA (Mobile)           */}
        {/* ======================================================== */}
        <div className="lg:hidden absolute top-3 left-3 right-3 z-30 pointer-events-auto">
          <div className="flex items-center justify-between bg-[#0F1117]/85 backdrop-blur-xl border border-white/10 rounded-full p-1.5 px-3 shadow-2xl">
            {/* Status Online/Offline */}
            <button
              type="button"
              onClick={handleToggle}
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 cursor-pointer"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#00E676] shadow-[0_0_8px_#00E676]' : 'bg-zinc-500'}`} />
              <span className="text-[11px]">{isOnline ? 'Online' : 'Offline'}</span>
            </button>

            {/* Filtro compacto no centro (apenas quando Online) */}
            {isOnline ? (
              <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-full">
                <button
                  type="button"
                  onClick={() => setFilterProfession('All')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
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
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filterProfession === 'Bartender'
                      ? 'bg-[#00E676] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Bar
                </button>
                <button
                  type="button"
                  onClick={() => setFilterProfession('Garçom')}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    filterProfession === 'Garçom'
                      ? 'bg-[#00E676] text-black shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Garçom
                </button>
              </div>
            ) : (
              <span className="text-[11px] font-medium text-zinc-400">Offline</span>
            )}

            {/* Ganhos Hoje */}
            <button
              type="button"
              onClick={onOpenEarnings || onOpenProfile}
              className="flex items-center gap-1 text-[11px] font-black text-[#00E676] cursor-pointer"
            >
              <span>{earningsToday}</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* CARD INFERIOR MINIMALISTA DA VAGA (Mobile - Online apenas)*/}
        {/* ======================================================== */}
        {isOnline && activeGig && !isMobileCardDismissed && (
          <div className="lg:hidden absolute bottom-20 left-3 right-3 z-30 pointer-events-auto animate-fadeIn">
            <div className="bg-[#12141C]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 shadow-2xl flex flex-col gap-2.5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-white/10 text-zinc-300">
                      {activeGig.profession}
                    </span>
                    <span className="text-xs text-zinc-400">{activeGig.neighborhood} • {activeGig.distance}</span>
                  </div>
                  <h4 className="text-sm font-black text-white mt-1">
                    {activeGig.venueName}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-sm font-black text-[#00E676]">
                      {activeGig.rateFormatted}
                    </span>
                    <span className="text-[10px] text-zinc-400 block">
                      {activeGig.shiftTime}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileCardDismissed(true)}
                    className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer ml-1"
                    title="Fechar card"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectGig(activeGig)}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#00E676] hover:bg-[#00FF77] text-black font-black rounded-xl text-xs shadow-[0_0_15px_rgba(0,230,118,0.3)] transition-all cursor-pointer"
              >
                <span>VER DETALHES & ACEITAR</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Pill sutil de quantidade de vagas se nenhum card estiver aberto e estiver online */}
        {isOnline && (!activeGig || isMobileCardDismissed) && (
          <div className="lg:hidden absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="bg-[#12141C]/80 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 shadow-lg text-[11px] text-zinc-300 font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
              <span>{displayedGigs.length} vagas em Curitiba • Toque em um valor</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
