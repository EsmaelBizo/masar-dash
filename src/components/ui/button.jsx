import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

export const buttonVariants = cva(
  'relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-xl border border-transparent min-h-[42px] px-4 py-2 font-bold text-[12px] whitespace-nowrap transition-all duration-300 ease-[var(--ease-masar-out)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98] disabled:opacity-55 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-l from-[#C88A32] to-[#AE7422] text-white shadow-lg shadow-[#C88A32]/20 hover:brightness-110',
        navy:
          'bg-[#163A5F] text-white shadow-lg shadow-[#163A5F]/20 hover:bg-[#1E4E8C]',
        teal:
          'bg-[#2E6F5E] text-white shadow-lg shadow-[#2E6F5E]/20 hover:bg-[#235749]',
        danger:
          'bg-danger text-white shadow-lg shadow-[#B83B3B]/20 hover:opacity-90',
        softDanger:
          'bg-soft-danger text-danger border-danger/25 hover:bg-danger hover:text-white',
        softTeal:
          'bg-soft-teal text-secondary border-secondary/25 hover:bg-secondary hover:text-white',
        softGold:
          'bg-soft-gold text-accent border-[#C88A32]/30 hover:bg-[#C88A32] hover:text-white',
        dark: 'bg-dark text-white hover:bg-primary-deep',
        outline:
          'bg-surface/80 text-text border-border hover:border-[#C88A32]/60 hover:text-accent',
        subtle: 'bg-surface-alt text-text border-border/50 hover:bg-soft-gold',
        white: 'bg-white text-navy hover:bg-soft-gold',
        quiet:
          'bg-transparent border-0 text-accent text-[12px] font-bold min-h-0 p-0 hover:translate-y-0 hover:underline',
        icon: 'inline-grid place-items-center flex-none border border-border rounded-xl size-10 min-h-0 p-0 text-text bg-surface/70 transition-all duration-250 hover:border-[#C88A32] hover:text-accent hover:translate-y-0',
      },
      size: {
        default: '',
        sm: 'min-h-[38px] px-3.5 py-2 text-[12px] rounded-xl',
        xs: 'min-h-[30px] px-2.5 py-1 text-[11px] rounded-lg gap-1.5',
        square: 'w-[42px] p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      fullWidth: false,
    },
  }
);

export function Button({
  className,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  type = 'button',
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
