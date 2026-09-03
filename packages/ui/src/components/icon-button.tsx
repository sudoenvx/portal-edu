import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../utils/cn'

type IconButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'ghost'
type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  variant?: IconButtonVariant
  size?: IconButtonSize
  loading?: boolean
  disabled?: boolean
  title?: string
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'bg-primary/20 hover:bg-primary/30 text-text',
  secondary: 'bg-secondary/20 hover:bg-secondary/30 text-text',
  danger: 'bg-danger/20 hover:bg-danger/30 text-text',
  success: 'bg-success/20 hover:bg-success/30 text-text',
  ghost: 'bg-transparent hover:bg-secondary/20 text-text',
}

const disabledClasses = 'bg-secondary/15 text-text-muted cursor-not-allowed hover:bg-secondary/15'

const sizeClasses: Record<IconButtonSize, string> = {
  xs: 'w-5 h-5',
  sm: 'w-6 h-6',
  md: 'w-7 h-7',
  lg: 'w-8 h-8',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'secondary',
      size = 'sm',
      loading = false,
      disabled = false,
      className,
      title,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        title={title}
        className={cn(
          'inline-flex items-center justify-center rounded-xs transition-colors',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
          sizeClasses[size],
          isDisabled ? disabledClasses : variantClasses[variant],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className={cn(
            'animate-spin',
            size === 'xs' && 'w-2.5 h-2.5',
            size === 'sm' && 'w-3 h-3',
            size === 'md' && 'w-3.5 h-3.5',
            size === 'lg' && 'w-4 h-4',
          )} />
        ) : (
          <span className={cn(
            'flex items-center justify-center',
            size === 'xs' && '[&>svg]:w-3 [&>svg]:h-3',
            size === 'sm' && '[&>svg]:w-3.5 [&>svg]:h-3.5',
            size === 'md' && '[&>svg]:w-4 [&>svg]:h-4',
            size === 'lg' && '[&>svg]:w-4.5 [&>svg]:h-4',
          )}>
            {icon}
          </span>
        )}
      </button>
    )
  },
)

IconButton.displayName = 'IconButton'
