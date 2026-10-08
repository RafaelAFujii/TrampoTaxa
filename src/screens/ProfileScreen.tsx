import React, { useState } from 'react';
import { 
  Star, 
  Settings, 
  History, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Award, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Edit3,
  Camera,
  Check,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { useAuth } from '../context/AuthContext';

export interface UserProfileData {
  name: string;
  avatarUrl: string;
  roleDescription: string;
  phone: string;
  email: string;
  city: string;
}

interface ProfileScreenProps {
  userProfile?: UserProfileData;
  onUpdateProfile?: (updated: UserProfileData) => void;
  onOpenSettings?: () => void;
  onLogout?: () => void;
  onViewHistory?: () => void;
  onHelpCenter?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile: propProfile,
  onUpdateProfile,
  onOpenSettings,
  onLogout,
  onViewHistory,
  onHelpCenter,
}) => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();

  const userProfile = propProfile || {
    name: user?.name || 'Gabriel Silva',
    avatarUrl:
      user?.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    roleDescription: user?.role === 'Contratante' ? 'Gestor de Contratações' : 'Bartender & Garçom Pro',
    phone: user?.phone || '(41) 99999-0000',
    email: user?.email || 'freelancer@curitiba.com',
    city: 'Curitiba, PR',
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatarUrl);
  const [roleDescription, setRoleDescription] = useState(userProfile.roleDescription);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [city, setCity] = useState(userProfile.city);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const handleOpenSettings = () => {
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      navigate('/settings');
    }
  };

  // Avatares rápidos para o usuário escolher com 1 clique
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfileData = {
      name,
      avatarUrl,
      roleDescription,
      phone,
      email,
      city
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(userProfile.name);
    setAvatarUrl(userProfile.avatarUrl);
    setRoleDescription(userProfile.roleDescription);
    setPhone(userProfile.phone);
    setEmail(userProfile.email);
    setCity(userProfile.city);
    setIsEditing(false);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex justify-center pb-24 lg:pb-10">
      <div className="w-full max-w-5xl space-y-6">
        {/* Profile Hero Header Card */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 text-center sm:text-left">
            {/* Avatar with edit badge */}
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.35)]"
              />
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                title="Trocar Foto de Perfil"
                className="absolute -bottom-2 -right-2 bg-[#1C1C1E] hover:bg-[#28282b] border border-white/20 p-2 rounded-xl shadow-md text-[#00E676] cursor-pointer transition-transform group-hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center justify-center sm:justify-start gap-3">
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                      {name}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditing(!isEditing)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-[#00E676] transition-colors cursor-pointer"
                      title="Editar Informações"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                    {roleDescription} • {city}
                  </p>
                </div>

                <div className="flex items-center justify-center sm:justify-end gap-2.5">
                  <div className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-[#1C1C1E] border border-white/10 shadow-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-black text-white">4.9</span>
                    <span className="text-xs text-zinc-400 font-medium">(128 avaliações)</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#00E676]/10 hover:bg-[#00E676]/20 border border-[#00E676]/30 text-[#00E676] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Fechar Edição' : 'Editar Perfil'}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#00E676]/10 text-[#00E676] border border-[#00E676]/30">
                  Verificado Trampo CWB
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/5">
                  Membro desde 2024
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/5">
                  Chave PIX Cadastrada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Edição de Informações (Nome, Foto, Contatos) */}
        {isEditing && (
          <div className="bg-[#121418] border border-[#00E676]/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Editar Informações do Freelancer
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Atualize seus dados cadastrais, cargo e foto de perfil
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Seleção rápida de Avatar */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                  ESCOLHA UMA FOTO DE PERFIL OU COLE A URL
                </label>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {presetAvatars.map((preset, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`relative w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === preset
                          ? 'border-[#00E676] scale-105 shadow-[0_0_12px_rgba(0,230,118,0.5)]'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      <img src={preset} alt={`Opção ${index + 1}`} className="w-full h-full object-cover" />
                      {avatarUrl === preset && (
                        <div className="absolute inset-0 bg-[#00E676]/20 flex items-center justify-center">
                          <Check className="w-4 h-4 text-[#00E676] stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="URL da imagem (ex: https://...)"
                  className="w-full bg-[#18191D] text-white text-xs placeholder-zinc-500 rounded-xl px-4 py-2.5 border border-white/10 focus:outline-none focus:border-[#00E676]"
                />
              </div>

              {/* Campos de texto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    NOME COMPLETO
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Gabriel Silva"
                      required
                      className="w-full bg-[#18191D] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#00E676]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    ESPECIALIDADE / CARGO
                  </label>
                  <input
                    type="text"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    placeholder="Bartender & Garçom Pro"
                    required
                    className="w-full bg-[#18191D] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    TELEFONE / WHATSAPP
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(41) 99999-0000"
                    required
                    className="w-full bg-[#18191D] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#00E676]"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    CIDADE & ESTADO
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Curitiba, PR"
                    required
                    className="w-full bg-[#18191D] text-white text-sm rounded-xl px-4 py-3 border border-white/10 focus:outline-none focus:border-[#00E676]"
                  />
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <div className="w-48">
                  <PrimaryButton type="submit">
                    SALVAR ALTERAÇÕES
                  </PrimaryButton>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Taxas Concluídas */}
          <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Taxas Concluídas
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-white tracking-tight">84</span>
              <span className="text-xs text-[#00E676] font-semibold block mt-1">+6 nesta semana</span>
            </div>
          </div>

          {/* Ganhos da Semana */}
          <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Ganhos da Semana
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-[#00E676] tracking-tight">R$ 1.280</span>
              <span className="text-xs text-zinc-400 font-medium block mt-1">Meta: R$ 1.500</span>
            </div>
          </div>

          {/* Pontualidade */}
          <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Taxa de Comparecimento
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-white tracking-tight">98%</span>
              <span className="text-xs text-zinc-400 font-medium block mt-1">Pontualidade exemplar</span>
            </div>
          </div>

          {/* Próximo Repasse */}
          <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Próximo Fechamento
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black text-white tracking-tight">Hoje, 23:59</span>
              <span className="text-xs text-[#00E676] font-medium block mt-1">Transferência PIX diária</span>
            </div>
          </div>
        </div>

        {/* Action Center & Preferences Menu */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-sm divide-y divide-white/5">
          <button
            type="button"
            onClick={handleOpenSettings}
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white block">Configurações de Trabalho</span>
                <span className="text-xs text-zinc-400">Defina suas profissões ativas e raio de distância</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                <History className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white block">Histórico de Repasses e Ganhos</span>
                <span className="text-xs text-zinc-400">Comprovantes e extrato detalhado de turnos realizados</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          </button>

          <button
            type="button"
            onClick={onHelpCenter}
            className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white block">Central de Ajuda & Suporte</span>
                <span className="text-xs text-zinc-400">Suporte 24 horas via WhatsApp e dúvidas frequentes</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-5 hover:bg-red-500/10 transition-colors cursor-pointer text-left group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-red-400 group-hover:text-red-300 block">Sair da Conta</span>
                <span className="text-xs text-red-400/70">Desconectar deste dispositivo com segurança</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400/50" />
          </button>
        </div>
      </div>
    </div>
  );
};
