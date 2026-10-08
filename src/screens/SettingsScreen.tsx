import React, { useState } from 'react';
import { ChevronLeft, Sliders, Wine, Utensils, MapPin, Bell, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../components/ui/PrimaryButton';

interface SettingsScreenProps {
  onBack?: () => void;
  onSave?: (settings: {
    bartenderActive: boolean;
    garcomActive: boolean;
    maxDistanceKm: number;
  }) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onSave,
}) => {
  const navigate = useNavigate();
  const [bartenderActive, setBartenderActive] = useState(true);
  const [garcomActive, setGarcomActive] = useState(true);
  const [maxDistanceKm, setMaxDistanceKm] = useState(10);
  const [pushNotifications, setPushNotifications] = useState(true);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxDistanceKm(Number(e.target.value));
  };

  const handleBack = () => {
    if (onSave) {
      onSave({ bartenderActive, garcomActive, maxDistanceKm });
    }
    if (onBack) {
      onBack();
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex justify-center pb-24 lg:pb-10">
      <div className="w-full max-w-3xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs sm:text-sm font-semibold"
          >
            <ChevronLeft className="w-4 h-4 text-[#00E676]" />
            <span>Voltar ao Perfil</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Configurações
          </h1>

          <div className="w-24" />
        </div>

        {/* Section 1: Preferências de Trabalho */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Sliders className="w-4 h-4 text-[#00E676]" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Preferências de Trabalho
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Selecione quais tipos de vagas deseja receber no mapa de Curitiba. Ambas as profissões podem ficar ativas simultaneamente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Bartender Card */}
            <div
              onClick={() => setBartenderActive(!bartenderActive)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                bartenderActive
                  ? 'bg-[#00E676]/10 border-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.15)]'
                  : 'bg-[#181a20] border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    bartenderActive ? 'bg-[#00E676] text-black font-bold' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  <Wine className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Bartender</h4>
                  <p className="text-xs text-zinc-400">Drinks & Coquetelaria</p>
                </div>
              </div>

              {/* iOS switch */}
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  bartenderActive ? 'bg-[#00E676]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                    bartenderActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>

            {/* Garçom Card */}
            <div
              onClick={() => setGarcomActive(!garcomActive)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                garcomActive
                  ? 'bg-[#00E676]/10 border-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.15)]'
                  : 'bg-[#181a20] border-white/5 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    garcomActive ? 'bg-[#00E676] text-black font-bold' : 'bg-white/5 text-zinc-400'
                  }`}
                >
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Garçom</h4>
                  <p className="text-xs text-zinc-400">Atendimento e Salão</p>
                </div>
              </div>

              {/* iOS switch */}
              <div
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  garcomActive ? 'bg-[#00E676]' : 'bg-zinc-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${
                    garcomActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Raio de Distância */}
        <div className="bg-[#121418] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <MapPin className="w-4 h-4 text-[#00E676]" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Raio de Distância Máxima
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Defina a distância limite para vagas prioritárias ao redor da sua localização em Curitiba.
            </p>
          </div>

          <div className="bg-[#181a20] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-300 font-medium">Distância configurada:</span>
              <span className="text-base font-black text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-full border border-[#00E676]/30">
                {maxDistanceKm} km
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={maxDistanceKm}
              onChange={handleSliderChange}
              className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#00E676]"
            />

            <div className="flex justify-between text-xs text-zinc-500 font-bold px-1">
              <span>1 km (Batel / Centro)</span>
              <span>5 km</span>
              <span>10 km (Maioria das vagas)</span>
              <span>15 km (Grande Curitiba)</span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-2">
          <PrimaryButton onClick={handleBack}>
            SALVAR PREFERÊNCIAS
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
