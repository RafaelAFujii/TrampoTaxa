import React, { useState } from 'react';
import { LogIn, Sparkles, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { TextInput } from '../components/ui/TextInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SocialButton } from '../components/ui/SocialButton';

interface LoginScreenProps {
  onNavigateToCadastro?: () => void;
  onLoginSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToCadastro,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('freelancer@curitiba.com');
  const [password, setPassword] = useState('••••••••');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    }, 500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side: Brand Visual (Desktop only highlight) */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#161920] to-[#0d0f12] border-r border-white/5 relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-[#00E676] text-black font-black flex items-center justify-center text-sm shadow-[0_0_20px_rgba(0,230,118,0.4)]">
                T
              </div>
              <span className="text-xl font-black tracking-wider text-white">TRAMPO</span>
              <span className="text-[10px] font-black uppercase bg-[#00E676]/15 text-[#00E676] px-2 py-0.5 rounded border border-[#00E676]/30">
                CWB
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
              Os melhores turnos em restaurantes e bares de Curitiba.
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Conectamos garçons e bartenders qualificados a bares renomados com repasse rápido via PIX.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676]" />
                <span>Taxas competitivas a partir de R$ 180 por turno</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676]" />
                <span>Microtreinamento Speckit com regras do local</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676]" />
                <span>Histórico e repasses transparentes</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center gap-3 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span>Ambiente seguro para profissionais da gastronomia</span>
          </div>
        </div>

        {/* Right Side: Form (Mobile & Desktop) */}
        <div className="p-6 sm:p-10 flex flex-col justify-between bg-[#121418]">
          <div>
            {/* Mobile Header Brand */}
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-[#00E676]/10 border border-[#00E676] flex items-center justify-center text-[#00E676] shadow-[0_0_12px_rgba(0,230,118,0.3)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-wider text-white">TRAMPO</span>
              <span className="text-[10px] font-extrabold uppercase bg-[#202227] text-zinc-300 px-2 py-0.5 rounded border border-white/5 tracking-wider">
                CWB
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Entre na sua conta para encontrar seus próximos turnos.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <TextInput
                label="E-MAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />

              <div>
                <TextInput
                  label="SENHA"
                  isPassword
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => alert('Link de recuperação enviado para o seu e-mail!')}
                    className="text-xs text-[#00E676] hover:text-[#00FF77] hover:underline font-semibold transition-colors cursor-pointer"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <PrimaryButton
                  type="submit"
                  icon={<LogIn className="w-4 h-4 text-black" />}
                  disabled={isLoading}
                >
                  {isLoading ? 'ENTRANDO...' : 'ENTRAR NA CONTA'}
                </PrimaryButton>
              </div>
            </form>
          </div>

          {/* Social Login & Footer */}
          <div className="mt-8 flex flex-col gap-5">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-800 w-full" />
              <span className="bg-[#121418] px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-500 shrink-0">
                OU ENTRAR COM
              </span>
              <div className="border-t border-zinc-800 w-full" />
            </div>

            <div className="flex items-center gap-3">
              <SocialButton
                provider="Google"
                onClick={() => {
                  setEmail('google.user@curitiba.com');
                  if (onLoginSuccess) onLoginSuccess();
                }}
              />
              <SocialButton
                provider="Apple"
                onClick={() => {
                  setEmail('apple.user@curitiba.com');
                  if (onLoginSuccess) onLoginSuccess();
                }}
              />
            </div>

            <div className="text-center pt-2">
              <p className="text-xs sm:text-sm text-zinc-400">
                Não tem uma conta?{' '}
                <button
                  type="button"
                  onClick={onNavigateToCadastro}
                  className="text-[#00E676] hover:text-[#00FF77] font-bold hover:underline cursor-pointer transition-colors inline-flex items-center gap-1"
                >
                  <span>Cadastre-se</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
