import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Phone,
  ShieldCheck,
  CheckCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useContractor } from '../../context/ContractorContext';
import { useAuth } from '../../context/AuthContext';
import type { GigOffer } from '@trampotaxa/shared';

export interface ManagerChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: GigOffer;
  phoneNumber?: string;
}

const QUICK_PROMPTS = [
  'Qual é a entrada de serviço?',
  'Cheguei no local!',
  'Onde posso guardar meus pertences?',
  'Estou a 5 minutos do restaurante.',
];

export const ManagerChatModal: React.FC<ManagerChatModalProps> = ({
  isOpen,
  onClose,
  gig,
  phoneNumber = '(41) 98765-4321',
}) => {
  const { user } = useAuth();
  const { messages, sendFreelancerMessage } = useContractor();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mapeia mensagens específicas para esta vaga
  const gigMessages = messages.filter((m) => m.gigId === gig.id);

  // Rolagem suave para o fim ao receber nova mensagem
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, gigMessages.length, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    sendFreelancerMessage(gig.id, content, user?.name || 'Freelancer');
    setInputText('');

    // Simula indicador de digitação do gerente após 400ms por 800ms
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 800);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const cleanPhone = phoneNumber.replace(/\D/g, '');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click outside */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full sm:max-w-lg h-[88vh] sm:h-[620px] bg-[#10131A] border border-white/10 sm:rounded-3xl rounded-t-[32px] shadow-2xl flex flex-col overflow-hidden">
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-zinc-700/80 rounded-full mx-auto mt-2.5 mb-1" />

        {/* ======================================================== */}
        {/* HEADER DO CHAT COM O GERENTE                             */}
        {/* ======================================================== */}
        <header className="px-5 py-3.5 bg-[#141822] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00E676]/20 to-emerald-800/40 border border-[#00E676]/30 flex items-center justify-center text-[#00E676] shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00E676] border-2 border-[#141822]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Gerência de Salão
                </h3>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30">
                  Online
                </span>
              </div>
              <span className="text-xs text-zinc-400 truncate max-w-[200px] sm:max-w-[260px]">
                {gig.venueName} • {gig.neighborhood}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Atalho para ligação rápida de emergência */}
            <a
              href={`tel:${cleanPhone}`}
              title="Ligar para o gerente"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-[#00E676] border border-white/5 transition-colors cursor-pointer"
            >
              <Phone className="w-4 h-4" />
            </a>

            {/* Fechar modal */}
            <button
              type="button"
              onClick={onClose}
              title="Fechar chat"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Security / Context Banner */}
        <div className="px-4 py-2 bg-[#0C0E14] border-b border-white/5 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00E676]" />
            <span>Canal oficial do turno: {gig.profession} ({gig.shiftTime})</span>
          </div>
          <span className="text-[10px] text-zinc-500 hidden sm:inline">
            Taxa: {gig.rateFormatted}
          </span>
        </div>

        {/* ======================================================== */}
        {/* CORPO DE MENSAGENS                                       */}
        {/* ======================================================== */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#0A0C11]">
          {/* Mensagem de Boas-Vindas Padrão do Estabelecimento */}
          <div className="flex gap-2.5 max-w-[85%]">
            <div className="w-7 h-7 rounded-full bg-[#181D28] border border-white/10 flex items-center justify-center text-[#00E676] text-xs font-bold shrink-0 mt-0.5">
              G
            </div>
            <div className="space-y-1">
              <div className="bg-[#151924] border border-white/10 rounded-2xl rounded-tl-sm p-3 shadow-md">
                <span className="text-[10px] font-bold text-[#00E676] block mb-1">
                  Gerente de Plantão ({gig.venueName})
                </span>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  Olá {user?.name || 'colega'}! Estamos com tudo pronto para o seu turno de hoje.
                  Se tiver qualquer dúvida sobre chegada, entrada de serviço ou vestiário, fale comigo por aqui!
                </p>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 pl-1">
                <Clock className="w-3 h-3" />
                <span>Hoje</span>
              </div>
            </div>
          </div>

          {/* Mensagens dinâmicas do context */}
          {gigMessages.map((msg) => {
            const isMe = msg.senderRole === 'Freelancer';

            if (isMe) {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[82%] space-y-1">
                    <div className="bg-[#00E676] text-black font-medium rounded-2xl rounded-tr-sm p-3 shadow-md">
                      <p className="text-xs leading-relaxed font-semibold">{msg.text}</p>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-400 pr-1">
                      <span>{msg.timestamp}</span>
                      <CheckCheck className="w-3.5 h-3.5 text-[#00E676]" />
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className="flex gap-2.5 max-w-[85%]">
                <div className="w-7 h-7 rounded-full bg-[#181D28] border border-white/10 flex items-center justify-center text-[#00E676] text-xs font-bold shrink-0 mt-0.5">
                  G
                </div>
                <div className="space-y-1">
                  <div className="bg-[#151924] border border-white/10 rounded-2xl rounded-tl-sm p-3 shadow-md">
                    <span className="text-[10px] font-bold text-[#00E676] block mb-1">
                      {msg.senderName}
                    </span>
                    <p className="text-xs text-zinc-200 leading-relaxed">{msg.text}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 pl-1">
                    <Clock className="w-3 h-3" />
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Indicador de Digitação do Gerente */}
          {isTyping && (
            <div className="flex gap-2.5 max-w-[80%] items-center animate-fadeIn">
              <div className="w-7 h-7 rounded-full bg-[#181D28] border border-white/10 flex items-center justify-center text-[#00E676] text-xs font-bold shrink-0">
                G
              </div>
              <div className="bg-[#151924] border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-zinc-400 ml-1.5">Gerente digitando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ======================================================== */}
        {/* SUGESTÕES DE MENSAGENS RÁPIDAS                           */}
        {/* ======================================================== */}
        <div className="px-4 py-2 bg-[#12151D] border-t border-white/5 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            <Sparkles className="w-3 h-3 text-[#00E676]" />
            <span>Rápido:</span>
          </div>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-[11px] text-zinc-300 hover:text-white bg-white/5 hover:bg-[#00E676]/15 hover:border-[#00E676]/40 border border-white/10 px-3 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* INPUT DE MENSAGEM                                        */}
        {/* ======================================================== */}
        <footer className="p-3 bg-[#141822] border-t border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite uma mensagem para o gerente..."
              className="flex-1 bg-[#0A0C11] border border-white/10 focus:border-[#00E676]/50 rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!inputText.trim()}
              title="Enviar mensagem"
              className={`p-3 rounded-2xl font-bold transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                inputText.trim()
                  ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.4)] hover:scale-105 active:scale-95'
                  : 'bg-white/5 text-zinc-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};
