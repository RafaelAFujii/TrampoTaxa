/**
 * Utilitários de formatação e máscaras para TrampoTaxa
 */

/**
 * Aplica máscara de CNPJ (00.000.000/0000-00)
 */
export const formatCNPJ = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

/**
 * Validador rigoroso do algoritmo de dígitos verificadores do CNPJ
 */
export const isValidCNPJ = (cnpj: string): boolean => {
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return false;
  
  // Elimina sequências conhecidas de dígitos iguais
  if (/^(\d)\1{13}$/.test(clean)) return false;

  // Validação do 1º dígito verificador
  let length = 12;
  let numbers = clean.substring(0, length);
  let digits = clean.substring(length);
  let sum = 0;
  let pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) return false;

  // Validação do 2º dígito verificador
  length = 13;
  numbers = clean.substring(0, length);
  sum = 0;
  pos = length - 7;
  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1), 10);
};

/**
 * Aplica máscara de telefone / celular com DDD: (41) 99999-9999
 */
export const formatPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
};

/**
 * Converte valor numérico em moeda formatada BRL: R$ 250,00
 */
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(val);
};

/**
 * Formata input de texto para moeda brasileira em tempo real
 */
export const formatCurrencyInput = (value: string): { raw: number; formatted: string } => {
  const digits = value.replace(/\D/g, '');
  const raw = Number(digits) / 100;
  const formatted = formatCurrency(raw);
  return { raw, formatted };
};
