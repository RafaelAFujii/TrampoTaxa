import React, { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  Users,
  CheckCircle2,
  FileText,
  DollarSign,
  ShieldCheck,
  X,
  Printer,
} from 'lucide-react';
import { useContractor } from '../../context/ContractorContext';
import { ContractorGig } from '@trampotaxa/shared';

type PeriodFilter = '7dias' | 'esteMes' | '3meses' | 'todos';
type StatusReportFilter = 'All' | 'Finalizada' | 'Cancelada' | 'Preenchida';

export const ContractorReportsScreen: React.FC = () => {
  const { gigs, kpis } = useContractor();

  const [period, setPeriod] = useState<PeriodFilter>('esteMes');
  const [statusFilter, setStatusFilter] = useState<StatusReportFilter>('All');
  const [selectedReceiptGig, setSelectedReceiptGig] = useState<ContractorGig | null>(null);

  // Filtragem da tabela de histórico
  const filteredHistory = gigs.filter((gig) => {
    if (statusFilter !== 'All' && gig.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
              MÉTRICAS & GESTÃO
            </span>
            <span className="text-xs text-zinc-400">Contabilidade de Turnos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Relatório Financeiro & Operacional
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Acompanhe o volume de taxas pagas, horas de freelancers contratados e recibos
            operacionais.
          </p>
        </div>

        {/* Seletor de período */}
        <div className="flex items-center gap-1 bg-[#121418] p-1.5 rounded-2xl border border-white/5 self-start sm:self-auto">
          {[
            { id: '7dias' as PeriodFilter, label: '7 Dias' },
            { id: 'esteMes' as PeriodFilter, label: 'Este Mês' },
            { id: '3meses' as PeriodFilter, label: '3 Meses' },
            { id: 'todos' as PeriodFilter, label: 'Todo Histórico' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                period === item.id
                  ? 'bg-[#00E676] text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Cards de KPIs Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Investido em Taxas */}
        <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total em Taxas</span>
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 text-[#00E676] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {kpis.totalInvestedFormatted}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#00E676]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Repasses 100% via PIX autenticado</span>
          </div>
        </div>

        {/* KPI 2: Taxas Concluídas */}
        <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Taxas Concluídas</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {kpis.completedGigsCount} turnos
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span>Pontualidade global de</span>
            <span className="text-white font-bold">{kpis.punctualityScore}</span>
          </div>
        </div>

        {/* KPI 3: Freelancers Contratados */}
        <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Freelancers Ativos</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {kpis.hiredFreelancersCount} profissionais
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span>Equipe qualificada e verificada</span>
          </div>
        </div>

        {/* KPI 4: Média por Turno */}
        <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-2 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Média por Turno</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white tabular-nums tracking-tight">
            {kpis.averageRateFormatted}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <span>Média de 6.2 horas de trabalho</span>
          </div>
        </div>
      </div>

      {/* Gráfico de Investimento Semanal / Mensal */}
      <div className="p-6 bg-[#121418] border border-white/10 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white">
              Investimento em Turnos por Período
            </h3>
            <p className="text-xs text-zinc-400">Comparativo de despesas com escalas temporárias</p>
          </div>
          <span className="text-xs text-[#00E676] font-bold">
            Total: {kpis.totalInvestedFormatted}
          </span>
        </div>

        {/* Barras visuais */}
        <div className="grid grid-cols-6 gap-3 items-end pt-4 pb-2">
          {[
            { label: 'Sem 1', value: 480, height: '40%', amount: 'R$ 480' },
            { label: 'Sem 2', value: 720, height: '60%', amount: 'R$ 720' },
            { label: 'Sem 3', value: 960, height: '80%', amount: 'R$ 960' },
            { label: 'Sem 4', value: 1250, height: '100%', amount: 'R$ 1.250' },
            { label: 'Sem 5', value: 540, height: '45%', amount: 'R$ 540' },
            { label: 'Sem 6', value: 870, height: '70%', amount: 'R$ 870' },
          ].map((bar) => (
            <div key={bar.label} className="flex flex-col items-center gap-2 group">
              <span className="text-[10px] text-zinc-400 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity">
                {bar.amount}
              </span>
              <div className="w-full bg-[#181a20] rounded-xl h-32 flex items-end p-1 overflow-hidden border border-white/5">
                <div
                  style={{ height: bar.height }}
                  className="w-full bg-gradient-to-t from-[#00E676]/40 to-[#00E676] rounded-lg transition-all group-hover:brightness-110"
                />
              </div>
              <span className="text-xs font-semibold text-zinc-400">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico Detalhado de Taxas */}
      <div className="p-6 bg-[#121418] border border-white/10 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-extrabold text-white">Histórico de Taxas & Recibos</h3>
            <p className="text-xs text-zinc-400">
              Detalhamento de todos os turnos passados com recibos e comprovantes operacionais.
            </p>
          </div>

          {/* Filtro de Status na Tabela */}
          <div className="flex items-center gap-1 bg-[#181a20] p-1 rounded-xl border border-white/5">
            {[
              { id: 'All' as StatusReportFilter, label: 'Todas' },
              { id: 'Finalizada' as StatusReportFilter, label: 'Concluídas' },
              { id: 'Preenchida' as StatusReportFilter, label: 'Em Andamento' },
              { id: 'Cancelada' as StatusReportFilter, label: 'Canceladas' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-white/10 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela de Histórico */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-zinc-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-3">Taxa / Função</th>
                <th className="py-3 px-3">Data & Horário</th>
                <th className="py-3 px-3">Freelancer Contratado</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Valor Pago</th>
                <th className="py-3 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredHistory.map((gig) => {
                const approvedApplicant = gig.applicants.find(
                  (a) => a.id === gig.approvedFreelancerId || a.status === 'Aprovado'
                );

                return (
                  <tr key={gig.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white">{gig.title}</div>
                      <div className="text-[11px] text-zinc-400">{gig.category}</div>
                    </td>

                    <td className="py-3.5 px-3 text-zinc-300">
                      <div>{gig.dateFormatted}</div>
                      <div className="text-[11px] text-zinc-400">
                        {gig.startTime} - {gig.endTime}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      {approvedApplicant ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={approvedApplicant.avatarUrl}
                            alt={approvedApplicant.name}
                            className="w-6 h-6 rounded-full object-cover border border-[#00E676]/40"
                          />
                          <div>
                            <span className="font-semibold text-white">
                              {approvedApplicant.name}
                            </span>
                            <span className="block text-[10px] text-zinc-400">
                              {approvedApplicant.profession}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic">Nenhum aprovado</span>
                      )}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          gig.status === 'Finalizada'
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            : gig.status === 'Preenchida'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : gig.status === 'Aberta'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {gig.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-right font-black text-[#00E676] tabular-nums">
                      {gig.rateFormatted}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedReceiptGig(gig)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181a20] hover:bg-[#20232c] border border-white/10 text-[11px] font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      >
                        <FileText className="w-3 h-3 text-[#00E676]" />
                        <span>Recibo</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Comprovante de Pagamento / Recibo de Taxa */}
      {selectedReceiptGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 bg-gradient-to-br from-[#181a20] to-[#121418] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#00E676] text-black font-black flex items-center justify-center text-xs">
                  T
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Comprovante de Taxa</h4>
                  <p className="text-[10px] text-zinc-400">Autenticação PIX TrampoTaxa CWB</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReceiptGig(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center py-2 border-b border-white/5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-zinc-400">
                  Valor Total Liquidado
                </span>
                <p className="text-3xl font-black text-[#00E676] tabular-nums">
                  {selectedReceiptGig.rateFormatted}
                </p>
                <span className="inline-block text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
                  ✓ Transferência Instantânea Concluída
                </span>
              </div>

              <div className="space-y-2 text-zinc-300">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Vaga / Função:</span>
                  <span className="font-semibold text-white">{selectedReceiptGig.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Data do Turno:</span>
                  <span className="font-semibold text-white">
                    {selectedReceiptGig.dateFormatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Horário:</span>
                  <span>
                    {selectedReceiptGig.startTime} às {selectedReceiptGig.endTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Estabelecimento Contratante:</span>
                  <span>Bistrô do Batel Gastronomia LTDA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">CNPJ:</span>
                  <span className="font-mono">12.345.678/0001-90</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">ID da Transação:</span>
                  <span className="font-mono text-[11px] text-zinc-400">
                    PIX-{selectedReceiptGig.id}-CWB
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                <span>Documento com validade operacional e tributária em conformidade.</span>
              </div>
            </div>

            <div className="p-4 bg-[#16181f] border-t border-white/5 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedReceiptGig(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00E676] text-black text-xs font-bold transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Recibo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
