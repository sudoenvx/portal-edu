// components/ui/Button.tsx
import { Loader2 } from 'lucide-react'
import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'neutral'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  outline?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode

  tint?: boolean
}

// Solid variant classes
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-text hover:bg-primary-dark hover:border-primary-dark',
  secondary:
    'bg-secondary text-secondary-text  hover:bg-secondary-dark hover:border-secondary-dark',
  accent: 'bg-accent text-accent-text hover:bg-accent-dark hover:border-accent-dark',
  ghost: 'bg-transparent text-text hover:bg-[#d9d9d9] hover:text-text',
  danger: 'bg-danger text-danger-text hover:bg-danger-hover hover:border-danger-hover',
  neutral: 'bg-surface text-text hover:bg-surface/90 hover:text-text'
}

const tintVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-tint text-primary-tint-text hover:bg-primary-tint/80 font-medium',
  secondary:
    'bg-secondary/20 text-secondary-tint-text hover:bg-secondary/30',
  accent: 'bg-creamy-muted text-text hover:bg-accent hover:text-accent-text',
  ghost:
    'bg-transparent text-text  hover:bg-[#E7E5DF] hover:text-text',
  danger: 'bg-danger-tint text-danger-tint-text hover:bg-danger hover:text-danger-text',
  neutral:
    'bg-transparent text-text border border-border-strong hover:bg-[#edf0f2] hover:text-text'
}

// Outline variant classes — transparent bg, colored border + text
const outlineVariantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-transparent text-primary border border-primary hover:bg-primary hover:text-primary-text',
  secondary:
    'bg-transparent text-secondary border border-secondary hover:bg-secondary hover:text-secondary-text',
  accent: 'bg-transparent text-accent border border-accent hover:bg-accent hover:text-accent-text',
  ghost:
    'bg-transparent text-text border border-border hover:bg-[#E7E5DF] hover:text-text',
  danger:
    'bg-transparent text-danger hover:bg-danger hover:text-danger-text',
  neutral:
    'bg-transparent hover:bg-blue-ice text-text border border-border-strong hover:bg-surface-raised hover:text-text'
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2 text-[10px] h-5.5 font-normal',
  sm: 'px-3 text-[11px] h-6.5',
  md: 'px-3 text-[12px] h-7.5',
  lg: 'px-4 text-[14px] h-9'
}

const spinnerSizeClasses: Record<ButtonSize, string> = {
  xs: 'w-2.5 h-2.5',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'sm',
      loading = false,
      outline = false,
      disabled = false,
      leftIcon,
      rightIcon,
      tint,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading
    const resolvedVariant = outline
      ? outlineVariantClasses[variant]
      : tint
        ? tintVariantClasses[variant]
        : variantClasses[variant]

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          'inline-flex items-center gap-1.5 w-fit rounded-sm select-none',
          'focus-visible:outline-black focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:rounded-none',
          'font-[inherit] font-medium uppercase',
          'transition-colors duration-200',
          'cursor-pointer',
          'disabled:opacity-45 disabled:cursor-not-allowed',
          resolvedVariant,
          sizeClasses[size],
          className
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <Loader2 className={`animate-spin ${spinnerSizeClasses[size]}`} />
        ) : leftIcon ? (
          <span className="shrink-0 inline-flex items-center [&>svg]:w-[1.2em] [&>svg]:h-[1.2em]">
            {leftIcon}
          </span>
        ) : null}

        {children && <span className={loading ? 'opacity-70' : undefined}>{children}</span>}

        {!loading && rightIcon && (
          <span className="shrink-0 inline-flex items-center [&>svg]:w-[1.2em] [&>svg]:h-[1.2em]">
            {rightIcon}
          </span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
