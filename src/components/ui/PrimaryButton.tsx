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
  const baseStyles = 'relative flex items-center justify-center font-bold tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none text-sm';
  
  const variantStyles = {
    neon: 'bg-[#00E676] hover:bg-[#00FF77] text-black font-extrabold shadow-[0_4px_20px_rgba(0,230,118,0.35)] hover:shadow-[0_6px_28px_rgba(0,230,118,0.5)] rounded-2xl py-4 px-6 border border-[#52ff9e]/40',
    dark: 'bg-[#1C1C1E] hover:bg-[#252528] text-white border border-white/10 rounded-2xl py-4 px-6 shadow-sm',
    ghost: 'bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white rounded-2xl py-3 px-6',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-2xl py-4 px-6'
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
