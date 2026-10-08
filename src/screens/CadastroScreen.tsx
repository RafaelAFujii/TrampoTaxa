import React, { useState } from 'react';
import { 
  UserPlus, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles,
  Building2,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../components/ui/TextInput';
import { ProfessionToggle } from '../components/ui/ProfessionToggle';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Profession } from '../types';
import { useAuth, UserRole } from '../context/AuthContext';

interface CadastroScreenProps {
  onNavigateToLogin?: () => void;
  onCadastroSuccess?: () => void;
}

export const CadastroScreen: React.FC<CadastroScreenProps> = ({
  onNavigateToLogin,
  onCadastroSuccess,
}) => {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const [role, setRole] = useState<UserRole>('Freelancer');
  const [profession, setProfession] = useState<Profession>('Bartender');
  const [nome, setNome] = useState('Gabriel Silva');
  const [email, setEmail] = useState('seu@email.com');
  const [telefone, setTelefone] = useState('(41) 99999-0000');
  const [senha, setSenha] = useState('••••••••');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!acceptTerms) {
      setErrorMessage('Por favor, confirme que aceita os Termos de Uso e Políticas para continuar.');
      return;
    }

    if (!nome.trim() || !email.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);

    try {
      await cadastrar({
        name: nome,
        email,
        role,
        phone: telefone,
        profession: role === 'Freelancer' ? profession : undefined,
      });

      if (onCadastroSuccess) {
        onCadastroSuccess();
      } else {
        // Redireciona para o mapa
        navigate('/map', { replace: true });
      }
    } catch {
      setErrorMessage('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    if (onNavigateToLogin) {
      onNavigateToLogin();
    } else {
      navigate('/login');
    }
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

            <div className="inline-block bg-[#00E676]/15 border border-[#00E676]/30 text-[#00E676] text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full mb-3">
              Primeiro Acesso
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight mb-4">
              Junte-se à maior rede gastronômica de Curitiba.
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              Cadastre-se gratuitamente, informe seu perfil e comece a operar hoje mesmo no radar.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Escolha seu próprio horário e turnos disponíveis</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Microtreinamento Speckit com regras e dress code de cada local</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>Receba via PIX imediato após a conclusão do turno</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span>Cadastro verificado e seguro</span>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-[#121418]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Login</span>
              </button>

              <span className="text-[10px] font-black uppercase text-[#00E676] tracking-wider">
                PRIMEIRO ACESSO
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              Criar Conta no TrampoTaxa
            </h1>
            <p className="text-xs text-zinc-400 mb-4">
              Preencha os dados abaixo para configurar seu acesso inicial:
            </p>

            {/* Alternar Perfil */}
            <div className="grid grid-cols-2 gap-2 bg-[#171A22] p-1.5 rounded-2xl border border-white/5 mb-4">
              <button
                type="button"
                onClick={() => setRole('Freelancer')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'Freelancer'
                    ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sou Freelancer</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('Contratante')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'Contratante'
                    ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Sou Contratante</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {role === 'Freelancer' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                    ESCOLHA SUA FUNÇÃO PRINCIPAL
                  </label>
                  <ProfessionToggle
                    selected={profession}
                    onChange={(p) => setProfession(p)}
                  />
                </div>
              )}

              <TextInput
                label={role === 'Freelancer' ? 'NOME COMPLETO' : 'NOME DO ESTABELECIMENTO'}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={role === 'Freelancer' ? 'Ex: Gabriel Silva' : 'Ex: Bistrô do Batel'}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput
                  label="E-MAIL"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
                <TextInput
                  label="TELEFONE / WHATSAPP"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="(41) 99999-0000"
                />
              </div>

              <TextInput
                label="CRIAR SENHA"
                isPassword
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
              />

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
                  e Políticas do TrampoTaxa CWB.
                </label>
              </div>

              <div className="mt-2">
                <PrimaryButton
                  type="submit"
                  icon={<UserPlus className="w-4 h-4 text-black" />}
                  disabled={isLoading}
                >
                  {isLoading ? 'CONFIGURANDO ACESSO...' : 'CONCLUIR PRIMEIRO ACESSO'}
                </PrimaryButton>
              </div>
            </form>
          </div>

          <div className="text-center pt-5 border-t border-white/5 mt-5">
            <p className="text-xs text-zinc-400">
              Já possui cadastro?{' '}
              <button
                type="button"
                onClick={handleGoToLogin}
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
