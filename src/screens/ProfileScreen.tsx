import React, { useState } from 'react';
import {
  Star,
  Settings,
  History,
  LogOut,
  ChevronRight,
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Edit3,
  Phone,
  Mail,
  Briefcase,
  BarChart3,
  MessageSquare,
  X as CloseIcon,
  Check as SaveIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useContractor } from '../context/ContractorContext';

export interface UserProfileData {
  name: string;
  avatarUrl: string;
  roleDescription: string;
  phone: string;
  email: string;
  city: string;
  cnpj?: string;
  businessSegment?: string;
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
  onViewHistory: _onViewHistory,
  onHelpCenter: _onHelpCenter,
}) => {
  const navigate = useNavigate();
  const { user, logout, switchRole } = useAuth();
  const { kpis, gigs } = useContractor();

  const isContractor = user?.role === 'Contratante';

  const userProfile = propProfile || {
    name: user?.name || (isContractor ? 'Bistrô do Batel' : 'Gabriel Silva'),
    avatarUrl:
      user?.avatarUrl ||
      (isContractor
        ? 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=240&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'),
    roleDescription: isContractor ? 'Restaurante & Casa Noturna' : 'Bartender & Garçom Pro',
    phone: user?.phone || '(41) 99887-1234',
    email:
      user?.email || (isContractor ? 'contato@bistrodobatel.com.br' : 'freelancer@curitiba.com'),
    city: 'Curitiba, PR',
    cnpj: user?.cnpj || '12.345.678/0001-90',
    businessSegment: user?.businessSegment || 'Restaurante',
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfileData = {
      name,
      avatarUrl,
      roleDescription,
      phone,
      email,
      city,
      cnpj: userProfile.cnpj,
      businessSegment: userProfile.businessSegment,
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
            {/* Avatar */}
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.3)] transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="absolute -bottom-2 -right-2 p-2 bg-[#1B1E26] border border-white/20 text-[#00E676] rounded-xl hover:bg-[#00E676] hover:text-black transition-colors cursor-pointer shadow-lg"
                title="Editar Perfil"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>

            {/* User Meta */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{name}</h2>
                <div className="inline-flex items-center gap-1 bg-[#00E676]/15 border border-[#00E676]/30 px-2 py-0.5 rounded-full text-[10px] font-black uppercase text-[#00E676]">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{isContractor ? 'Estabelecimento Verificado' : 'Verificado CWB'}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-medium">
                {roleDescription} • {city}
              </p>

              {isContractor && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-zinc-300 font-mono">
                  <span>CNPJ: {userProfile.cnpj}</span>
                  <span>·</span>
                  <span>Ramo: {userProfile.businessSegment}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-zinc-400">
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Mail className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>{email}</span>
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg">
                  <Phone className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>{phone}</span>
                </span>
              </div>
            </div>

            {/* Alternador de papel */}
            <div className="self-center sm:self-start">
              <button
                type="button"
                onClick={() => {
                  switchRole(isContractor ? 'Freelancer' : 'Contratante');
                  navigate(isContractor ? '/map' : '/contractor/gigs');
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1B1E26] hover:bg-[#252934] border border-white/10 text-[#00E676] transition-colors cursor-pointer"
              >
                Alternar para {isContractor ? 'Freelancer' : 'Contratante'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isContractor ? (
            <>
              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Vagas Publicadas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-white tracking-tight tabular-nums">
                    {gigs.length}
                  </span>
                  <span className="text-xs text-[#00E676] font-semibold block mt-1">
                    {gigs.filter((g) => g.status === 'Aberta').length} abertas no radar
                  </span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Total em Taxas
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-[#00E676] tracking-tight tabular-nums">
                    {kpis.totalInvestedFormatted}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium block mt-1">Repasses PIX</span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Taxistas Contratados
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-white tracking-tight tabular-nums">
                    {kpis.hiredFreelancersCount}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium block mt-1">
                    Profissionais
                  </span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Avaliação do Local
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-amber-400 tracking-tight tabular-nums">
                    4.9 ★
                  </span>
                  <span className="text-xs text-[#00E676] font-medium block mt-1">
                    Excelente pagador
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
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
                  <span className="text-xs text-[#00E676] font-semibold block mt-1">
                    +6 nesta semana
                  </span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Ganhos da Semana
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 flex items-center justify-center text-[#00E676]">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-[#00E676] tracking-tight">
                    R$ 1.280
                  </span>
                  <span className="text-xs text-zinc-400 font-medium block mt-1">
                    Meta: R$ 1.500
                  </span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Comparecimento
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-black text-white tracking-tight">98%</span>
                  <span className="text-xs text-zinc-400 font-medium block mt-1">
                    Pontualidade exemplar
                  </span>
                </div>
              </div>

              <div className="bg-[#121418] border border-white/10 rounded-2xl p-5 flex flex-col justify-between">
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
                  <span className="text-xs text-[#00E676] font-medium block mt-1">
                    Transferência PIX
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Action Center & Navigation Options */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-sm divide-y divide-white/5">
          {isContractor ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/contractor/gigs')}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">
                      Painel de Vagas & Candidatos
                    </span>
                    <span className="text-xs text-zinc-400">
                      Acompanhe inscrições, aprove e recuse freelancers
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/contractor/reports')}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">
                      Relatório Financeiro & Operacional
                    </span>
                    <span className="text-xs text-zinc-400">
                      Recibos de PIX, histórico de turnos e custos
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/contractor/chat')}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">
                      Mensagens com Freelancers
                    </span>
                    <span className="text-xs text-zinc-400">
                      Chat direto para alinhamento de entrada e regras
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              </button>
            </>
          ) : (
            <>
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
                    <span className="text-base font-bold text-white block">
                      Configurações de Trabalho
                    </span>
                    <span className="text-xs text-zinc-400">
                      Defina suas profissões ativas e raio de distância
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/earnings')}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors cursor-pointer text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-300 group-hover:text-[#00E676] group-hover:bg-[#00E676]/10 transition-colors">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-base font-bold text-white block">
                      Histórico de Repasses e Ganhos
                    </span>
                    <span className="text-xs text-zinc-400">
                      Comprovantes e extrato detalhado de turnos
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
              </button>
            </>
          )}

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
                <span className="text-base font-bold text-red-400 group-hover:text-red-300 block">
                  Sair da Conta
                </span>
                <span className="text-xs text-red-400/70">
                  Desconectar deste dispositivo com segurança
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400/50" />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121418] border border-white/10 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-lg font-bold text-white">Editar Perfil</h3>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E676]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  Profissão / Ocupação
                </label>
                <input
                  type="text"
                  value={roleDescription}
                  onChange={(e) => setRoleDescription(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E676]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                  URL da Foto de Perfil
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#00E676] text-black hover:bg-[#00c853] transition-colors"
                >
                  <SaveIcon className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
