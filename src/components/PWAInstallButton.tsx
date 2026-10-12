import React, { useState, useEffect } from 'react';
import { Smartphone, Share, X, Apple } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Detecta se já está em modo standalone (app instalado)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detecta se é dispositivo iOS (iPhone / iPad)
    const ua = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isAppleDevice);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsModalOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        return;
      }
    }
    // Se for iOS ou o browser não tiver o prompt nativo imediato, abre o modal explicativo
    setIsModalOpen(true);
  };

  if (isInstalled) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00E676]/20 to-[#00B0FF]/20 hover:from-[#00E676]/30 hover:to-[#00B0FF]/30 border border-[#00E676]/40 text-xs font-bold text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(0,230,118,0.2)]"
        title="Instalar aplicativo móvel no smartphone"
      >
        <Smartphone className="w-3.5 h-3.5 text-[#00E676]" />
        <span className="hidden sm:inline">
          {isIOS ? 'Instalar no iPhone' : 'Baixar no Celular'}
        </span>
        <span className="sm:hidden">App</span>
      </button>

      {/* Modal Guia de Instalação no Celular */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-[#121418] border border-white/10 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00E676] text-black font-black flex items-center justify-center text-sm shadow-[0_0_15px_rgba(0,230,118,0.4)]">
                  T
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Instalar TrampoTaxa</h3>
                  <p className="text-xs text-zinc-400">Versão Mobile para Celular</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <p className="leading-relaxed">
                Você pode instalar o <strong>TrampoTaxa</strong> diretamente no seu celular sem
                precisar de lojas de aplicativos (Google Play ou App Store):
              </p>

              {/* Guia Android */}
              <div className="p-3.5 rounded-2xl bg-[#181a20] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-[#00E676]" />
                  <span>No Android (Google Chrome)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 pl-1">
                  <li>
                    Toque no menu de <strong>3 pontos</strong> no canto superior do navegador.
                  </li>
                  <li>
                    Selecione <strong>&quot;Instalar aplicativo&quot;</strong> ou{' '}
                    <strong>&quot;Adicionar à tela inicial&quot;</strong>.
                  </li>
                  <li>O ícone aparecerá direto na sua gaveta de aplicativos!</li>
                </ol>
              </div>

              {/* Guia iPhone (iOS) */}
              <div className="p-3.5 rounded-2xl bg-[#181a20] border border-white/5 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Apple className="w-4 h-4 text-zinc-300" />
                  <span>No iPhone / iPad (Safari)</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-zinc-400 pl-1">
                  <li>
                    Toque no botão de <Share className="w-3.5 h-3.5 inline mx-1 text-blue-400" />{' '}
                    <strong>Compartilhar</strong> na barra inferior do Safari.
                  </li>
                  <li>
                    Role para baixo e selecione{' '}
                    <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                  </li>
                  <li>
                    Toque em <strong>&quot;Adicionar&quot;</strong> no canto superior direito.
                  </li>
                </ol>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-[#00E676] text-black font-extrabold text-xs hover:bg-[#00c853] transition-colors cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
