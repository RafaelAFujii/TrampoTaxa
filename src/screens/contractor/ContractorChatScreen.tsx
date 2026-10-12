import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, CheckCheck, Search, Info } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useContractor } from '../../context/ContractorContext';
import { FreelancerApplicant } from '../../types/contractor';

const QUICK_MESSAGES = [
  'Qual a sua previsão de chegada para o turno?',
  'Lembrete: entrada pela portaria de serviço lateral na Av. do Batel.',
  'Por favor, lembre-se de trazer abridor de garrafas próprio e avental.',
  'Qualquer imprevisto com trânsito, avise por aqui com antecedência.',
];

export const ContractorChatScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialGigId = searchParams.get('gigId');

  const { gigs, messages, sendMessage } = useContractor();

  // Filtrar apenas vagas que possuem candidatos ou estão preenchidas/finalizadas
  const chatGigs = gigs.filter(
    (g) =>
      g.status === 'Preenchida' ||
      g.status === 'Finalizada' ||
      g.approvedFreelancerId ||
      g.applicants.length > 0
  );

  const [selectedGigId, setSelectedGigId] = useState<string>(() => {
    if (initialGigId && chatGigs.some((g) => g.id === initialGigId)) {
      return initialGigId;
    }
    return chatGigs[0]?.id || 'cgig-103';
  });

  const [inputText, setInputText] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentGig = gigs.find((g) => g.id === selectedGigId) || chatGigs[0];
  const approvedApplicant: FreelancerApplicant | undefined =
    currentGig?.applicants.find(
      (a) => a.id === currentGig.approvedFreelancerId || a.status === 'Aprovado'
    ) || currentGig?.applicants[0];

  const gigMessages = messages.filter((m) => m.gigId === selectedGigId);

  // Scroll automático para o final ao receber nova mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [gigMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedGigId) return;

    sendMessage(selectedGigId, inputText);
    setInputText('');
  };

  const handleSendQuick = (text: string) => {
    if (!selectedGigId) return;
    sendMessage(selectedGigId, text);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header da Tela */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/20">
              COMUNICAÇÃO INTERNA
            </span>
            <span className="text-xs text-zinc-400">Canal Direto com Freelancers</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Mensagens Diretas por Taxa
          </h1>
        </div>

        <button
          type="button"
          onClick={() => navigate('/contractor/gigs')}
          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl border border-white/5 bg-[#171A22] transition-colors cursor-pointer"
        >
          Voltar às Vagas
        </button>
      </div>

      {/* Grid do Chat: Lista de conversas + Janela ativa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-[72vh] min-h-[550px]">
        {/* Painel Esquerdo: Lista de Vagas / Conversas (4 colunas) */}
        <div className="lg:col-span-4 border-r border-white/5 flex flex-col bg-[#14161c]">
          {/* Busca de conversas */}
          <div className="p-3.5 border-b border-white/5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conversa ou taxa..."
                className="w-full bg-[#181a20] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676]"
              />
            </div>
          </div>

          {/* Lista de Chats por Vaga */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/5">
            {chatGigs
              .filter(
                (g) =>
                  g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  g.role.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((gig) => {
                const isSelected = gig.id === selectedGigId;
                const applicant =
                  gig.applicants.find(
                    (a) => a.id === gig.approvedFreelancerId || a.status === 'Aprovado'
                  ) || gig.applicants[0];
                const lastMsg = messages.filter((m) => m.gigId === gig.id).slice(-1)[0];

                return (
                  <button
                    key={gig.id}
                    type="button"
                    onClick={() => setSelectedGigId(gig.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a1e27] border-l-2 border-[#00E676]'
                        : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={
                          applicant?.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
                        }
                        alt={applicant?.name || 'Freelancer'}
                        className="w-10 h-10 rounded-xl object-cover border border-[#00E676]/30"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00E676] border-2 border-[#121418]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className="text-xs font-bold text-white truncate">
                          {applicant?.name || 'Aguardando Aprovação'}
                        </h4>
                        <span className="text-[10px] text-zinc-400 shrink-0">
                          {lastMsg ? lastMsg.timestamp.split(' ')[0] : 'Hoje'}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#00E676] font-medium truncate">{gig.title}</p>

                      <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {lastMsg ? lastMsg.text : 'Nenhuma mensagem trocada ainda'}
                      </p>
                    </div>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Painel Direito: Janela de Chat Ativa (8 colunas) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#0f1013]">
          {/* Header do Chat Ativo */}
          {currentGig ? (
            <div className="p-4 bg-[#14161c] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      approvedApplicant?.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
                    }
                    alt={approvedApplicant?.name || 'Freelancer'}
                    className="w-10 h-10 rounded-xl object-cover border border-[#00E676]/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00E676] border-2 border-[#14161c]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {approvedApplicant?.name || 'Freelancer Selecionado'}
                    </h3>
                    <span className="text-[10px] font-bold text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded">
                      {approvedApplicant?.profession || currentGig.role}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 flex items-center gap-2">
                    <span>Vaga: {currentGig.title}</span>
                    <span>·</span>
                    <span className="text-zinc-300 font-semibold">{currentGig.rateFormatted}</span>
                  </p>
                </div>
              </div>

              {/* Botão de contato rápido ou regras */}
              <div className="flex items-center gap-2">
                {approvedApplicant?.phone && (
                  <span className="hidden sm:inline-block text-xs font-mono text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg">
                    {approvedApplicant.phone}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/contractor/gigs')}
                  title="Ver detalhes da vaga"
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#14161c] border-b border-white/5 text-xs text-zinc-400">
              Selecione uma vaga para conversar
            </div>
          )}

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3.5">
            {/* Aviso de segurança e privacidade */}
            <div className="flex justify-center my-2">
              <span className="text-[10px] text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                Canal oficial TrampoTaxa para alinhamento de ponto de encontro e dress code
              </span>
            </div>

            {gigMessages.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-zinc-600" />
                <p>Nenhuma mensagem trocada ainda para esta taxa.</p>
                <p className="text-[11px] text-zinc-400">
                  Envie uma mensagem abaixo para confirmar os detalhes do turno com o freelancer.
                </p>
              </div>
            ) : (
              gigMessages.map((msg) => {
                const isContratante = msg.senderRole === 'Contratante';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isContratante ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                        isContratante
                          ? 'bg-[#00E676] text-black font-medium rounded-br-xs'
                          : 'bg-[#181a20] text-zinc-200 border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1 px-1">
                      <span>{msg.timestamp}</span>
                      {isContratante && <CheckCheck className="w-3 h-3 text-[#00E676]" />}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Sugestões Rápidas de Mensagens */}
          <div className="px-4 py-2 bg-[#121418] border-t border-white/5 overflow-x-auto scrollbar-none flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-zinc-400 shrink-0">Rápido:</span>
            {QUICK_MESSAGES.map((qm) => (
              <button
                key={qm}
                type="button"
                onClick={() => handleSendQuick(qm)}
                className="text-[11px] bg-[#181a20] hover:bg-[#20232c] text-zinc-300 hover:text-white px-2.5 py-1 rounded-xl border border-white/5 whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {qm}
              </button>
            ))}
          </div>

          {/* Input de Envio */}
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 bg-[#14161c] border-t border-white/5 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite uma mensagem sobre a taxa (ex: ponto de encontro, regras)..."
              className="flex-1 bg-[#181a20] border border-white/10 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3 rounded-2xl bg-[#00E676] text-black font-bold shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:brightness-110 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
