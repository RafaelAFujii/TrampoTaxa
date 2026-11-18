import React from 'react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'neon' | 'dark' | 'ghost' | 'danger';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  icon,
  variant = 'neon',
  fullWidth = true,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative flex items-center justify-center font-bold transition-colors duration-150 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none select-none text-sm';

  const variantStyles = {
    neon: 'bg-[#34745A] hover:bg-[#3F8266] text-[#F7F9F7] font-extrabold rounded-lg py-3.5 px-5 border border-[#34745A]',
    dark: 'bg-[#202421] hover:bg-[#292E2A] text-white border border-[#E7ECE8]/10 rounded-lg py-3.5 px-5',
    ghost: 'bg-transparent hover:bg-[#E7ECE8]/5 text-[#AAB5AE] hover:text-[#F7F9F7] rounded-lg py-3 px-5',
    danger:
      'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg py-4 px-6',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {icon && <span className="text-current">{icon}</span>}
        <span className="uppercase text-[13px] tracking-wider font-extrabold">{children}</span>
      </div>
    </button>
  );
};
