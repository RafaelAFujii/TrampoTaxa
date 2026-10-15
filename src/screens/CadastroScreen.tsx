import React, { useState } from 'react';
import {
  UserPlus,
  Check,
  ArrowLeft,
  ShieldCheck,
  CheckCircle,
  Building2,
  User,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TextInput } from '../components/ui/TextInput';
import { ProfessionToggle } from '../components/ui/ProfessionToggle';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { Profession } from '../types';
import { useAuth, UserRole } from '../context/AuthContext';
import { formatCNPJ, isValidCNPJ, formatPhone } from '../utils/formatters';

interface CadastroScreenProps {
  onNavigateToLogin?: () => void;
  onCadastroSuccess?: () => void;
}

export const BUSINESS_SEGMENTS = [
  'Restaurante',
  'Bar',
  'Casa de Eventos',
  'Buffet',
  'Hotelaria',
  'Outro',
] as const;

export const CadastroScreen: React.FC<CadastroScreenProps> = ({
  onNavigateToLogin,
  onCadastroSuccess,
}) => {
  const navigate = useNavigate();
  const { cadastrar } = useAuth();

  const [role, setRole] = useState<UserRole>('Contratante');

  // Campos comuns
  const [nome, setNome] = useState('Bistrô do Batel');
  const [email, setEmail] = useState('contato@bistrodobatel.com.br');
  const [telefone, setTelefone] = useState('(41) 99887-1234');
  const [senha, setSenha] = useState('senha123');
  const [confirmarSenha, setConfirmarSenha] = useState('senha123');
  const [acceptTerms, setAcceptTerms] = useState(true);

  // Campos específicos do Contratante
  const [cnpj, setCnpj] = useState('12.345.678/0001-90');
  const [razaoSocial, setRazaoSocial] = useState('Bistrô do Batel Gastronomia LTDA');
  const [ramoAtuacao, setRamoAtuacao] = useState<string>('Restaurante');

  // Campos específicos do Freelancer
  const [profession, setProfession] = useState<Profession>('Bartender');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleToggle = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setErrorMessage(null);
    if (selectedRole === 'Contratante') {
      setNome('Bistrô do Batel');
      setEmail('contato@bistrodobatel.com.br');
      setTelefone('(41) 99887-1234');
    } else {
      setNome('Gabriel Silva');
      setEmail('gabriel.freelancer@curitiba.com');
      setTelefone('(41) 99999-0000');
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatCNPJ(e.target.value);
    setCnpj(masked);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = formatPhone(e.target.value);
    setTelefone(masked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!acceptTerms) {
      setErrorMessage(
        'Por favor, confirme que aceita os Termos de Uso e Políticas para continuar.'
      );
      return;
    }

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErrorMessage('A confirmação de senha não coincide com a senha digitada.');
      return;
    }

    if (senha.length < 6) {
      setErrorMessage('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (role === 'Contratante') {
      const cleanCnpj = cnpj.replace(/\D/g, '');
      if (cleanCnpj.length !== 14) {
        setErrorMessage('Por favor, informe um CNPJ completo com 14 dígitos.');
        return;
      }
      // Validação amigável
      if (!isValidCNPJ(cnpj)) {
        // Se for um teste arbitrário avisamos mas permitimos continuar ou alertamos
        setErrorMessage(
          'CNPJ com dígitos verificadores inválidos. Verifique a digitação ou use um CNPJ válido.'
        );
        return;
      }
    }

    setIsLoading(true);

    try {
      await cadastrar({
        name: nome,
        email,
        role,
        phone: telefone,
        profession: role === 'Freelancer' ? profession : undefined,
        cnpj: role === 'Contratante' ? cnpj : undefined,
        businessSegment: role === 'Contratante' ? ramoAtuacao : undefined,
        corporateName: role === 'Contratante' ? razaoSocial || nome : undefined,
      });

      if (onCadastroSuccess) {
        onCadastroSuccess();
      } else {
        if (role === 'Contratante') {
          navigate('/contractor/gigs', { replace: true });
        } else {
          navigate('/map', { replace: true });
        }
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
              {role === 'Contratante' ? 'Portal do Estabelecimento' : 'Primeiro Acesso Freelancer'}
            </div>

            <h2 className="text-2xl font-extrabold text-white leading-tight mb-4">
              {role === 'Contratante'
                ? 'Potencialize sua operação com a melhor escala de taxas.'
                : 'Junte-se à maior rede gastronômica de Curitiba.'}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6">
              {role === 'Contratante'
                ? 'Cadastre seu restaurante, bar ou buffet. Publique demandas de taxas em segundos e receba candidatos avaliados com total conformidade.'
                : 'Cadastre-se gratuitamente, informe sua profissão e comece a pegar turnos no radar hoje mesmo.'}
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>
                  {role === 'Contratante'
                    ? 'Garçons e bartenders avaliados com notas de 1 a 5'
                    : 'Escolha seus próprios horários e turnos disponíveis'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>
                  {role === 'Contratante'
                    ? 'Microtraining Speckit: dress code e regras comunicadas'
                    : 'Regras de apresentação e dress code de cada local'}
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle className="w-4 h-4 text-[#00E676] shrink-0 mt-0.5" />
                <span>
                  {role === 'Contratante'
                    ? 'Chat direto, relatórios financeiros e avaliação pós-turno'
                    : 'Receba via PIX imediato após a conclusão do turno'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#00E676]" />
            <span>Cadastro verificado e seguro para gastronomia</span>
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
                NOVA CONTA
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1">
              Criar Conta no TrampoTaxa
            </h1>
            <p className="text-xs text-zinc-400 mb-4">Escolha seu tipo de perfil para continuar:</p>

            {/* Alternar Perfil: Contratante vs Freelancer */}
            <div className="grid grid-cols-2 gap-2 bg-[#171A22] p-1.5 rounded-2xl border border-white/5 mb-5">
              <button
                type="button"
                onClick={() => handleRoleToggle('Contratante')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'Contratante'
                    ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Sou Contratante</span>
              </button>
              <button
                type="button"
                onClick={() => handleRoleToggle('Freelancer')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  role === 'Freelancer'
                    ? 'bg-[#00E676] text-black shadow-[0_0_15px_rgba(0,230,118,0.3)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Sou Freelancer</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              {/* Campos do Contratante */}
              {role === 'Contratante' ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInput
                      label="NOME FANTASIA / ESTABELECIMENTO"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Bistrô do Batel"
                    />
                    <TextInput
                      label="RAZÃO SOCIAL"
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      placeholder="Ex: Bistrô do Batel LTDA"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInput
                      label="CNPJ (COM MÁSCARA)"
                      value={cnpj}
                      onChange={handleCnpjChange}
                      placeholder="00.000.000/0000-00"
                    />
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        RAMO DE ATUAÇÃO
                      </label>
                      <select
                        value={ramoAtuacao}
                        onChange={(e) => setRamoAtuacao(e.target.value)}
                        className="w-full bg-[#171A22] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#00E676] transition-colors"
                      >
                        {BUSINESS_SEGMENTS.map((seg) => (
                          <option key={seg} value={seg} className="bg-[#171A22] text-white">
                            {seg}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInput
                      label="E-MAIL CORPORATIVO"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="financeiro@empresa.com"
                    />
                    <TextInput
                      label="TELEFONE / WHATSAPP"
                      type="tel"
                      value={telefone}
                      onChange={handlePhoneChange}
                      placeholder="(41) 99999-0000"
                    />
                  </div>
                </>
              ) : (
                /* Campos do Freelancer */
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      ESCOLHA SUA FUNÇÃO PRINCIPAL
                    </label>
                    <ProfessionToggle selected={profession} onChange={(p) => setProfession(p)} />
                  </div>

                  <TextInput
                    label="NOME COMPLETO"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Gabriel Silva"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInput
                      label="E-MAIL PESSOAL"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                    />
                    <TextInput
                      label="TELEFONE / WHATSAPP"
                      type="tel"
                      value={telefone}
                      onChange={handlePhoneChange}
                      placeholder="(41) 99999-0000"
                    />
                  </div>
                </>
              )}

              {/* Senhas para ambos os perfis */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput
                  label="SENHA"
                  isPassword
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
                <TextInput
                  label="CONFIRMAÇÃO DE SENHA"
                  isPassword
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a senha"
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
                  Li e concordo com os{' '}
                  <span className="text-white underline font-medium">Termos de Uso</span> e as
                  Políticas do TrampoTaxa.
                </label>
              </div>

              <div className="mt-2">
                <PrimaryButton
                  type="submit"
                  icon={<UserPlus className="w-4 h-4 text-black" />}
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'CRIANDO CONTA...'
                    : role === 'Contratante'
                      ? 'CADASTRAR ESTABELECIMENTO'
                      : 'CONCLUIR CADASTRO FREELANCER'}
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
