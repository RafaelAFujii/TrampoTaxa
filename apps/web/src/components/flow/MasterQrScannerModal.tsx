import React from 'react';
import { X, QrCode, Zap, ShieldCheck } from 'lucide-react';

interface MasterQrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (payload: string) => void;
  title?: string;
}

export const MasterQrScannerModal: React.FC<MasterQrScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = 'Escanear QR Code Mestre',
}) => {
  if (!isOpen) return null;

  const handleSimulate = () => {
    onScanSuccess('QR_MESTRE_123');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#101218] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col p-6 items-center space-y-5">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center text-[#00E676]">
              <QrCode className="w-4 h-4" />
            </div>
            <h3 className="text-base font-extrabold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 text-center max-w-xs">
          Aponte a câmera para o visor do estabelecimento para validar seu início de turno presencial.
        </p>

        {/* Viewport da Câmera Mockada com Cantoneiras & Laser Animado */}
        <div className="relative w-64 h-64 bg-[#0a0c10] rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
          {/* 4 Cantoneiras da Mira */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-[#00E676]" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-[#00E676]" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-[#00E676]" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-[#00E676]" />

          {/* Feixe Laser Neon Animado */}
          <div className="absolute left-0 right-0 h-1 bg-[#00E676] shadow-[0_0_15px_#00E676] animate-pulse transition-all" />

          {/* Mira Central */}
          <div className="w-24 h-24 rounded-xl border border-dashed border-white/20 flex items-center justify-center">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
              Alinhe Aqui
            </span>
          </div>

          <div className="absolute bottom-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 flex items-center gap-1.5 text-[10px] text-zinc-300">
            <ShieldCheck className="w-3 h-3 text-[#00E676]" />
            <span>Validação de Presença Física</span>
          </div>
        </div>

        {/* Botão de Debug / Simulação Rápida */}
        <div className="w-full space-y-2 pt-2">
          <button
            type="button"
            onClick={handleSimulate}
            className="w-full py-3.5 px-4 bg-[#00E676]/15 hover:bg-[#00E676]/25 border border-[#00E676]/40 hover:border-[#00E676]/70 text-[#00E676] rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg group"
          >
            <Zap className="w-4 h-4 text-[#00E676] transition-transform group-hover:scale-125" />
            <span>[DEBUG] Simular Leitura do QR Mestre</span>
          </button>
          <p className="text-[10px] text-zinc-500 text-center font-mono">
            Payload fixo: &quot;QR_MESTRE_123&quot;
          </p>
        </div>
      </div>
    </div>
  );
};
