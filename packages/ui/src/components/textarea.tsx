import React, { forwardRef, useId } from 'react'
import { cn } from '../utils/cn'

export type TextareaVariant = 'standard' | 'surface' | 'bordered'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  /** 'surface' = bottom-border card look, sits nicely on an off-white page bg (e.g. #edecea).
   *  'outline' = full border, reads better directly on a white surface (cards, modals, white panels). */
  variant?: TextareaVariant
  /** Disable manual resize handle (resize stays vertical by default) */
  resizable?: boolean
  containerClassName?: string
}

const VARIANT_CLASSES: Record<TextareaVariant, string> = {
  standard: cn(
    'rounded-sm bg-transparent ',
    'border border-b-3 border-secondary/50',
    'focus:border-secondary/50 focus:border-b-secondary focus:bg-creamy',
    'placeholder:text-text-muted!',
  ),

  surface: cn(
    'rounded-sm bg-surface ',
    'border border-b-3 border-secondary/0 border-b-secondary/50',
    'focus:border-secondary/60 focus:border-b-secondary focus:bg-blue-ice',
  ),

  bordered: cn(
    'border border-border rounded-sm bg-surface',
    'placeholder:text-text-muted!',
    'focus:border-secondary focus:bg-creamy'
  )
}

const VARIANT_ERROR_CLASSES: Record<TextareaVariant, string> = {
  standard: 'border-danger focus:border-danger bg-danger-tint',
  surface: 'border-danger focus:border-danger bg-danger-tint',
  bordered: 'border-danger focus:border-danger bg-danger-tint',
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    hint,
    error,
    variant = 'standard',
    resizable = false,
    className,
    containerClassName,
    id,
    disabled,
    rows = 4,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const textareaId = id ?? generatedId

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={textareaId} className="text-[11px] font-medium text-text w-fit">
          {label}
        </label>
      )}

      <textarea
        id={textareaId}
        ref={ref}
        disabled={disabled}
        rows={rows}
        aria-invalid={!!error}
        className={cn(
          'w-full text-text placeholder:text-text-muted transition-colors outline-none',
          'text-[12px] px-1.5 py-1.5 leading-relaxed',
          'placeholder:text-muted!',
          VARIANT_CLASSES[variant],
          resizable ? 'resize-y' : 'resize-none',
          error && VARIANT_ERROR_CLASSES[variant],
          disabled && 'opacity-50 cursor-not-allowed bg-secondary/10',
          className,
        )}
        {...props}
      />

      {error ? (
        <p className="text-[11px] text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
})