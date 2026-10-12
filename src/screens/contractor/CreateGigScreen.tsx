import React, { useState } from 'react';
import { 
  PlusCircle, 
  Sparkles, 
  Clock, 
  DollarSign, 
  Shirt, 
  FileText, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContractor } from '../../context/ContractorContext';
import { ContractorGigCategory } from '../../types/contractor';
import { formatCurrencyInput, formatCurrency } from '../../utils/formatters';

const DEFAULT_ROLES = [
  'Bartender',
  'Garçom',
  'Recepcionista',
  'Hostess',
  'Copeiro',
] as const;

const CATEGORIES: ContractorGigCategory[] = [
  'Turno Normal',
  'Cobertura de Emergência',
  'Evento Especial',
];

const DRESS_CODE_PRESETS = [
  { label: 'All Black Noturno', text: 'Camisa preta lisa sem estampa, calça escura e sapato fechado antiderrapante.' },
  { label: 'Social Clássico', text: 'Camisa social manga longa ou curta preta, calça social de alfaiataria e sapatos pretos.' },
  { label: 'Casual Bistrô', text: 'Camiseta preta básica de algodão, calça jeans escura sem rasgos e tênis escuro discreto.' },
];

const RULES_PRESETS = [
  'Chegar com 15 minutos de antecedência para alinhamento.',
  'Entrada obrigatória pela portaria lateral de serviço.',
  'Trazer abridor de garrafa próprio e avental escuro.',
  'Atendimento às mesas do salão principal com comanda eletrônica.',
];

export const CreateGigScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addGig } = useContractor();

  const [role, setRole] = useState<string>('Bartender');
  const [customTitle, setCustomTitle] = useState<string>('Bartender de Coquetelaria');
  const [category, setCategory] = useState<ContractorGigCategory>('Turno Normal');
  const [date, setDate] = useState<string>('2026-10-24');
  const [startTime, setStartTime] = useState<string>('19:00');
  const [endTime, setEndTime] = useState<string>('01:30');
  
  const [rateRaw, setRateRaw] = useState<number>(240);
  const [rateText, setRateText] = useState<string>('R$ 240,00');

  const [dressCode, setDressCode] = useState<string>(
    'Camisa preta lisa sem estampa, calça escura e sapato fechado antiderrapante.'
  );
  const [rulesAndNotes, setRulesAndNotes] = useState<string>(
    'Chegar com 15 minutos de antecedência para alinhamento da praça com o chefe de bar. Trazer abridor próprio.'
  );

  const [neighborhood, setNeighborhood] = useState<string>('Batel Soho');
  const [address, setAddress] = useState<string>('Av. do Batel, 1540 - Curitiba/PR');
  const [vacancies, setVacancies] = useState<number>(1);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { raw, formatted } = formatCurrencyInput(e.target.value);
    setRateRaw(raw);
    setRateText(formatted);
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setCustomTitle(`${selectedRole} para Turno Noturno`);
  };

  // Cálculo aproximado de horas de turno
  const calculateDuration = () => {
    try {
      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = endTime.split(':').map(Number);
      let diff = (endH * 60 + endM) - (startH * 60 + startM);
      if (diff < 0) diff += 24 * 60; // Passou da meia noite
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    } catch {
      return '6 horas';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const created = addGig({
        title: customTitle,
        role,
        category,
        date,
        dateFormatted: 'Sexta-feira, 24 de Outubro',
        startTime,
        endTime,
        rate: rateRaw,
        rateFormatted: formatCurrency(rateRaw),
        dressCode,
        rulesAndNotes,
        venueName: 'Bistrô do Batel',
        neighborhood,
        address,
        vacancies,
      });

      setIsSubmitting(false);
      setSuccessMessage('Vaga de taxa publicada com sucesso! Redirecionando para o painel de vagas...');

      setTimeout(() => {
        navigate('/contractor/gigs');
      }, 1000);
    }, 400);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Top Banner / Heading */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
              SOLICITAÇÃO DE DEMANDA
            </span>
            <span className="text-xs text-zinc-400">Restaurante / Bar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Criar Nova Vaga de Taxa
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Publique a necessidade de turnos para garçons, bartenders e recepcionistas no radar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/contractor/gigs')}
          className="self-start sm:self-auto text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl border border-white/5 bg-[#171A22] transition-colors cursor-pointer"
        >
          Ver Vagas Criadas
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-[#00E676]/15 border border-[#00E676]/40 rounded-2xl text-xs text-[#00E676] flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário Principal (8 Colunas no Desktop) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Seção 1: Papel e Título */}
          <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00E676]">
              <Sparkles className="w-4 h-4" />
              <span>1. Papel & Categoria da Vaga</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                FUNÇÃO / PAPEL DO PROFISSIONAL
              </label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleSelect(r)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      role === r
                        ? 'bg-[#00E676] text-black border-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.3)]'
                        : 'bg-[#181a20] text-zinc-300 border-white/5 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                TÍTULO EXIBIDO NO APP
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Ex: Bartender para Coquetelaria de Sexta"
                className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                CATEGORIA DA TAXA
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border ${
                      category === cat
                        ? 'bg-[#00E676]/15 border-[#00E676]/50 text-[#00E676] font-bold'
                        : 'bg-[#181a20] border-white/5 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seção 2: Data, Horário e Remuneração */}
          <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00E676]">
              <Clock className="w-4 h-4" />
              <span>2. Data, Horário & Remuneração</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  DATA DO TURNO
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  HORÁRIO INÍCIO
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  HORÁRIO TÉRMINO
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  VALOR DA TAXA (R$)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={rateText}
                    onChange={handleRateChange}
                    placeholder="R$ 240,00"
                    className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-4 py-2.5 text-sm font-bold text-[#00E676] focus:outline-none focus:border-[#00E676] tabular-nums"
                    required
                  />
                </div>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Duração estimada: <span className="text-white font-medium">{calculateDuration()}</span>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  VAGAS NECESSÁRIAS
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setVacancies(n)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        vacancies === n
                          ? 'bg-[#00E676] text-black border-[#00E676]'
                          : 'bg-[#181a20] text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {n} {n === 1 ? 'vaga' : 'vagas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Seção 3: Speckit Microtraining (Dress Code e Regras da Casa) */}
          <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00E676]">
              <Shirt className="w-4 h-4" />
              <span>3. Regras & Speckit Microtraining</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  DRESS CODE OBRIGATÓRIO
                </label>
                <span className="text-[10px] text-zinc-400">Sugestões rápidas:</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {DRESS_CODE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setDressCode(preset.text)}
                    className="text-[11px] bg-[#181a20] hover:bg-[#20232c] text-zinc-300 px-2.5 py-1 rounded-lg border border-white/5 transition-colors cursor-pointer"
                  >
                    + {preset.label}
                  </button>
                ))}
              </div>

              <textarea
                rows={2}
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                placeholder="Ex: Camisa preta lisa, calça escura e sapato fechado antiderrapante..."
                className="w-full bg-[#181a20] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] resize-none"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  OBSERVAÇÕES E REGRAS DO LOCAL
                </label>
                <span className="text-[10px] text-zinc-400">Sugestões:</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {RULES_PRESETS.map((rule) => (
                  <button
                    key={rule}
                    type="button"
                    onClick={() =>
                      setRulesAndNotes((prev) => (prev ? `${prev} ${rule}` : rule))
                    }
                    className="text-[11px] bg-[#181a20] hover:bg-[#20232c] text-zinc-300 px-2.5 py-1 rounded-lg border border-white/5 transition-colors cursor-pointer truncate max-w-xs"
                  >
                    + {rule}
                  </button>
                ))}
              </div>

              <textarea
                rows={3}
                value={rulesAndNotes}
                onChange={(e) => setRulesAndNotes(e.target.value)}
                placeholder="Ex: Chegar 15 minutos antes pela portaria de serviço. Foco em salão principal..."
                className="w-full bg-[#181a20] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] resize-none"
                required
              />
            </div>
          </div>

          {/* Localização do Estabelecimento */}
          <div className="p-5 bg-[#121418] border border-white/10 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00E676]">
              <MapPin className="w-4 h-4" />
              <span>4. Local do Evento / Estabelecimento</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  BAIRRO / REGIÃO
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Batel Soho"
                  className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  ENDEREÇO COMPLETO
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. do Batel, 1540"
                  className="w-full bg-[#181a20] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pré-visualização da Oferta (5 Colunas no Desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24 space-y-5">
            <div className="p-5 bg-gradient-to-br from-[#161920] to-[#121418] border border-white/10 rounded-3xl relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase text-[#00E676] tracking-wider">
                  PRÉ-VISUALIZAÇÃO NO MAPA
                </span>
                <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full">
                  Visão do Freelancer
                </span>
              </div>

              {/* Card visual da vaga */}
              <div className="bg-[#181a20] border border-white/10 rounded-2xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
                      {category}
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-1.5 leading-snug">
                      {customTitle || 'Título da Vaga'}
                    </h3>
                    <p className="text-xs text-zinc-400">Bistrô do Batel • {neighborhood}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-[#00E676] tabular-nums">
                      {rateText}
                    </span>
                    <p className="text-[10px] text-zinc-400">PIX Garantido</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#00E676]" />
                    <span>{startTime} - {endTime}</span>
                  </div>
                </div>

                {/* Speckit Box */}
                <div className="p-3 bg-[#121418] rounded-xl border border-white/5 space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Dress Code:
                  </p>
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
                    {dressCode || 'Uniforme da casa'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                <span>Vaga auditada e protegida com repasse instantâneo</span>
              </div>
            </div>

            {/* Botão de Envio Principal */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#00E676] text-black font-black text-sm tracking-wide shadow-[0_0_25px_rgba(0,230,118,0.4)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{isSubmitting ? 'PUBLICANDO DEMANDA...' : 'PUBLICAR VAGA NO RADAR'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
