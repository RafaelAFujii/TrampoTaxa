import React, { useState } from 'react';
import { UserPlus, Check, ArrowLeft, ShieldCheck, CheckCircle } from 'lucide-react';
import { TextInput } from '../components/ui/TextInput';
import { ProfessionToggle } from '../components/ui/ProfessionToggle';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Profession } from '../types';

interface CadastroScreenProps {
  onNavigateToLogin?: () => void;
  onCadastroSuccess?: () => void;
}

export const CadastroScreen: React.FC<CadastroScreenProps> = ({
  onNavigateToLogin,
  onCadastroSuccess,
}) => {
  const [profession, setProfession] = useState<Profession>('Bartender');
  const [nome, setNome] = useState('Gabriel Silva');
  const [email, setEmail] = useState('seu@email.com');
  const [telefone, setTelefone] = useState('(41) 99999-0000');
  const [senha, setSenha] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('Por favor, aceite os Termos de Uso e Políticas.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onCadastroSuccess) {
        onCadastroSuccess();
      }
    }, 500);
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-[#121418] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Side: Onboarding banner */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-10 bg-gradient-to-br from-[#161920] to-[#0d0f12] border-r border-white/5 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none" />

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

            <h2 className="text-2xl font-extrabold text-white leading-tight mb-4">
              Junte-se a centenas de freelancers em Curitiba.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Cadastre-se gratuitamente, informe sua profissão principal e comece a pegar turnos hoje mesmo.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Escolha seu próprio horário e dias disponíveis</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Receba notificações de vagas no seu raio de busca</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Avaliações que impulsionam suas taxas por turno</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center gap-2.5 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span>Verificação e dados protegidos</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#121418]">
          <div>
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
                Criar Conta
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Cadastre-se e comece a faturar hoje mesmo em Curitiba.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <ProfessionToggle
                selected={profession}
                onChange={setProfession}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <TextInput
                  label="NOME COMPLETO"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Gabriel Silva"
                />

                <TextInput
                  label="TELEFONE"
                  maskType="phone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(41) 99999-0000"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <TextInput
                  label="E-MAIL"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />

                <TextInput
                  label="SENHA"
                  isPassword
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Crie uma senha forte"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className={`
                    w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer shrink-0
                    ${
                      acceptTerms
                        ? 'bg-[#00E676] text-black shadow-[0_0_8px_rgba(0,230,118,0.4)]'
                        : 'border border-zinc-600 bg-[#18191D]'
                    }
                  `}
                >
                  {acceptTerms && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <label
                  onClick={() => setAcceptTerms(!acceptTerms)}
                  className="text-xs text-zinc-400 cursor-pointer select-none"
                >
                  Li e aceito os{' '}
                  <span className="text-white underline font-medium">Termos de Uso</span>{' '}
                  e Políticas do Trampo CWB.
                </label>
              </div>

              <div className="mt-2">
                <PrimaryButton
                  type="submit"
                  icon={<UserPlus className="w-4 h-4 text-black" />}
                  disabled={isLoading}
                >
                  {isLoading ? 'CRIANDO CONTA...' : 'CRIAR MINHA CONTA'}
                </PrimaryButton>
              </div>
            </form>
          </div>

          <div className="text-center pt-6 border-t border-white/5 mt-6">
            <p className="text-xs sm:text-sm text-zinc-400">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-[#00E676] hover:text-[#00FF77] font-bold hover:underline cursor-pointer transition-colors inline-flex items-center gap-1"
              >
                <span>Entrar agora</span>
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
