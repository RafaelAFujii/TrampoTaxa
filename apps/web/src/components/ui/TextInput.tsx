import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean;
  maskType?: 'phone' | 'none';
  onValueChange?: (val: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  isPassword = false,
  maskType = 'none',
  value,
  onChange,
  onValueChange,
  placeholder,
  className = '',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Apply phone mask: (XX) XXXXX-XXXX
  const formatPhone = (val: string): string => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newVal = e.target.value;
    if (maskType === 'phone') {
      newVal = formatPhone(newVal);
      e.target.value = newVal;
    }
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(newVal);
    }
  };

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5 text-left">
      {label && (
        <label className="text-xs font-semibold text-[#AAB5AE]">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type={inputType}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            w-full bg-[#202421] text-white text-[14px] placeholder-[#AAB5AE] rounded-lg px-4 py-3.5
            border border-[#E7ECE8]/10 transition-colors duration-150
            focus:outline-none focus:border-[#E3B23C] focus:ring-1 focus:ring-[#E3B23C]/40
            hover:border-[#E7ECE8]/20
            ${isPassword ? 'pr-11' : ''}
            ${error ? 'border-red-500/80 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4 text-zinc-400" />
            ) : (
              <Eye className="w-4 h-4 text-zinc-400" />
            )}
          </button>
        )}
      </div>

      {error && <span className="text-xs text-red-400 mt-0.5">{error}</span>}
    </div>
  );
};
