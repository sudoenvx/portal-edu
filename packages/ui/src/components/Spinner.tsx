export type SpinnerSize = 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'spinner-sm',
  md: 'spinner-md',
  lg: 'spinner-lg',
}

export function Spinner({ size = 'md', className = '', label = 'Loading...' }: SpinnerProps) {
  return (
    <span
      className={['spinner', sizeStyles[size], className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </span>
  )
}
