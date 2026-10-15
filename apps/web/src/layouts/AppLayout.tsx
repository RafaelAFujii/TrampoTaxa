import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Map,
  Wallet,
  User,
  Sliders,
  Code,
  LogOut,
  Building2,
  Briefcase,
  PlusCircle,
  BarChart3,
  MessageSquare,
  ArrowRightLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { CodeViewerModal } from '../components/CodeViewerModal';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { NavTab } from '@trampotaxa/shared';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, switchRole } = useAuth();

  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const isContractor = user?.role === 'Contratante';

  // Determina a aba ativa a partir da rota atual
  const getActiveTab = (): NavTab => {
    const path = location.pathname;
    if (path.includes('/contractor/gigs')) return 'contractor-gigs';
    if (path.includes('/contractor/create')) return 'contractor-create';
    if (path.includes('/contractor/reports')) return 'contractor-reports';
    if (path.includes('/contractor/chat')) return 'contractor-chat';
    if (path.includes('/earnings')) return 'earnings';
    if (path.includes('/profile') || path.includes('/settings')) return 'profile';
    return 'map';
  };

  const handleNavTabChange = (tab: NavTab) => {
    switch (tab) {
      case 'contractor-gigs':
        navigate('/contractor/gigs');
        break;
      case 'contractor-create':
        navigate('/contractor/create');
        break;
      case 'contractor-reports':
        navigate('/contractor/reports');
        break;
      case 'contractor-chat':
        navigate('/contractor/chat');
        break;
      case 'map':
        navigate('/map');
        break;
      case 'earnings':
        navigate('/earnings');
        break;
      case 'profile':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const handleRoleToggle = () => {
    const nextRole = isContractor ? 'Freelancer' : 'Contratante';
    switchRole(nextRole);
    if (nextRole === 'Contratante') {
      navigate('/contractor/gigs');
    } else {
      navigate('/map');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col font-sans selection:bg-[#00E676] selection:text-black">
      {/* ======================================================== */}
      {/* DESKTOP & MOBILE RESPONSIVE HEADER BAR                  */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#121418]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(isContractor ? '/contractor/gigs' : '/map')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#00E676] text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,230,118,0.5)] transition-transform group-hover:scale-105">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">TRAMPO</span>
                <span className="text-[10px] font-black uppercase bg-[#00E676]/15 text-[#00E676] px-1.5 py-0.5 rounded border border-[#00E676]/30">
                  {isContractor ? 'B2B' : 'CWB'}
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-zinc-400">
                {isContractor
                  ? 'Painel de Contratação & Taxas'
                  : 'Plataforma de Turnos para Restaurantes'}
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Top Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#181a20] p-1 rounded-2xl border border-white/5">
          {isContractor ? (
            /* Links do Contratante */
            <>
              <button
                type="button"
                onClick={() => navigate('/contractor/gigs')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/contractor/gigs'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Minhas Vagas</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/contractor/create')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/contractor/create'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Criar Taxa</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/contractor/reports')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/contractor/reports'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Relatórios</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/contractor/chat')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/contractor/chat'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/profile'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Estabelecimento</span>
              </button>
            </>
          ) : (
            /* Links do Freelancer */
            <>
              <button
                type="button"
                onClick={() => navigate('/map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/map'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Mapa de Vagas</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/earnings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/earnings'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Ganhos</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/profile'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Meu Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/settings')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/settings'
                    ? 'bg-[#00E676] text-black shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>Configurações</span>
              </button>
            </>
          )}
        </nav>

        {/* Right: Role Switcher, Online Status, Profile & Code Modal */}
        <div className="flex items-center gap-2.5">
          {/* Botão de Instalação Mobile PWA */}
          <PWAInstallButton />

          {/* Alternador Rápido de Perfil (Contratante <-> Freelancer) */}
          <button
            type="button"
            onClick={handleRoleToggle}
            title={`Alternar para modo ${isContractor ? 'Freelancer' : 'Contratante'}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1B1E26] hover:bg-[#252934] border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 text-[#00E676]" />
            <span className="hidden sm:inline">
              Modo: <strong className="text-white">{user?.role || 'Freelancer'}</strong>
            </span>
          </button>

          {/* User profile dropdown trigger */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 pl-1 cursor-pointer group"
            title="Ver e Editar Perfil"
          >
            <img
              src={
                user?.avatarUrl ||
                'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240&auto=format&fit=crop&q=80'
              }
              alt={user?.name || 'Perfil'}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#00E676] transition-transform group-hover:scale-105"
            />
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={handleLogout}
            title="Sair da Conta"
            className="flex p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* View Code Modal Button */}
          <button
            type="button"
            onClick={() => setIsCodeModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1E26] hover:bg-[#252934] border border-white/10 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Código</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* CONTEÚDO DA TELA ATUAL                                   */}
      {/* ======================================================== */}
      <main className="flex-1 flex flex-col relative pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* ======================================================== */}
      {/* MOBILE BOTTOM NAVIGATION                                */}
      {/* ======================================================== */}
      <BottomNavigation
        role={user?.role}
        activeTab={getActiveTab()}
        onTabChange={handleNavTabChange}
      />

      {/* ======================================================== */}
      {/* MODAL DO VISUALIZADOR DE CÓDIGO FONTE                    */}
      {/* ======================================================== */}
      <CodeViewerModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />
    </div>
  );
};
