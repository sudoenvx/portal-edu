export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const sizeStyles: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'avatar-xs',
  sm: 'avatar-sm',
  md: 'avatar-md',
  lg: 'avatar-lg',
  xl: 'avatar-xl',
}

export function Avatar({ src, alt, name, size = 'md', className = '' }: AvatarProps) {
  const classes = ['avatar', sizeStyles[size], className].filter(Boolean).join(' ')

  if (src) {
    return <img className={classes} src={src} alt={alt ?? name ?? 'avatar'} />
  }

  if (name) {
    return (
      <span className={classes} aria-label={name} role="img">
        {getInitials(name)}
      </span>
    )
  }

  return <span className={[classes, 'avatar-placeholder'].join(' ')} aria-hidden="true" />
}
