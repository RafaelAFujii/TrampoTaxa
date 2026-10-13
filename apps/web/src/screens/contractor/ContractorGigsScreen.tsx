import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  Calendar,
  DollarSign,
  MessageSquare,
  Star,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContractor } from '../../context/ContractorContext';
import { ContractorGig, FreelancerApplicant, ContractorGigStatus } from '@trampotaxa/shared';
import { FreelancerProfileModal } from './FreelancerProfileModal';
import { PerformanceReviewModal } from './PerformanceReviewModal';

const STATUS_FILTERS: { label: string; value: 'All' | ContractorGigStatus }[] = [
  { label: 'Todas', value: 'All' },
  { label: 'Abertas', value: 'Aberta' },
  { label: 'Aguardando', value: 'Aguardando Confirmação' },
  { label: 'Preenchidas', value: 'Preenchida' },
  { label: 'Finalizadas', value: 'Finalizada' },
];

export const ContractorGigsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { gigs, approveApplicant, rejectApplicant, toggleFavoriteFreelancer } = useContractor();

  const [statusFilter, setStatusFilter] = useState<'All' | ContractorGigStatus>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Vaga expandida para visualizar lista de candidatos inline ou em drawer
  const [expandedGigId, setExpandedGigId] = useState<string | null>('cgig-101');

  // Modal de perfil do candidato selecionado
  const [selectedApplicant, setSelectedApplicant] = useState<FreelancerApplicant | null>(null);
  const [applicantModalGig, setApplicantModalGig] = useState<ContractorGig | null>(null);
  const [isApplicantModalOpen, setIsApplicantModalOpen] = useState<boolean>(false);

  // Modal de Avaliação de Desempenho pós-evento
  const [reviewGig, setReviewGig] = useState<ContractorGig | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);

  // Filtragem das vagas
  const filteredGigs = gigs.filter((gig) => {
    const matchesStatus = statusFilter === 'All' || gig.status === statusFilter;
    const matchesSearch =
      gig.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gig.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOpenApplicantProfile = (gig: ContractorGig, applicant: FreelancerApplicant) => {
    setApplicantModalGig(gig);
    setSelectedApplicant(applicant);
    setIsApplicantModalOpen(true);
  };

  const handleOpenReview = (gig: ContractorGig) => {
    setReviewGig(gig);
    setIsReviewModalOpen(true);
  };

  const handleOpenChat = (gigId: string) => {
    navigate(`/contractor/chat?gigId=${gigId}`);
  };

  const getStatusBadge = (status: ContractorGigStatus) => {
    switch (status) {
      case 'Aberta':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
        };
      case 'Aguardando Confirmação':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
        };
      case 'Preenchida':
        return {
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-400',
        };
      case 'Finalizada':
        return {
          bg: 'bg-zinc-700/30 text-zinc-300 border-zinc-700',
          dot: 'bg-zinc-400',
        };
      case 'Cancelada':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-400',
        };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header com Boas-Vindas e Ação Rápida */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
              PAINEL DO CONTRATANTE
            </span>
            <span className="text-xs text-zinc-400">Bistrô do Batel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Gestão de Vagas & Candidatos
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Acompanhe vagas ativas, avalie candidaturas de freelancers e gerencie turnos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/contractor/create')}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#00E676] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,230,118,0.35)] hover:brightness-110 transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nova Vaga de Taxa</span>
        </button>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#121418] p-2 sm:p-2.5 rounded-2xl border border-white/5">
        {/* Segmented status buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setStatusFilter(f.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                statusFilter === f.value
                  ? 'bg-[#00E676] text-black shadow-sm font-bold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Input de Busca */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por cargo ou região..."
            className="w-full bg-[#181a20] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676]"
          />
        </div>
      </div>

      {/* Lista de Vagas Criadas */}
      {filteredGigs.length === 0 ? (
        <div className="p-12 text-center bg-[#121418] border border-white/5 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">Nenhuma vaga encontrada</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Não existem vagas com o filtro selecionado. Tente alterar o status ou criar uma nova
            taxa.
          </p>
          <button
            type="button"
            onClick={() => navigate('/contractor/create')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00E676] text-black text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Taxa Agora</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGigs.map((gig) => {
            const badge = getStatusBadge(gig.status);
            const isExpanded = expandedGigId === gig.id;
            const approvedApplicant = gig.applicants.find(
              (a) => a.id === gig.approvedFreelancerId || a.status === 'Aprovado'
            );

            return (
              <div
                key={gig.id}
                className="bg-[#121418] border border-white/10 rounded-3xl overflow-hidden transition-all shadow-lg hover:border-white/20"
              >
                {/* Header do Card da Vaga */}
                <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${badge.bg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{gig.status}</span>
                      </span>

                      <span className="text-xs text-zinc-400">·</span>
                      <span className="text-xs text-zinc-400">{gig.category}</span>
                      <span className="text-xs text-zinc-400">·</span>
                      <span className="text-xs text-zinc-400">{gig.neighborhood}</span>
                    </div>

                    <h3 className="text-lg font-extrabold text-white">{gig.title}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                        <span>{gig.dateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#00E676]" />
                        <span>
                          {gig.startTime} - {gig.endTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#00E676] font-bold">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span className="tabular-nums">{gig.rateFormatted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas no Card */}
                  <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
                    {/* Botão de Avaliar Pós-Evento */}
                    {gig.status === 'Finalizada' && (
                      <button
                        type="button"
                        onClick={() => handleOpenReview(gig)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          gig.evaluation
                            ? 'bg-[#181a20] border-amber-400/30 text-amber-400'
                            : 'bg-amber-400/15 border-amber-400/40 text-amber-300 hover:bg-amber-400/25'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{gig.evaluation ? 'Ver Avaliação (5★)' : 'Avaliar Desempenho'}</span>
                      </button>
                    )}

                    {/* Botão de Chat Direto se Preenchida */}
                    {(gig.status === 'Preenchida' || gig.status === 'Finalizada') &&
                      approvedApplicant && (
                        <button
                          type="button"
                          onClick={() => handleOpenChat(gig.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#181a20] hover:bg-[#20232c] border border-white/10 text-xs font-bold text-zinc-200 transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-[#00E676]" />
                          <span>Chat com {approvedApplicant.name.split(' ')[0]}</span>
                        </button>
                      )}

                    {/* Botão de alternar lista de candidatos */}
                    <button
                      type="button"
                      onClick={() => setExpandedGigId(isExpanded ? null : gig.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        isExpanded
                          ? 'bg-white/10 text-white border-white/20'
                          : 'bg-[#181a20] text-zinc-300 border-white/10 hover:text-white'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-[#00E676]" />
                      <span>Candidatos ({gig.applicants.length})</span>
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                  </div>
                </div>

                {/* Área Expandida: Lista de Candidatos & Speckit Rules */}
                {isExpanded && (
                  <div className="border-t border-white/5 bg-[#0f1013] p-5 sm:p-6 space-y-5">
                    {/* Speckit Microtraining Resumo */}
                    <div className="p-4 bg-[#14161c] rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                          Dress Code Definido:
                        </span>
                        <p className="text-zinc-300 leading-relaxed">{gig.dressCode}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                          Regras & Observações da Casa:
                        </span>
                        <p className="text-zinc-300 leading-relaxed">{gig.rulesAndNotes}</p>
                      </div>
                    </div>

                    {/* Seção de Candidatos */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#00E676]" />
                          <span>
                            Profissionais que Solicitaram a Taxa ({gig.applicants.length})
                          </span>
                        </h4>
                        <span className="text-[11px] text-zinc-400">
                          Clique no candidato para ver o perfil completo
                        </span>
                      </div>

                      {gig.applicants.length === 0 ? (
                        <div className="p-6 text-center bg-[#14161c] rounded-2xl border border-white/5">
                          <p className="text-xs text-zinc-400">
                            Ainda não há candidatos para esta taxa. Vagas abertas costumam receber
                            inscrições em até 20 minutos no radar.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {gig.applicants.map((applicant) => {
                            const isApproved = applicant.status === 'Aprovado';
                            const isRejected = applicant.status === 'Recusado';

                            return (
                              <div
                                key={applicant.id}
                                onClick={() => handleOpenApplicantProfile(gig, applicant)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                                  isApproved
                                    ? 'bg-[#13231a] border-[#00E676]/40 shadow-[0_0_15px_rgba(0,230,118,0.1)]'
                                    : isRejected
                                      ? 'bg-[#181a20]/60 border-white/5 opacity-60'
                                      : 'bg-[#16181f] border-white/10 hover:border-[#00E676]/50 hover:bg-[#1a1d26]'
                                }`}
                              >
                                <div>
                                  <div className="flex items-start gap-3 mb-2.5">
                                    <img
                                      src={applicant.avatarUrl}
                                      alt={applicant.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-[#00E676]/40"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <h5 className="text-xs font-bold text-white truncate">
                                          {applicant.name}
                                        </h5>
                                        {applicant.isFavorite && (
                                          <span className="text-amber-400 text-xs shrink-0">★</span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-[#00E676] font-medium truncate">
                                        {applicant.profession}
                                      </p>
                                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                                        <div className="flex items-center text-amber-400 font-bold">
                                          <Star className="w-3 h-3 fill-current mr-0.5" />
                                          <span>{applicant.rating.toFixed(1)}</span>
                                        </div>
                                        <span>·</span>
                                        <span>{applicant.totalGigsCompleted} taxas</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Tags de especialidade */}
                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {applicant.specialties.slice(0, 2).map((s) => (
                                      <span
                                        key={s}
                                        className="text-[10px] bg-black/40 text-zinc-300 px-2 py-0.5 rounded-md border border-white/5"
                                      >
                                        {s}
                                      </span>
                                    ))}
                                    {applicant.specialties.length > 2 && (
                                      <span className="text-[10px] text-zinc-400 self-center">
                                        +{applicant.specialties.length - 2}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Status e Botão de Ação */}
                                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                  <span
                                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                      isApproved
                                        ? 'bg-[#00E676]/20 text-[#00E676]'
                                        : isRejected
                                          ? 'bg-rose-500/20 text-rose-400'
                                          : 'bg-amber-500/15 text-amber-300'
                                    }`}
                                  >
                                    {applicant.status}
                                  </span>

                                  <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-[#00E676] inline-flex items-center gap-0.5 transition-colors">
                                    <span>Ver Perfil</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal do Perfil do Freelancer */}
      <FreelancerProfileModal
        applicant={selectedApplicant}
        gigTitle={applicantModalGig?.title}
        isOpen={isApplicantModalOpen}
        onClose={() => setIsApplicantModalOpen(false)}
        onApprove={(appId) => {
          if (applicantModalGig) {
            approveApplicant(applicantModalGig.id, appId);
          }
        }}
        onReject={(appId) => {
          if (applicantModalGig) {
            rejectApplicant(applicantModalGig.id, appId);
          }
        }}
        onOpenChat={(_appId) => {
          if (applicantModalGig) {
            navigate(`/contractor/chat?gigId=${applicantModalGig.id}`);
          }
        }}
        onToggleFavorite={(appId) => toggleFavoriteFreelancer(appId)}
      />

      {/* Modal de Avaliação de Desempenho Pós-Evento */}
      <PerformanceReviewModal
        gig={reviewGig}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </div>
  );
};
