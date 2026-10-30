import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  PlusCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Building2,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import { useContractor } from '../../context/ContractorContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '@trampotaxa/shared';

export const ContractorDashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { gigs, messages, kpis } = useContractor();

  // 1. Cálculos de Vagas e Status
  const openGigs = gigs.filter((g) => g.status === 'Aberta');
  const completedGigs = gigs.filter((g) => g.status === 'Finalizada');

  // Total de vagas abertas somando vagas numéricas de cada card
  const totalOpenVacancies = openGigs.reduce((acc, curr) => acc + (curr.vacancies || 1), 0);

  // Candidatos pendentes de avaliação em todas as vagas
  const allPendingApplicants = gigs.flatMap((gig) =>
    gig.applicants
      .filter((a) => a.status === 'Pendente')
      .map((applicant) => ({ ...applicant, gigId: gig.id, gigTitle: gig.title, gigRole: gig.role }))
  );

  // Turnos de hoje
  const todayGigs = gigs.filter(
    (g) =>
      g.date.toLowerCase().includes('hoje') ||
      g.dateFormatted.toLowerCase().includes('hoje') ||
      g.status === 'Aberta' ||
      g.status === 'Preenchida'
  );

  // Mensagens pendentes/recentes enviadas por freelancers
  const freelancerMessages = messages.filter((m) => m.senderRole === 'Freelancer');
  const recentMessages = messages.slice(-4).reverse();

  // Métricas da Semana simuladas / calculadas
  const weeklyTotal = kpis.totalInvested > 0 ? kpis.totalInvested : 1290;
  const weeklyHours = completedGigs.length * 6 || 36;
  const weeklyTurnosCount = completedGigs.length || 5;

  // Gráfico simplificado dos últimos 7 dias (Segunda a Domingo)
  const weekDaysData = [
    { day: 'Seg', amount: 180, count: 1, active: false },
    { day: 'Ter', amount: 220, count: 1, active: false },
    { day: 'Qua', amount: 200, count: 1, active: false },
    { day: 'Qui', amount: 240, count: 1, active: false },
    { day: 'Sex', amount: 480, count: 2, active: true, peak: true },
    { day: 'Sáb', amount: 520, count: 2, active: true, peak: true },
    { day: 'Dom', amount: 210, count: 1, active: false },
  ];

  const maxDayAmount = Math.max(...weekDaysData.map((d) => d.amount));

  // Vaga em risco: Aberta e com data de hoje ou com candidatos pendentes aguardando
  const urgentGig = openGigs.find((g) => g.applicants.length > 0) || openGigs[0];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 pb-24 lg:pb-12 animate-fadeIn">
      {/* ======================================================== */}
      {/* 1. HEADER DE BOAS-VINDAS & AÇÕES RÁPIDAS                 */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E676]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/15 px-2.5 py-0.5 rounded-full border border-[#00E676]/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
              Painel de Controle B2B
            </span>
            <span className="text-xs text-zinc-400">Curitiba & Região</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Olá, {user?.name || 'Gerente do Estabelecimento'}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Resumo consolidado da sua operação gastronômica. Acompanhe a cobertura de salão,
            taxas ativas, candidatos e métricas financeiras da semana.
          </p>
        </div>

        {/* Botão de Criação de Taxa em Destaque */}
        <div className="relative z-10 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/contractor/create')}
            className="flex items-center justify-center gap-2 bg-[#00E676] text-black font-extrabold text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-[0_0_20px_rgba(0,230,118,0.35)] hover:shadow-[0_0_25px_rgba(0,230,118,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer w-full sm:w-auto"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Publicar Nova Taxa</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. ALERTA OPERACIONAL DE ATENÇÃO (SE HOUVER VAGA URGENTE) */}
      {/* ======================================================== */}
      {urgentGig && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Triagem Pendente: {urgentGig.title}</h4>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300">
                  Urgente
                </span>
              </div>
              <p className="text-xs text-zinc-300">
                Você tem{' '}
                <strong className="text-amber-400">
                  {urgentGig.applicants.length} candidato(s)
                </strong>{' '}
                aguardando aprovação para o turno de {urgentGig.role} ({urgentGig.startTime} -{' '}
                {urgentGig.endTime}).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/contractor/gigs')}
            className="flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-500 text-black px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-sm"
          >
            <span>Avaliar Candidatos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. CARDS DE KPIS EXECUTIVOS                              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Taxas Abertas */}
        <div
          onClick={() => navigate('/contractor/gigs')}
          className="bg-[#12141A] border border-white/10 hover:border-[#00E676]/40 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Taxas Abertas</span>
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {openGigs.length}
              </span>
              <span className="text-[11px] text-zinc-400">
                ({totalOpenVacancies} {totalOpenVacancies === 1 ? 'vaga' : 'vagas'})
              </span>
            </div>
            <span className="text-[11px] text-[#00E676] flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E676]" />
              Recebendo candidaturas
            </span>
          </div>
        </div>

        {/* KPI 2: Candidaturas Pendentes */}
        <div
          onClick={() => navigate('/contractor/gigs')}
          className="bg-[#12141A] border border-white/10 hover:border-amber-500/40 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Candidaturas</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {allPendingApplicants.length}
              </span>
              <span className="text-[11px] text-zinc-400">na fila</span>
            </div>
            <span
              className={`text-[11px] font-semibold ${
                allPendingApplicants.length > 0 ? 'text-amber-400' : 'text-zinc-500'
              }`}
            >
              {allPendingApplicants.length > 0
                ? 'Requer sua resposta'
                : 'Todas triadas'}
            </span>
          </div>
        </div>

        {/* KPI 3: Mensagens do Chat */}
        <div
          onClick={() => navigate('/contractor/chat')}
          className="bg-[#12141A] border border-white/10 hover:border-blue-500/40 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Mensagens</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {freelancerMessages.length}
              </span>
              <span className="text-[11px] text-zinc-400">recebidas</span>
            </div>
            <span className="text-[11px] text-blue-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              Canal de gerência ativo
            </span>
          </div>
        </div>

        {/* KPI 4: Investimento da Semana */}
        <div
          onClick={() => navigate('/contractor/reports')}
          className="bg-[#12141A] border border-white/10 hover:border-[#00E676]/40 p-4 sm:p-5 rounded-2xl transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-zinc-400 font-medium">Gasto Semanal</span>
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#00E676]">
                {formatCurrency(weeklyTotal)}
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-semibold">
              {weeklyTurnosCount} turnos realizados
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. SEÇÃO PRINCIPAL: RELATÓRIO DA SEMANA & PRÓXIMOS TURNOS*/}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Relatório da Semana com Gráfico Diário */}
        <div className="lg:col-span-2 bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
                  RELATÓRIO DA SEMANA
                </span>
                <span className="text-xs text-zinc-400">Últimos 7 dias</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Consumo Financeiro & Cobertura de Salão
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/contractor/reports')}
              className="text-xs font-semibold text-[#00E676] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Métricas Centrais da Semana */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[#0A0C11] rounded-2xl border border-white/5">
            <div>
              <span className="text-[11px] text-zinc-400 block mb-0.5">Total Investido</span>
              <span className="text-base sm:text-lg font-black text-white">
                {formatCurrency(weeklyTotal)}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block mb-0.5">Horas Cobertas</span>
              <span className="text-base sm:text-lg font-black text-[#00E676]">
                {weeklyHours}h
              </span>
            </div>

            <div>
              <span className="text-[11px] text-zinc-400 block mb-0.5">Pontualidade</span>
              <span className="text-base sm:text-lg font-black text-blue-400">
                {kpis.punctualityScore}
              </span>
            </div>
          </div>

          {/* Gráfico Diário em Barras */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
              <span>Distribuição de Taxas por Dia (Seg - Dom)</span>
              <span className="text-[11px] text-zinc-500">Pico: Sex e Sáb</span>
            </div>

            <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2 bg-[#0A0C11] rounded-2xl border border-white/5">
              {weekDaysData.map((d, index) => {
                const heightPercentage = Math.round((d.amount / maxDayAmount) * 100);

                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      R${d.amount}
                    </div>

                    <div className="w-full max-w-[36px] bg-zinc-800 rounded-t-lg overflow-hidden flex flex-col justify-end relative h-24">
                      <div
                        style={{ height: `${heightPercentage}%` }}
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          d.peak
                            ? 'bg-gradient-to-t from-[#00E676]/60 to-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.3)]'
                            : 'bg-zinc-600 group-hover:bg-[#00E676]/50'
                        }`}
                      />
                    </div>

                    <span
                      className={`text-[11px] font-bold ${
                        d.peak ? 'text-[#00E676]' : 'text-zinc-400'
                      }`}
                    >
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rodapé de Dica Operacional */}
          <div className="flex items-center justify-between text-xs text-zinc-400 bg-white/[0.02] p-3 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00E676]" />
              <span>Sexta e Sábado demandam 65% do seu orçamento operacional de taxas.</span>
            </div>
            <span className="text-[11px] text-[#00E676] font-bold hidden sm:inline">
              Previsão Saudável
            </span>
          </div>
        </div>

        {/* Coluna Direita: Próximos Turnos & Vagas Ativas */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 block mb-1">
                AGENDA DE SALÃO
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Próximos Turnos
              </h2>
            </div>

            <button
              type="button"
              onClick={() => navigate('/contractor/gigs')}
              className="text-xs font-semibold text-[#00E676] hover:underline cursor-pointer"
            >
              Ver Todas
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
            {todayGigs.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                Nenhum turno agendado para hoje.
              </div>
            ) : (
              todayGigs.slice(0, 3).map((gig) => {
                const approvedApplicant = gig.applicants.find((a) => a.id === gig.approvedFreelancerId) || gig.applicants[0];
                const isFilled = gig.status === 'Preenchida';

                return (
                  <div
                    key={gig.id}
                    className="p-3.5 bg-[#0A0C11] border border-white/5 hover:border-white/15 rounded-2xl transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-white">
                          {gig.role}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded border ${
                            isFilled
                              ? 'bg-[#00E676]/15 text-[#00E676] border-[#00E676]/30'
                              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {gig.status}
                        </span>
                      </div>

                      <span className="text-xs font-black text-[#00E676]">
                        {gig.rateFormatted}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{gig.startTime} - {gig.endTime}</span>
                      </div>
                      <span>{gig.dateFormatted || gig.date}</span>
                    </div>

                    {/* Freelancer Alocado ou Alerta de Vaga Vazia */}
                    {isFilled && approvedApplicant ? (
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <img
                            src={approvedApplicant.avatarUrl}
                            alt={approvedApplicant.name}
                            className="w-6 h-6 rounded-full object-cover border border-[#00E676]/40"
                          />
                          <span className="text-xs font-semibold text-zinc-200 truncate max-w-[120px]">
                            {approvedApplicant.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => navigate('/contractor/chat')}
                            className="text-[10px] font-bold text-[#00E676] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[11px]">
                        <span className="text-amber-400">
                          {gig.applicants.length > 0
                            ? `${gig.applicants.length} candidato(s) aguardando`
                            : 'Buscando freelancers no radar'}
                        </span>

                        <button
                          type="button"
                          onClick={() => navigate('/contractor/gigs')}
                          className="text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Triar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate('/contractor/create')}
            className="w-full py-2.5 px-3 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Adicionar Novo Turno de Taxa</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. SEÇÃO DE MENSAGENS PENDENTES & AÇÕES RÁPIDAS          */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mensagens Recentes do Chat */}
        <div className="lg:col-span-2 bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Mensagens Recentes com Freelancers
                </h3>
                <p className="text-xs text-zinc-400">
                  Dúvidas de vestimenta, confirmações de chegada e orientações de entrada.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate('/contractor/chat')}
              className="text-xs font-semibold text-[#00E676] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-xs bg-[#0A0C11] rounded-2xl border border-white/5">
              Nenhuma mensagem recente registrada.
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentMessages.map((msg) => {
                const isFreelancer = msg.senderRole === 'Freelancer';

                return (
                  <div
                    key={msg.id}
                    onClick={() => navigate('/contractor/chat')}
                    className="p-3 bg-[#0A0C11] border border-white/5 hover:border-[#00E676]/30 rounded-2xl flex items-center justify-between gap-4 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isFreelancer
                            ? 'bg-[#00E676]/20 text-[#00E676] border border-[#00E676]/30'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {msg.senderName.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-[#00E676] transition-colors truncate">
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            ({msg.senderRole})
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 truncate max-w-[280px] sm:max-w-md">
                          {msg.text}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-zinc-500">{msg.timestamp}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#00E676] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Card de Atalhos Rápidos da Gestão */}
        <div className="bg-[#12141A] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20 block mb-1">
              ATALHOS DA GERÊNCIA
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Ações Operacionais
            </h3>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => navigate('/contractor/create')}
              className="w-full p-3 rounded-2xl bg-[#0A0C11] border border-white/5 hover:border-[#00E676]/40 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-[#00E676] transition-colors block">
                    Criar Vaga de Taxa
                  </span>
                  <span className="text-[10px] text-zinc-500">Publicação imediata no radar CWB</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#00E676] transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/contractor/gigs')}
              className="w-full p-3 rounded-2xl bg-[#0A0C11] border border-white/5 hover:border-[#00E676]/40 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-[#00E676] transition-colors block">
                    Triagem & Minhas Vagas
                  </span>
                  <span className="text-[10px] text-zinc-500">Aprovar ou recusar candidatos</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#00E676] transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/contractor/reports')}
              className="w-full p-3 rounded-2xl bg-[#0A0C11] border border-white/5 hover:border-[#00E676]/40 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-[#00E676] transition-colors block">
                    Relatório Financeiro & Recibos
                  </span>
                  <span className="text-[10px] text-zinc-500">Histórico de custos e recibos</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#00E676] transition-colors" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full p-3 rounded-2xl bg-[#0A0C11] border border-white/5 hover:border-[#00E676]/40 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white group-hover:text-[#00E676] transition-colors block">
                    Dados do Estabelecimento
                  </span>
                  <span className="text-[10px] text-zinc-500">CNPJ, endereço e regras de salão</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#00E676] transition-colors" />
            </button>
          </div>

          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Suporte TrampoTaxa B2B</span>
            <span className="text-[#00E676] font-bold">24h Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
