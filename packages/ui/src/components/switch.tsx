// Switch.tsx
import { useId } from 'react'
import { Card } from './card'

type SwitchProps = {
  checked:         boolean
  onCheckedChange: (v: boolean) => void
  size?:           'sm' | 'md'
  disabled?:       boolean
  className?:      string
}

export function Switch({
  checked,
  onCheckedChange,
  size      = 'md',
  disabled,
  className,
}: SwitchProps) {
  const id = useId()

  const trackSize = size === 'sm'
    ? 'w-7.5 h-4.5'
    : 'w-9 h-5'

  const thumbSize = size === 'sm'
    ? 'w-[12px] h-[12px] top-[3px] left-[3px] data-[on=true]:translate-x-4'
    : 'w-[14px] h-[14px] top-[3px] left-[3px] data-[on=true]:translate-x-4'

  return (
    <label
      htmlFor={id}
      className={`
        inline-flex items-center cursor-pointer select-none
        ${disabled ? 'opacity-45 pointer-events-none' : ''}
        ${className ?? ''}
      `}
    >
      {/* track */}
      <div className={`
        relative ${trackSize} rounded-[10px] shrink-0
        transition-colors duration-150
        ${checked ? 'bg-primary' : 'bg-[#a3a4a7]'}
      `}>
        {/* thumb */}
        <div className={`
          absolute ${thumbSize} bg-white rounded-full
          transition-transform duration-150
          ${checked
            ? size === 'sm' ? 'translate-x-3' : 'translate-x-4'
            : 'translate-x-0'}
        `} />
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-checked={checked}
          checked={checked}
          disabled={disabled}
          onChange={e => onCheckedChange(e.target.checked)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
      </div>
    </label>
  )
}

type SwitchTileProps = {
  checked:         boolean
  onCheckedChange: (v: boolean) => void
  label:           string
  description?:    string
  size?:           'sm' | 'md'
  disabled?:       boolean
  className?:      string
}

export function SwitchTile({
  checked,
  onCheckedChange,
  label,
  description,
  size = 'sm',
  disabled,
  className,
}: SwitchTileProps) {
  return (
    <Card className={`
       cursor-pointer select-none
       ${disabled ? 'opacity-45 pointer-events-none' : ''}
       ${className ?? ''}
       border! border-border  hover:bg-creamy hover:border-secondary transition-colors duration-150 rounded!
    `} onClick={() => onCheckedChange(!checked)} bodyClassName='p-1.5!'>
      <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
          <span className="text-[12px] text-text/90 leading-tight font-semibold">{label}</span>
          {description && <span className="text-[11px] max-w-sm text-text-muted ">{description}</span>}
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          size={size}
          disabled={disabled}
        />
      </div>
    </Card>
  )
}
