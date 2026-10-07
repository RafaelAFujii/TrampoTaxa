import React, { useState } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Calendar, 
  ArrowUpRight, 
  Download, 
  Filter, 
  Award, 
  Clock, 
  CheckCircle2,
  DollarSign,
  ChevronRight
} from 'lucide-react';

type PeriodMode = 'diario' | 'semanal' | 'mensal';

interface EarningsScreenProps {
  onBackToMap?: () => void;
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({ onBackToMap }) => {
  const [period, setPeriod] = useState<PeriodMode>('semanal');

  // Dados para os 3 períodos
  const chartData = {
    diario: {
      total: 'R$ 370,00',
      periodLabel: 'Turnos de Hoje (Terça-feira)',
      change: '+R$ 150 vs ontem',
      shiftsCount: 2,
      averagePerShift: 'R$ 185,00',
      bars: [
        { label: '14h - 18h', value: 150, formatted: 'R$ 150', subtitle: 'Boteco São Jorge' },
        { label: '19h - 01h', value: 220, formatted: 'R$ 220', subtitle: 'Bistrô do Batel' },
      ],
      recentShifts: [
        { id: '1', venue: 'Bistrô do Batel', role: 'Bartender', time: '19:00 - 01:00', date: 'Hoje', amount: 'R$ 220,00', status: 'Processando PIX' },
        { id: '2', venue: 'Boteco São Jorge', role: 'Garçom', time: '14:00 - 18:00', date: 'Hoje', amount: 'R$ 150,00', status: 'Pago via PIX' },
      ]
    },
    semanal: {
      total: 'R$ 1.280,00',
      periodLabel: 'Semana Atual (23 Set - 29 Set)',
      change: '+18% vs semana passada',
      shiftsCount: 6,
      averagePerShift: 'R$ 213,33',
      bars: [
        { label: 'Seg', value: 180, formatted: 'R$ 180', subtitle: '1 turno' },
        { label: 'Ter', value: 220, formatted: 'R$ 220', subtitle: '1 turno' },
        { label: 'Qua', value: 190, formatted: 'R$ 190', subtitle: '1 turno' },
        { label: 'Qui', value: 0,   formatted: 'Folga',   subtitle: '0 turnos' },
        { label: 'Sex', value: 250, formatted: 'R$ 250', subtitle: '1 turno' },
        { label: 'Sáb', value: 290, formatted: 'R$ 290', subtitle: '2 turnos' },
        { label: 'Dom', value: 150, formatted: 'R$ 150', subtitle: '1 turno' },
      ],
      recentShifts: [
        { id: '1', venue: 'Lounge Bar & Drinks', role: 'Bartender', time: '20:00 - 03:00', date: 'Sábado', amount: 'R$ 250,00', status: 'Pago via PIX' },
        { id: '2', venue: 'Choperia Avenida', role: 'Garçom', time: '19:30 - 01:30', date: 'Sexta-feira', amount: 'R$ 190,00', status: 'Pago via PIX' },
        { id: '3', venue: 'Boteco São Jorge', role: 'Bartender', time: '19:00 - 01:00', date: 'Quarta-feira', amount: 'R$ 220,00', status: 'Pago via PIX' },
        { id: '4', venue: 'Bistrô do Batel', role: 'Garçom', time: '18:00 - 23:30', date: 'Terça-feira', amount: 'R$ 180,00', status: 'Pago via PIX' },
      ]
    },
    mensal: {
      total: 'R$ 4.960,00',
      periodLabel: 'Mês de Setembro',
      change: '+24% vs Agosto',
      shiftsCount: 23,
      averagePerShift: 'R$ 215,65',
      bars: [
        { label: 'Sem 1', value: 1150, formatted: 'R$ 1.150', subtitle: '5 turnos' },
        { label: 'Sem 2', value: 1210, formatted: 'R$ 1.210', subtitle: '6 turnos' },
        { label: 'Sem 3', value: 1320, formatted: 'R$ 1.320', subtitle: '6 turnos' },
        { label: 'Sem 4', value: 1280, formatted: 'R$ 1.280', subtitle: '6 turnos' },
      ],
      recentShifts: [
        { id: '1', venue: 'Lounge Bar & Drinks', role: 'Bartender', time: '20:00 - 03:00', date: '28 Set', amount: 'R$ 250,00', status: 'Pago via PIX' },
        { id: '2', venue: 'Boteco São Jorge', role: 'Bartender', time: '19:00 - 01:00', date: '25 Set', amount: 'R$ 220,00', status: 'Pago via PIX' },
        { id: '3', venue: 'Choperia Avenida', role: 'Garçom', time: '19:30 - 01:30', date: '21 Set', amount: 'R$ 190,00', status: 'Pago via PIX' },
        { id: '4', venue: 'Bistrô do Batel', role: 'Garçom', time: '18:00 - 23:30', date: '17 Set', amount: 'R$ 180,00', status: 'Pago via PIX' },
        { id: '5', venue: 'Taj Bar Curitiba', role: 'Bartender', time: '20:00 - 02:30', date: '12 Set', amount: 'R$ 240,00', status: 'Pago via PIX' },
      ]
    }
  };

  const current = chartData[period];
  const maxVal = Math.max(...current.bars.map(b => b.value), 1);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex justify-center pb-24 lg:pb-12 bg-[#0A0B0E]">
      <div className="w-full max-w-5xl space-y-6">
        {/* Top Header with Period Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
                <Wallet className="w-4 h-4" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Relatório de Ganhos
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Acompanhe sua receita bruta por turnos realizados em Curitiba
            </p>
          </div>

          {/* Period Toggle Controls */}
          <div className="flex items-center bg-[#14161C] p-1.5 rounded-2xl border border-white/10 self-start sm:self-auto shadow-inner">
            <button
              onClick={() => setPeriod('diario')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === 'diario'
                  ? 'bg-[#00E676] text-black shadow-[0_0_12px_rgba(0,230,118,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Diário
            </button>
            <button
              onClick={() => setPeriod('semanal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === 'semanal'
                  ? 'bg-[#00E676] text-black shadow-[0_0_12px_rgba(0,230,118,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setPeriod('mensal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                period === 'mensal'
                  ? 'bg-[#00E676] text-black shadow-[0_0_12px_rgba(0,230,118,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Mensal
            </button>
          </div>
        </div>

        {/* Hero Revenue Card */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                {current.periodLabel}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  {current.total}
                </span>
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#00E676] bg-[#00E676]/10 px-2.5 py-1 rounded-full border border-[#00E676]/30">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {current.change}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-2">
                Repasses transferidos automaticamente após a validação do turno.
              </p>
            </div>

            {/* Quick KPI stats */}
            <div className="flex items-center gap-4 sm:gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Turnos Concluídos
                </span>
                <span className="text-xl sm:text-2xl font-black text-white mt-0.5 block">
                  {current.shiftsCount}
                </span>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Média por Turno
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#00E676] mt-0.5 block">
                  {current.averagePerShift}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Distribuição de Faturamento</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/5 uppercase">
                  {period}
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Valores gerados por período selecionado
              </p>
            </div>

            <button
              onClick={() => alert('Extrato exportado em PDF com sucesso!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00E676]" />
              <span className="hidden sm:inline">Exportar Relatório</span>
            </button>
          </div>

          {/* Interactive Bar Chart */}
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-between gap-2 sm:gap-6 h-56 sm:h-64 px-2 border-b border-white/10">
              {current.bars.map((bar, idx) => {
                const heightPercent = bar.value > 0 ? Math.max((bar.value / maxVal) * 100, 8) : 4;
                const isMax = bar.value === maxVal && bar.value > 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip value */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2 text-center pointer-events-none">
                      <span className="text-[11px] font-black text-white bg-black/90 px-2 py-1 rounded-md border border-white/10 shadow-md">
                        {bar.formatted}
                      </span>
                    </div>

                    {/* Bar Pill */}
                    <div className="w-full max-w-[54px] flex flex-col items-center justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-2xl transition-all duration-500 relative flex items-center justify-center ${
                          bar.value === 0
                            ? 'bg-zinc-800/40 border border-dashed border-zinc-700/50'
                            : isMax
                            ? 'bg-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.5)] border border-[#00FF77]/40'
                            : 'bg-[#18231c] hover:bg-[#00E676]/30 border border-[#00E676]/30'
                        }`}
                      >
                        {isMax && (
                          <span className="absolute -top-6 text-[10px] font-extrabold text-[#00E676] hidden sm:block">
                            Top
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Label */}
                    <div className="text-center mt-3">
                      <span className={`text-xs font-bold block ${isMax ? 'text-[#00E676]' : 'text-zinc-300'}`}>
                        {bar.label}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-medium hidden sm:block">
                        {bar.subtitle}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown List */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-white">
                Histórico de Turnos e Repasses
              </h3>
              <p className="text-xs text-zinc-400">
                Registros auditados dos locais contratantes
              </p>
            </div>
            <span className="text-xs font-semibold text-[#00E676] bg-[#00E676]/10 px-2.5 py-1 rounded-full border border-[#00E676]/20">
              PIX Instantâneo
            </span>
          </div>

          <div className="divide-y divide-white/5">
            {current.recentShifts.map((shift) => (
              <div
                key={shift.id}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[#00E676]/10 border border-[#00E676]/20 flex items-center justify-center text-[#00E676] shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">
                      {shift.venue}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span className="text-[#00E676] font-semibold">{shift.role}</span>
                      <span>•</span>
                      <span>{shift.time}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="hidden sm:inline">{shift.date}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm sm:text-base font-black text-white block">
                    {shift.amount}
                  </span>
                  <span className="text-[10px] font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    {shift.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
