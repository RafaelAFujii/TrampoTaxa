import { useState, useMemo } from 'react';
import { 
  Map, 
  Wallet, 
  User, 
  Sliders, 
  Code, 
  Navigation,
  LogOut
} from 'lucide-react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from './constants/maps';
import { LoginScreen } from './screens/LoginScreen';
import { CadastroScreen } from './screens/CadastroScreen';
import { MapDashboardScreen } from './screens/MapDashboardScreen';
import { GigOfferBottomSheet } from './screens/GigOfferBottomSheet';
import { ProfileScreen, UserProfileData } from './screens/ProfileScreen';
import { EarningsScreen } from './screens/EarningsScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { ActiveGigScreen } from './screens/ActiveGigScreen';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { CodeViewerModal } from './components/CodeViewerModal';
import { mockGigs } from './data/mockGigs';
import { GigOffer, ScreenType, NavTab } from './types';

export default function App() {
  // A tela inicial do aplicativo é o login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login-screen');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('map');
  const [selectedGig, setSelectedGig] = useState<GigOffer>(mockGigs[0]);
  const [isOnline, setIsOnline] = useState(true);
  const [activeShiftGig, setActiveShiftGig] = useState<GigOffer | null>(null);

  // Perfil de usuário editável
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Gabriel Silva',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    roleDescription: 'Bartender & Garçom Pro',
    phone: '(41) 99999-0000',
    email: 'freelancer@curitiba.com',
    city: 'Curitiba, PR'
  });

  // Modal de Oferta
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // Configurações do Freelancer
  const [userSettings, setUserSettings] = useState({
    bartenderActive: true,
    garcomActive: true,
    maxDistanceKm: 10,
  });

  // Code Modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Filtragem de vagas baseada em preferências
  const filteredGigs = useMemo(() => {
    return mockGigs.filter((gig) => {
      if (gig.profession === 'Bartender' && !userSettings.bartenderActive) return false;
      if (gig.profession === 'Garçom' && !userSettings.garcomActive) return false;
      return true;
    });
  }, [userSettings]);

  // Ações de fluxo (sem popups intrusivos)
  const handleSelectGig = (gig: GigOffer) => {
    setSelectedGig(gig);
    setIsOfferModalOpen(true);
  };

  const handleAcceptGig = (gig: GigOffer) => {
    setActiveShiftGig(gig);
    setIsOfferModalOpen(false);
    setCurrentScreen('active-gig-screen');
  };

  const handleDeclineGig = (gig: GigOffer) => {
    setIsOfferModalOpen(false);
  };

  const handleFinishShift = (gig: GigOffer) => {
    setActiveShiftGig(null);
    setCurrentScreen('earnings-screen');
    setActiveNavTab('earnings');
  };

  const handleCancelShift = () => {
    setActiveShiftGig(null);
    setCurrentScreen('map-dashboard');
  };

  const handleNavTabChange = (tab: NavTab) => {
    setActiveNavTab(tab);
    if (tab === 'map') {
      if (activeShiftGig) {
        setCurrentScreen('active-gig-screen');
      } else {
        setCurrentScreen('map-dashboard');
      }
    } else if (tab === 'earnings') {
      setCurrentScreen('earnings-screen');
    } else if (tab === 'profile') {
      setCurrentScreen('profile-screen');
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentScreen('map-dashboard');
    setActiveNavTab('map');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveShiftGig(null);
    setCurrentScreen('login-screen');
  };

  const appContent = (
    <div className="min-h-screen bg-[#0A0B0E] text-white flex flex-col font-sans selection:bg-[#00E676] selection:text-black">
      {/* ======================================================== */}
      {/* DESKTOP & MOBILE RESPONSIVE HEADER BAR                  */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 bg-[#121418]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setCurrentScreen('map-dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-xl bg-[#00E676] text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,230,118,0.5)]">
              T
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-base text-white">TRAMPO</span>
                <span className="text-[10px] font-black uppercase bg-[#00E676]/15 text-[#00E676] px-1.5 py-0.5 rounded border border-[#00E676]/30">
                  CWB
                </span>
              </div>
              <p className="hidden sm:block text-[10px] text-zinc-400">
                Plataforma de Turnos para Restaurantes
              </p>
            </div>
          </div>
        </div>

        {/* Center: Desktop Top Navigation Links (visible when logged in) */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1 bg-[#181a20] p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => {
                if (activeShiftGig) {
                  setCurrentScreen('active-gig-screen');
                } else {
                  setCurrentScreen('map-dashboard');
                }
                setActiveNavTab('map');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                (currentScreen === 'map-dashboard' || currentScreen === 'active-gig-screen')
                  ? 'bg-[#00E676] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Mapa de Vagas</span>
              {activeShiftGig && (
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              )}
            </button>

            <button
              onClick={() => {
                setCurrentScreen('earnings-screen');
                setActiveNavTab('earnings');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'earnings-screen'
                  ? 'bg-[#00E676] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Ganhos</span>
            </button>

            <button
              onClick={() => {
                setCurrentScreen('profile-screen');
                setActiveNavTab('profile');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'profile-screen'
                  ? 'bg-[#00E676] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Meu Perfil</span>
            </button>

            <button
              onClick={() => setCurrentScreen('settings-screen')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentScreen === 'settings-screen'
                  ? 'bg-[#00E676] text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Configurações</span>
            </button>
          </nav>
        )}

        {/* Right: Actions, Online Status & User Profile Widget */}
        <div className="flex items-center gap-3">
          {/* Turno em andamento indicator badge */}
          {activeShiftGig && currentScreen !== 'active-gig-screen' && (
            <button
              onClick={() => setCurrentScreen('active-gig-screen')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676] text-xs font-bold animate-pulse cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Turno Ativo no {activeShiftGig.venueName}</span>
            </button>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Online/Offline status pill */}
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isOnline
                    ? 'bg-[#00E676]/10 text-[#00E676] border-[#00E676]/30'
                    : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#00E676]' : 'bg-red-500'}`} />
                <span>{isOnline ? 'Online' : 'Offline'}</span>
              </button>

              {/* User Avatar dropdown / profile trigger */}
              <div 
                onClick={() => setCurrentScreen('profile-screen')}
                className="flex items-center gap-2 pl-1 cursor-pointer group"
                title="Ver e Editar Perfil"
              >
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#00E676] transition-transform group-hover:scale-105"
                />
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                title="Sair da Conta"
                className="hidden sm:flex p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentScreen('login-screen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentScreen === 'login-screen' ? 'bg-[#00E676] text-black font-extrabold shadow-sm' : 'text-zinc-300 hover:text-white'
                }`}
              >
                Entrar
              </button>
              <button
                onClick={() => setCurrentScreen('cadastro-screen')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  currentScreen === 'cadastro-screen' ? 'bg-[#00E676] text-black font-extrabold shadow-sm' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Cadastrar
              </button>
            </div>
          )}

          {/* View Code Modal Button */}
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1E26] hover:bg-[#252934] border border-white/10 text-xs font-semibold text-zinc-200 transition-colors cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-[#00E676]" />
            <span className="hidden sm:inline">Código</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* MAIN VIEWPORT - FULLPAGE RESPONSIVE VIEWS               */}
      {/* ======================================================== */}
      <main className="flex-1 w-full flex flex-col relative overflow-hidden">
        {/* 1. Login Screen */}
        {currentScreen === 'login-screen' && (
          <LoginScreen
            onNavigateToCadastro={() => setCurrentScreen('cadastro-screen')}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {/* 2. Cadastro Screen */}
        {currentScreen === 'cadastro-screen' && (
          <CadastroScreen
            onNavigateToLogin={() => setCurrentScreen('login-screen')}
            onCadastroSuccess={handleLoginSuccess}
          />
        )}

        {/* 3. Mapa Principal (Desktop Sidebar + Full Interactive Map no tema escuro) */}
        {currentScreen === 'map-dashboard' && (
          <MapDashboardScreen
            gigs={filteredGigs}
            selectedGigId={selectedGig.id}
            onSelectGig={handleSelectGig}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            onOpenProfile={() => {
              setCurrentScreen('profile-screen');
              setActiveNavTab('profile');
            }}
            onOpenEarnings={() => {
              setCurrentScreen('earnings-screen');
              setActiveNavTab('earnings');
            }}
          />
        )}

        {/* 4. Active Gig Screen (Turno em andamento com rota real Google Maps) */}
        {currentScreen === 'active-gig-screen' && (
          <ActiveGigScreen
            gig={activeShiftGig || selectedGig}
            onFinishShift={handleFinishShift}
            onCancelGig={handleCancelShift}
            onBackToDashboard={() => setCurrentScreen('map-dashboard')}
          />
        )}

        {/* 5. Ganhos Screen */}
        {currentScreen === 'earnings-screen' && (
          <EarningsScreen
            onBackToMap={() => {
              setCurrentScreen('map-dashboard');
              setActiveNavTab('map');
            }}
          />
        )}

        {/* 6. Perfil Screen */}
        {currentScreen === 'profile-screen' && (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={(updated: UserProfileData) => setUserProfile(updated)}
            onLogout={handleLogout}
            onOpenSettings={() => setCurrentScreen('settings-screen')}
          />
        )}

        {/* 7. Configurações Screen */}
        {currentScreen === 'settings-screen' && (
          <SettingsScreen
            onBack={() => {
              setCurrentScreen('map-dashboard');
              setActiveNavTab('map');
            }}
            onSave={(updated) => setUserSettings(updated)}
          />
        )}
      </main>

      {/* Modal / Bottom Sheet da Oferta (Abre quando seleciona vaga no mapa) */}
      {isOfferModalOpen && (
        <GigOfferBottomSheet
          gig={selectedGig}
          onAccept={handleAcceptGig}
          onDecline={handleDeclineGig}
          onClose={() => setIsOfferModalOpen(false)}
        />
      )}

      {/* Bottom Navigation para Mobile/Tablet (Mapa, Ganhos, Perfil) */}
      {isLoggedIn && (
        currentScreen === 'map-dashboard' || 
        currentScreen === 'earnings-screen' || 
        currentScreen === 'profile-screen'
      ) && (
        <BottomNavigation
          activeTab={activeNavTab}
          onTabChange={handleNavTabChange}
        />
      )}

      {/* Code Viewer Modal */}
      <CodeViewerModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );

  if (GOOGLE_MAPS_API_KEY && GOOGLE_MAPS_API_KEY.trim().length > 5) {
    return (
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY.trim()} libraries={['marker']}>
        {appContent}
      </APIProvider>
    );
  }

  return appContent;
}
