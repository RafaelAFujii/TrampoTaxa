import React from 'react';
import { Wine, Utensils } from 'lucide-react';
import { Profession } from '../../types';

interface ProfessionToggleProps {
  selected: Profession;
  onChange: (profession: Profession) => void;
}

export const ProfessionToggle: React.FC<ProfessionToggleProps> = ({
  selected,
  onChange,
}) => {
  return (
    <div className="w-full flex flex-col gap-2 text-left">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
        ESCOLHA SUA PROFISSÃO PRINCIPAL
      </label>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Bartender Button */}
        <button
          type="button"
          onClick={() => onChange('Bartender')}
          className={`
            flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border transition-all duration-200 cursor-pointer
            ${
              selected === 'Bartender'
                ? 'border-[#00E676] bg-[#00E676]/10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                : 'border-white/5 bg-[#18191D] text-zinc-400 hover:text-zinc-200 hover:border-white/10'
            }
          `}
        >
          <Wine className={`w-4 h-4 ${selected === 'Bartender' ? 'text-[#00E676]' : 'text-zinc-400'}`} />
          <span className="text-sm font-semibold tracking-tight">Bartender</span>
        </button>

        {/* Garçom Button */}
        <button
          type="button"
          onClick={() => onChange('Garçom')}
          className={`
            flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl border transition-all duration-200 cursor-pointer
            ${
              selected === 'Garçom'
                ? 'border-[#00E676] bg-[#00E676]/10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.2)]'
                : 'border-white/5 bg-[#18191D] text-zinc-400 hover:text-zinc-200 hover:border-white/10'
            }
          `}
        >
          <Utensils className={`w-4 h-4 ${selected === 'Garçom' ? 'text-[#00E676]' : 'text-zinc-400'}`} />
          <span className="text-sm font-semibold tracking-tight">Garçom</span>
        </button>
      </div>
    </div>
  );
};
