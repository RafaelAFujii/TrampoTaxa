import React, { useState } from 'react';
import { Copy, Check, Code, FileCode2 } from 'lucide-react';

interface CodeFile {
  name: string;
  category: 'Novos Componentes (Expansão)' | 'Telas Originais' | 'Componentes Base';
  code: string;
}

const codeSnippets: CodeFile[] = [
  {
    name: 'BottomNavigation.tsx',
    category: 'Novos Componentes (Expansão)',
    code: `import React from 'react';
import { Map, Wallet, User } from 'lucide-react';
import { NavTab } from '../../types';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  className = '',
}) => {
  const tabs = [
    { id: 'map' as NavTab, label: 'Mapa', icon: Map },
    { id: 'earnings' as NavTab, label: 'Ganhos', icon: Wallet },
    { id: 'profile' as NavTab, label: 'Perfil', icon: User },
  ];

  return (
    <nav
      className={\`fixed bottom-0 left-0 right-0 z-40 bg-[#141519]/95 backdrop-blur-xl border-t border-white/10 px-6 py-2 pb-5 flex items-center justify-around shadow-[0_-8px_25px_rgba(0,0,0,0.7)] \${className}\`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center gap-1 py-1 px-4 transition-all duration-200 cursor-pointer select-none group"
          >
            <div className="relative">
              <Icon
                className={\`w-5 h-5 transition-transform duration-200 group-hover:scale-110 \${
                  isActive ? 'text-[#00E676]' : 'text-gray-500 hover:text-zinc-300'
                }\`}
              />
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#00E676] shadow-[0_0_8px_#00E676]" />
              )}
            </div>
            <span
              className={\`text-[10px] font-semibold tracking-wider transition-colors duration-200 \${
                isActive ? 'text-[#00E676]' : 'text-gray-500 group-hover:text-zinc-300'
              }\`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};`,
  },
  {
    name: 'ProfileScreen.tsx',
    category: 'Novos Componentes (Expansão)',
    code: `import React from 'react';
import { 
  Star, 
  Settings, 
  History, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';
import { StatusBar } from '../components/ui/StatusBar';
import { HomeIndicator } from '../components/ui/HomeIndicator';

interface ProfileScreenProps {
  onOpenSettings?: () => void;
  onLogout?: () => void;
  onViewHistory?: () => void;
  onHelpCenter?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenSettings,
  onLogout,
  onViewHistory,
  onHelpCenter,
}) => {
  return (
    <div className="w-full h-full min-h-[720px] bg-[#0E0F12] text-white flex flex-col justify-between relative overflow-hidden select-none">
      <StatusBar time="9:41" />

      <div className="flex-1 px-5 pt-2 pb-24 overflow-y-auto space-y-5">
        {/* Cabeçalho do Perfil */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="relative mb-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Avatar do Freelancer"
              className="w-24 h-24 rounded-full object-cover border-3 border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.35)]"
            />
            <div className="absolute -bottom-1.5 right-1 bg-[#1C1C1E] border border-white/10 p-1.5 rounded-full shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            </div>
          </div>

          <h2 className="text-xl font-black tracking-tight text-white">
            Gabriel Silva
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Bartender & Garçom Pro • Curitiba, PR
          </p>

          <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1E] border border-white/10 shadow-sm">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-black text-white">4.9</span>
            <span className="text-[10px] text-zinc-400 font-medium">(128 avaliações)</span>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1">
            Estatísticas Rápidas
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Taxas Concluídas
                </span>
                <div className="w-7 h-7 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                  <Award className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">84</span>
                <span className="text-[10px] text-[#00E676] font-semibold block mt-0.5">+6 esta semana</span>
              </div>
            </div>

            <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Ganhos da Semana
                </span>
                <div className="w-7 h-7 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-[#00E676] tracking-tight">R$ 1.280</span>
                <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">Meta: R$ 1.500</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Menus */}
        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2.5 px-1">
            Conta & Preferências
          </h3>
          <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden shadow-sm divide-y divide-white/5">
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300">
                  <Settings className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">Configurações</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={onViewHistory}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300">
                  <History className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">Histórico de Repasses</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={onHelpCenter}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-zinc-300">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-white">Central de Ajuda</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-red-500/10 transition-colors cursor-pointer text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-semibold text-red-400 group-hover:text-red-300">
                  Sair da Conta
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400/50" />
            </button>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};`,
  },
  {
    name: 'SettingsScreen.tsx',
    category: 'Novos Componentes (Expansão)',
    code: `import React, { useState } from 'react';
import { ChevronLeft, Sliders, Wine, Utensils, MapPin } from 'lucide-react';
import { StatusBar } from '../components/ui/StatusBar';
import { HomeIndicator } from '../components/ui/HomeIndicator';

interface SettingsScreenProps {
  onBack: () => void;
  onSave?: (settings: {
    bartenderActive: boolean;
    garcomActive: boolean;
    maxDistanceKm: number;
  }) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onSave,
}) => {
  const [bartenderActive, setBartenderActive] = useState(true);
  const [garcomActive, setGarcomActive] = useState(true);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDistanceKm(Number(e.target.value));
  };

  const handleBack = () => {
    if (onSave) {
      onSave({ bartenderActive, garcomActive, maxDistanceKm });
    }
    onBack();
  };

  return (
    <div className="w-full h-full min-h-[720px] bg-[#0E0F12] text-white flex flex-col justify-between relative overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Header com Voltar */}
      <div className="px-5 pt-2 pb-3 flex items-center justify-between border-b border-white/5">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1.5 py-1 px-2.5 -ml-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 text-[#00E676]" />
          <span className="text-xs font-semibold">Voltar</span>
        </button>

        <h1 className="text-base font-extrabold tracking-tight text-white">
          Configurações
        </h1>
        <div className="w-12" />
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-6 pb-20">
        {/* Seção: Preferências de Trabalho (Toggles independentes) */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <Sliders className="w-3.5 h-3.5 text-[#00E676]" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Preferências de Trabalho
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mb-3 px-1">
            Selecione quais tipos de vagas deseja receber. Você pode ativar ambas.
          </p>

          <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 shadow-sm">
            {/* Bartender */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={\`w-9 h-9 rounded-xl flex items-center justify-center transition-colors \${
                    bartenderActive
                      ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30'
                      : 'bg-white/5 text-zinc-400'
                  }\`}
                >
                  <Wine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bartender</h4>
                  <p className="text-[11px] text-zinc-400">Coquetelaria e drinks</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setBartenderActive(!bartenderActive)}
                className={\`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none \${
                  bartenderActive ? 'bg-[#00E676]' : 'bg-zinc-700'
                }\`}
              >
                <span
                  className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out \${
                    bartenderActive ? 'translate-x-5' : 'translate-x-0'
                  }\`}
                />
              </button>
            </div>

            {/* Garçom */}
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div
                  className={\`w-9 h-9 rounded-xl flex items-center justify-center transition-colors \${
                    garcomActive
                      ? 'bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30'
                      : 'bg-white/5 text-zinc-400'
                  }\`}
                >
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Garçom</h4>
                  <p className="text-[11px] text-zinc-400">Atendimento de salão</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGarcomActive(!garcomActive)}
                className={\`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none \${
                  garcomActive ? 'bg-[#00E676]' : 'bg-zinc-700'
                }\`}
              >
                <span
                  className={\`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out \${
                    garcomActive ? 'translate-x-5' : 'translate-x-0'
                  }\`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Seção: Raio de Distância */}
        <div>
          <div className="flex items-center gap-2 mb-2 px-1">
            <MapPin className="w-3.5 h-3.5 text-[#00E676]" />
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Raio de Distância
            </h3>
          </div>

          <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-300 font-medium">Distância máxima de busca</span>
              <span className="text-sm font-extrabold text-[#00E676] bg-[#00E676]/10 px-2.5 py-0.5 rounded-full border border-[#00E676]/20">
                {maxDistanceKm} km
              </span>
            </div>

            <div className="py-2">
              <input
                type="range"
                min="1"
                max="15"
                step="1"
                value={maxDistanceKm}
                onChange={handleSliderChange}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00E676]"
              />
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold mt-1.5 px-0.5">
                <span>1 km</span>
                <span>5 km</span>
                <span>10 km</span>
                <span>15 km</span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Vagas fora deste raio não emitirão notificações sonoras de alta prioridade.
            </p>
          </div>
        </div>
      </div>

      <HomeIndicator />
    </div>
  );
};`,
  },
  {
    name: 'ActiveGigScreen.tsx',
    category: 'Novos Componentes (Expansão)',
    code: `import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ExternalLink,
  ShieldCheck,
  Phone
} from 'lucide-react';
import { StatusBar } from '../components/ui/StatusBar';
import { HomeIndicator } from '../components/ui/HomeIndicator';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { GigOffer } from '../types';

interface ActiveGigScreenProps {
  gig: GigOffer;
  onFinishShift?: (gig: GigOffer) => void;
  onOpenNavigation?: () => void;
  onCancelGig?: () => void;
}

export const ActiveGigScreen: React.FC<ActiveGigScreenProps> = ({
  gig,
  onFinishShift,
  onOpenNavigation,
  onCancelGig,
}) => {
  const [shiftStatus, setShiftStatus] = useState<'heading_to_venue' | 'arrived_working'>('heading_to_venue');

  const handlePrimaryAction = () => {
    if (shiftStatus === 'heading_to_venue') {
      setShiftStatus('arrived_working');
    } else {
      if (onFinishShift) onFinishShift(gig);
    }
  };

  const handleLaunchExternalMap = () => {
    if (onOpenNavigation) {
      onOpenNavigation();
    } else {
      window.open(
        \`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(\`\${gig.venueName} Curitiba\`)}\`,
        '_blank'
      );
    }
  };

  return (
    <div className="w-full h-full min-h-[720px] bg-[#0E0F12] text-white flex flex-col justify-between relative overflow-hidden select-none">
      <StatusBar time="9:41" />

      {/* Cabeçalho */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00E676]" />
          </span>
          <h1 className="text-sm font-black tracking-wider uppercase text-white">
            Turno em Andamento
          </h1>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30">
          {shiftStatus === 'heading_to_venue' ? 'A Caminho' : 'Em Serviço'}
        </span>
      </div>

      <div className="flex-1 px-5 py-4 overflow-y-auto space-y-4 pb-24">
        {/* Card Principal */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full border border-[#00E676]/20">
                {gig.profession}
              </span>
              <h2 className="text-xl font-black text-white mt-1.5 tracking-tight">
                {gig.venueName}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{gig.neighborhood} • Curitiba</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">TAXA</span>
              <span className="text-xl font-black text-[#00E676] block">{gig.rateFormatted}</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-2.5 flex items-center justify-between text-xs text-zinc-300">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#00E676]" />
              <span className="font-semibold">{gig.shiftTime}</span>
            </div>
            <span className="text-[11px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md">
              {gig.shiftDuration}
            </span>
          </div>
        </div>

        {/* Placeholder retangular para o mapa da rota */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-md">
          <div className="bg-gray-800 h-44 w-full flex flex-col justify-between p-3.5 relative overflow-hidden">
            {/* Traçado GPS */}
            <svg
              className="absolute inset-0 w-full h-full opacity-60"
              viewBox="0 0 300 160"
              preserveAspectRatio="xMidYMid slice"
            >
              <path
                d="M -10 120 C 50 110 80 140 130 90 C 180 40 220 70 290 30"
                stroke="#00E676"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx="20" cy="118" r="5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
              <circle cx="270" cy="35" r="7" fill="#00E676" stroke="#fff" strokeWidth="2" />
            </svg>

            {/* ETA */}
            <div className="relative z-10 self-start bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
              <span className="text-xs font-bold text-white">
                Estimativa de Chegada (ETA) - 4.5 km
              </span>
            </div>

            <div className="relative z-10 self-end bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-semibold text-zinc-300">
              ~ 12 min de trânsito
            </div>
          </div>
        </div>

        {/* Botão Navegar (Waze/Maps) */}
        <button
          type="button"
          onClick={handleLaunchExternalMap}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#1C1C1E] hover:bg-[#252528] active:bg-[#2c2c30] text-white border border-white/10 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm group"
        >
          <Navigation className="w-4 h-4 text-[#00E676] transition-transform group-hover:scale-110" />
          <span>Navegar (Waze / Maps)</span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500 ml-1" />
        </button>

        <div className="bg-[#1C1C1E]/60 border border-white/5 rounded-2xl p-3 flex items-start gap-2.5 text-left">
          <ShieldCheck className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
          <div className="text-[11px] text-zinc-400">
            <span className="text-zinc-200 font-semibold block">Apresentação:</span>
            Apresente-se ao gerente informando que você veio via <strong className="text-white">Trampo CWB</strong>.
          </div>
        </div>
      </div>

      {/* Botão Inferior Principal */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0E0F12] via-[#0E0F12]/95 to-transparent pt-6 z-20">
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
            ? 'CHEGUEI NO LOCAL'
            : 'FINALIZAR TURNO'}
        </PrimaryButton>

        <HomeIndicator />
      </div>
    </div>
  );
};`,
  },
];

interface CodeViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<string>(codeSnippets[0].name);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentSnippet = codeSnippets.find((s) => s.name === selectedFile) || codeSnippets[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#101216] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14171d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00E676]/10 border border-[#00E676]/40 flex items-center justify-center text-[#00E676]">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Código dos Componentes Modularizados
              </h3>
              <p className="text-xs text-zinc-400">
                React + TypeScript + Tailwind CSS (Dark Mode & #00E676)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00E676] hover:bg-[#00FF77] text-black text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Arquivo'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#1f232b] hover:bg-[#282d37] text-zinc-300 text-xs font-semibold cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar file list */}
          <div className="w-64 border-r border-white/10 bg-[#0c0e12] p-3 flex flex-col gap-1 overflow-y-auto">
            <span className="text-[10px] font-bold text-zinc-500 uppercase px-2 py-1 tracking-wider">
              Arquivos de Componentes
            </span>
            {codeSnippets.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file.name)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                  selectedFile === file.name
                    ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30 font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}
          </div>

          {/* Code preview area */}
          <div className="flex-1 bg-[#090A0D] p-5 overflow-auto text-xs font-mono leading-relaxed text-zinc-300">
            <pre className="whitespace-pre">{currentSnippet.code}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
