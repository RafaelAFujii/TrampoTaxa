import React, { useState } from 'react';
import { Star, Sparkles, CheckCircle2 } from 'lucide-react';

interface VenueReviewModalProps {
  isOpen: boolean;
  venueName: string;
  onCompleteReview: (rating: number, tags: string[]) => void;
}

const AVAILABLE_TAGS = [
  'Ambiente Seguro',
  'Equipe Ágil',
  'Alimentação Inclusa',
  'Bar Organizado',
  'Gorjeta Justa',
];

export const VenueReviewModal: React.FC<VenueReviewModalProps> = ({
  isOpen,
  venueName,
  onCompleteReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Ambiente Seguro',
    'Bar Organizado',
  ]);
  const [celebrating, setCelebrating] = useState(false);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;

    // Transição comemorativa direta: micro-feedback de escala sem spinner
    setCelebrating(true);
    setTimeout(() => {
      onCompleteReview(rating, selectedTags);
      setCelebrating(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md bg-[#202421] border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col items-center text-center transition-all duration-300 ${
          celebrating ? 'scale-105 opacity-90 border-[#5FA780]' : 'scale-100 opacity-100'
        }`}
      >
        <span className="text-[10px] font-black uppercase tracking-wider text-[#5FA780] bg-[#5FA780]/15 px-3 py-1 rounded-full border border-[#5FA780]/30 mb-3">
          AVALIAÇÃO OBRIGATÓRIA DO TURNO
        </span>

        <h3 className="text-xl font-black text-white">Avalie o Estabelecimento</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-xs">
          Como foi sua experiência trabalhando no <strong className="text-white">{venueName}</strong>?
        </p>

        {/* 5 Estrelas Interativas */}
        <div className="flex items-center gap-2 my-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1 hover:scale-125 transition-transform cursor-pointer"
            >
              <Star
                className={`w-8 h-8 ${
                  star <= rating
                    ? 'text-[#5FA780] fill-[#5FA780] drop-'
                    : 'text-zinc-600'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Tags Rápidas de Experiência */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {AVAILABLE_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#5FA780]/15 border-[#5FA780] text-[#5FA780]'
                    : 'bg-[#202421] border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Botão de Envio Sem Loading */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full py-4 rounded-lg bg-[#5FA780] hover:bg-[#00c965] text-[#171B1A] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2  transition-all cursor-pointer hover:"
        >
          {celebrating ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-black animate-bounce" />
              <span>AVALIAÇÃO CONFIRMADA! LIBERANDO PIX...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-black" />
              <span>ENVIAR E VER MEU PIX ➔</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
