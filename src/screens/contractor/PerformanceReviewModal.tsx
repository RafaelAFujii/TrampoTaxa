import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  ThumbsUp,
  Tag
} from 'lucide-react';
import { ContractorGig, FreelancerApplicant } from '../../types/contractor';
import { useContractor } from '../../context/ContractorContext';

interface PerformanceReviewModalProps {
  gig: ContractorGig | null;
  applicant?: FreelancerApplicant | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

const REVIEW_TAGS = [
  'Pontual',
  'Excelente apresentação',
  'Proativo',
  'Seguiu o dress code',
  'Ágil no salão/bar',
  'Atendimento cordial',
  'Trabalho em equipe',
  'Recomendado',
];

export const PerformanceReviewModal: React.FC<PerformanceReviewModalProps> = ({
  gig,
  applicant: propApplicant,
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const { submitEvaluation, getApplicantById } = useContractor();

  const applicant =
    propApplicant ||
    (gig?.approvedFreelancerId ? getApplicantById(gig.approvedFreelancerId) : gig?.applicants[0]);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>(
    'Profissional muito pontual, atencioso e seguiu todas as regras do dress code e da casa com perfeição.'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Pontual',
    'Seguiu o dress code',
    'Excelente apresentação',
  ]);
  const [isFavorite, setIsFavorite] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen || !gig) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const getRatingDescription = (score: number) => {
    switch (score) {
      case 5:
        return 'Excelente — Superou expectativas!';
      case 4:
        return 'Muito Bom — Cumpriu todas as exigências';
      case 3:
        return 'Regular — Atendeu ao básico';
      case 2:
        return 'Insatisfatório — Teve problemas operacionais';
      case 1:
        return 'Crítico — Não recomendado';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      submitEvaluation(gig.id, {
        rating,
        feedback,
        tags: selectedTags,
        isFavorite,
        evaluatedAt: new Date().toISOString(),
        evaluatedBy: 'Gerência do Estabelecimento',
      });
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        if (onSubmitted) onSubmitted();
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#181a20] to-[#121418] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Avaliação de Desempenho</h3>
              <p className="text-xs text-zinc-400">Pós-evento • {gig.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#00E676]/20 border border-[#00E676] flex items-center justify-center text-[#00E676] mb-4 shadow-[0_0_25px_rgba(0,230,118,0.4)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-extrabold text-white mb-2">Avaliação Registrada!</h4>
            <p className="text-xs text-zinc-400 max-w-sm">
              Obrigado pelo feedback. A reputação do profissional foi atualizada na comunidade TrampoTaxa.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            {/* Identificação do Freelancer */}
            {applicant && (
              <div className="flex items-center gap-3 p-3 bg-[#181a20] rounded-2xl border border-white/5">
                <img
                  src={applicant.avatarUrl}
                  alt={applicant.name}
                  className="w-12 h-12 rounded-xl object-cover border border-[#00E676]/40"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-white">{applicant.name}</h4>
                  <p className="text-xs text-zinc-400">{applicant.profession} • Turno Concluído</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#00E676]">{gig.rateFormatted}</span>
                  <p className="text-[10px] text-zinc-400">Pago via PIX</p>
                </div>
              </div>
            )}

            {/* Seletor de Estrelas (1 a 5) */}
            <div className="flex flex-col items-center justify-center py-2 bg-[#181a20] p-4 rounded-2xl border border-white/5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                PONTUAÇÃO GERAL DO TURNO
              </label>

              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-zinc-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-semibold text-amber-400">
                {getRatingDescription(hoverRating !== null ? hoverRating : rating)}
              </span>
            </div>

            {/* Tags de elogio rápido */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                DESTAQUES DO ATENDIMENTO
              </label>
              <div className="flex flex-wrap gap-2">
                {REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-[#00E676]/15 border-[#00E676]/40 text-[#00E676]'
                          : 'bg-[#181a20] border-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Campo de texto livre para Comentários e Feedback */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                COMENTÁRIOS E FEEDBACK DETALHADO
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Ex: Pontual, atencioso e seguiu todas as regras do dress code da casa com perfeição..."
                className="w-full bg-[#181a20] border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00E676] resize-none"
              />
            </div>

            {/* Opção de favoritar o freelancer */}
            <div className="p-3.5 bg-[#181a20] rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl border ${
                    isFavorite
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">Favoritar Freelancer</h5>
                  <p className="text-[10px] text-zinc-400">
                    Prioridade no recebimento de convites para futuras taxas
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isFavorite}
                onChange={(e) => setIsFavorite(e.target.checked)}
                className="w-5 h-5 accent-[#00E676] rounded cursor-pointer"
              />
            </div>

            {/* Botão de Envio */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#00E676] text-black font-extrabold text-xs shadow-[0_0_20px_rgba(0,230,118,0.4)] hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'SALVANDO AVALIAÇÃO...' : 'ENVIAR AVALIAÇÃO'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
