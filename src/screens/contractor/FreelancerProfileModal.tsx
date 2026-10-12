import React from 'react';
import { 
  X, 
  Star, 
  CheckCircle2, 
  Clock, 
  Award, 
  Phone, 
  MessageSquare, 
  Check, 
  Heart,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { FreelancerApplicant } from '../../types/contractor';

interface FreelancerProfileModalProps {
  applicant: FreelancerApplicant | null;
  gigTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (applicantId: string) => void;
  onReject: (applicantId: string) => void;
  onOpenChat?: (applicantId: string) => void;
  onToggleFavorite?: (applicantId: string) => void;
}

export const FreelancerProfileModal: React.FC<FreelancerProfileModalProps> = ({
  applicant,
  gigTitle,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onOpenChat,
  onToggleFavorite,
}) => {
  if (!isOpen || !applicant) return null;

  const isApproved = applicant.status === 'Aprovado';
  const isRejected = applicant.status === 'Recusado';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header com foto e ações de topo */}
        <div className="relative p-6 bg-gradient-to-br from-[#181a20] to-[#121418] border-b border-white/5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={applicant.avatarUrl}
                  alt={applicant.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#00E676]/60 shadow-[0_0_15px_rgba(0,230,118,0.2)]"
                />
                <span className="absolute -bottom-1 -right-1 p-1 bg-[#121418] rounded-full border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-[#00E676]" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">{applicant.name}</h3>
                  {applicant.isFavorite && (
                    <span title="Freelancer Favorito" className="text-amber-400 text-xs">
                      ★
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#00E676] font-semibold">{applicant.profession}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold ml-1 text-white">{applicant.rating.toFixed(1)}</span>
                  </div>
                  <span>·</span>
                  <span>{applicant.totalGigsCompleted} taxas concluídas</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(applicant.id)}
                  title={applicant.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    applicant.isFavorite
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${applicant.isFavorite ? 'fill-current' : ''}`} />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {gigTitle && (
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <span>Candidatura para:</span>
              <span className="text-white font-medium">{gigTitle}</span>
            </div>
          )}
        </div>

        {/* Corpo com métricas e especialidades */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Métricas operacionais */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#181a20] rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Clock className="w-3.5 h-3.5 text-[#00E676]" />
                <span>Pontualidade</span>
              </div>
              <p className="text-base font-bold text-white tabular-nums">
                {applicant.punctualityRate}
              </p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Sem registros de atrasos graves</p>
            </div>

            <div className="p-3 bg-[#181a20] rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <Award className="w-3.5 h-3.5 text-[#00E676]" />
                <span>Nível no Trampo</span>
              </div>
              <p className="text-base font-bold text-white">Taxista Pro</p>
              <p className="text-[10px] text-zinc-400 mt-0.5">Documentos e selfie validados</p>
            </div>
          </div>

          {/* Biografia / Perfil */}
          {applicant.bio && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                Sobre o Profissional
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed bg-[#181a20] p-3.5 rounded-2xl border border-white/5">
                {applicant.bio}
              </p>
            </div>
          )}

          {/* Competências / Especialidades */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Competências & Habilidades
            </h4>
            <div className="flex flex-wrap gap-2">
              {applicant.specialties.map((spec) => (
                <span
                  key={spec}
                  className="text-xs bg-[#1A1F29] border border-white/10 text-zinc-200 px-3 py-1 rounded-xl font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div className="p-3.5 bg-[#181a20] rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <Phone className="w-4 h-4 text-[#00E676]" />
              <span className="font-mono">{applicant.phone}</span>
            </div>
            <span className="text-[11px] text-zinc-400">Inscrito: {applicant.appliedAt}</span>
          </div>

          {/* Status Atual */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-zinc-400">Status da Candidatura:</span>
            <span
              className={`font-bold uppercase tracking-wider text-[11px] px-2.5 py-1 rounded-lg ${
                isApproved
                  ? 'bg-[#00E676]/15 text-[#00E676] border border-[#00E676]/30'
                  : isRejected
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              {applicant.status}
            </span>
          </div>
        </div>

        {/* Footer com botões de ação */}
        <div className="p-5 bg-[#16181f] border-t border-white/5 flex items-center gap-3">
          {isApproved ? (
            <div className="w-full flex items-center gap-3">
              <div className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#00E676]/15 text-[#00E676] rounded-2xl border border-[#00E676]/30 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Freelancer Aprovado para esta Taxa</span>
              </div>
              {onOpenChat && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenChat(applicant.id);
                  }}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#00E676] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(0,230,118,0.3)] hover:brightness-110 transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Abrir Chat</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  onReject(applicant.id);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Recusar
              </button>

              <button
                type="button"
                onClick={() => {
                  onApprove(applicant.id);
                  onClose();
                }}
                className="flex-2 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#00E676] hover:brightness-110 text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,230,118,0.4)] transition-all cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Aprovar Freelancer</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
