import React, { useState } from 'react';
import { X, QrCode, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import { ContractorGig } from '@trampotaxa/shared';

interface MasterQrCodeModalProps {
  gig: ContractorGig | null;
  isOpen: boolean;
  onClose: () => void;
  onSimulateCheckIn?: (gigId: string) => void;
}

export const MasterQrCodeModal: React.FC<MasterQrCodeModalProps> = ({
  gig,
  isOpen,
  onClose,
  onSimulateCheckIn,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);

  if (!isOpen || !gig) return null;

  const qrPayload = gig.qrCodeSecret || 'QR_MESTRE_123';

  const handleCopy = () => {
    navigator.clipboard?.writeText(qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulate = () => {
    if (onSimulateCheckIn) {
      onSimulateCheckIn(gig.id);
      setCheckInDone(true);
      setTimeout(() => {
        setCheckInDone(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">QR Code Mestre do Salão</h3>
              <p className="text-[11px] text-zinc-400">{gig.venueName} • Curitiba</p>
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

        {/* QR Code Container */}
        <div className="p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-white rounded-3xl shadow-xl border-4 border-[#00E676]/40 relative group">
            {/* Visual SVG QR Code representation */}
            <svg
              className="w-48 h-48"
              viewBox="0 0 100 100"
              fill="black"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner 1 */}
              <rect x="5" y="5" width="28" height="28" rx="4" fill="#0A0B0E" />
              <rect x="9" y="9" width="20" height="20" rx="2" fill="white" />
              <rect x="13" y="13" width="12" height="12" rx="1" fill="#0A0B0E" />

              {/* Corner 2 */}
              <rect x="67" y="5" width="28" height="28" rx="4" fill="#0A0B0E" />
              <rect x="71" y="9" width="20" height="20" rx="2" fill="white" />
              <rect x="75" y="13" width="12" height="12" rx="1" fill="#0A0B0E" />

              {/* Corner 3 */}
              <rect x="5" y="67" width="28" height="28" rx="4" fill="#0A0B0E" />
              <rect x="9" y="71" width="20" height="20" rx="2" fill="white" />
              <rect x="13" y="75" width="12" height="12" rx="1" fill="#0A0B0E" />

              {/* Data dots pattern representing MASTER QR */}
              <rect x="38" y="10" width="8" height="8" fill="#0A0B0E" />
              <rect x="50" y="10" width="8" height="8" fill="#0A0B0E" />
              <rect x="38" y="24" width="8" height="8" fill="#0A0B0E" />
              <rect x="50" y="24" width="8" height="8" fill="#0A0B0E" />
              <rect x="10" y="38" width="8" height="8" fill="#0A0B0E" />
              <rect x="24" y="38" width="8" height="8" fill="#0A0B0E" />
              <rect x="38" y="38" width="24" height="24" rx="3" fill="#00E676" />
              <rect x="68" y="38" width="8" height="8" fill="#0A0B0E" />
              <rect x="82" y="38" width="8" height="8" fill="#0A0B0E" />
              <rect x="38" y="68" width="8" height="8" fill="#0A0B0E" />
              <rect x="50" y="68" width="8" height="8" fill="#0A0B0E" />
              <rect x="38" y="82" width="8" height="8" fill="#0A0B0E" />
              <rect x="68" y="68" width="8" height="8" fill="#0A0B0E" />
              <rect x="82" y="82" width="8" height="8" fill="#0A0B0E" />
            </svg>

            <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/80 px-2 py-1 rounded text-[10px] text-white font-mono">
                {qrPayload}
              </span>
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Código Alfanumérico de Contingência:
            </span>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-sm font-black text-[#00E676] bg-[#00E676]/10 px-3 py-1 rounded-lg border border-[#00E676]/30">
                {qrPayload}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                title="Copiar código"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#00E676]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-[#181a20] rounded-2xl border border-white/5 text-left text-xs space-y-1.5">
            <div className="flex items-center gap-2 text-[#00E676] font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Validação de Presença Sem Fraude</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Exiba esta tela para o freelancer confirmado ao chegar no restaurante. A leitura valida o início
              do turno e garante a cobertura da vaga.
            </p>
          </div>

          {/* Botão de Simulação Rápida para Teste do Fluxo */}
          <button
            type="button"
            onClick={handleSimulate}
            disabled={checkInDone}
            className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              checkInDone
                ? 'bg-[#00E676] text-black'
                : 'bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10'
            }`}
          >
            {checkInDone ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>Check-in Registrado com Sucesso!</span>
              </>
            ) : (
              <span>[Simulador] Simular Leitura do Freelancer Agora</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
