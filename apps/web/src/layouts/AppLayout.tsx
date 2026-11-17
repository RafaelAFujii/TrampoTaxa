import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Map,
  Wallet,
  User,
  Sliders,
  LogOut,
  Building2,
  Briefcase,
  PlusCircle,
  BarChart3,
  MessageSquare,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BottomNavigation } from '../components/navigation/BottomNavigation';
import { NavTab } from '@trampotaxa/shared';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isContractor = user?.role === 'Contratante';

  // Determina a aba ativa a partir da rota atual
  const getActiveTab = (): NavTab => {
    const path = location.pathname;
    if (path.includes('/contractor/dashboard')) return 'contractor-dashboard';
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
      case 'contractor-dashboard':
        navigate('/contractor/dashboard');
        break;
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

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const currentPath = location.pathname;

  return (
    <div className="h-screen bg-[#171B1A] text-[#F7F9F7] flex flex-col font-sans overflow-hidden">
      {/* ======================================================== */}
      {/* DESKTOP & MOBILE RESPONSIVE HEADER BAR                  */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#171B1A]/95 border-b border-[#E7ECE8]/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => navigate(isContractor ? '/contractor/dashboard' : '/map')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-md border border-[#34745A] bg-[#34745A] text-white font-black flex items-center justify-center text-sm transition-colors group-hover:bg-[#3F8266]">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">TRAMPO</span>
                <span className="text-[10px] font-bold bg-[#34745A]/15 text-[#E7ECE8] px-1.5 py-0.5 rounded-sm border border-[#34745A]/30">
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
        <nav className="hidden lg:flex items-center gap-1 bg-[#202421] p-1 rounded-lg border border-[#E7ECE8]/10">
          {isContractor ? (
            /* Links do Contratante */
            <>
              <button
                type="button"
                onClick={() => navigate('/contractor/dashboard')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/contractor/dashboard' || currentPath === '/contractor'
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/contractor/gigs')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/contractor/gigs'
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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
                    ? 'bg-[#34745A] text-[#F7F9F7] border border-[#34745A]'
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

        {/* Right: Online Status & Profile */}
        <div className="flex items-center gap-2.5">
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
              className="w-9 h-9 rounded-md object-cover border border-[#34745A]"
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
        </div>
      </header>

      {/* ======================================================== */}
      {/* CONTEÚDO DA TELA ATUAL                                   */}
      {/* ======================================================== */}
      <main
        className={`flex-1 flex flex-col relative pb-16 lg:pb-0 min-h-0 ${
          location.pathname === '/map' ? 'overflow-hidden' : 'overflow-y-auto'
        }`}
      >
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
    </div>
  );
};
