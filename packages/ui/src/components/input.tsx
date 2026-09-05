import React, { forwardRef, useId } from 'react'
import { cn } from '../utils/cn'
import { Language, useDetectedLanguage } from '@portal-edu/utils'

export type InputVariant = 'standard' | 'outstanding' | 'bordered'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  hint?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  /** 'surface' = bottom-border card look, sits nicely on an off-white page bg (e.g. #edecea).
   *  'outline' = full border, reads better directly on a white surface (cards, modals, white panels). */
  variant?: InputVariant
  /** Icon rendered at the start (right side in RTL, left side in LTR) */
  leadingIcon?: React.ReactNode
  /** Icon rendered at the end (left side in RTL, right side in LTR) */
  trailingIcon?: React.ReactNode
  containerClassName?: string
}

const SIZE_CLASSES = {
  sm: 'h-6.5 text-[12px] px-2',
  md: 'h-8 text-[12px] px-2',
  lg: 'h-8.5 text-[13px] px-2.5',
}

const VARIANT_CLASSES: Record<InputVariant, string> = {
  standard: cn(
    'rounded-sm bg-surface ',
    'placeholder:text-text-muted!',
  ),
  outstanding: cn(
    'rounded-sm bg-transparent ',
    'border border-b-3 border-secondary/50',
    'focus:border-secondary/50 focus:border-b-secondary focus:bg-creamy',
    'placeholder:text-text-muted!',
  ),

  bordered: cn(
    'border border-secondary/50 rounded-[3px] bg-surface',
    'placeholder:text-text-muted!',
    'focus:border-secondary focus:bg-creamy/80'
  )
}

const VARIANT_ERROR_CLASSES: Record<InputVariant, string> = {
  standard: 'border-danger focus:border-danger',
  outstanding: 'border-danger focus:border-danger',
  bordered: 'border-danger focus:border-danger',
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    error,
    size = 'sm',
    variant = 'standard',
    leadingIcon,
    trailingIcon,
    className,
    containerClassName,
    id,
    disabled,
    ...props
  },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const detectedLanguage = useDetectedLanguage(props.value as string ?? props.placeholder ?? 'en')

  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className={
          cn(
            'text-[11px] font-medium w-fit',
            error ? 'text-danger' : 'text-text',
          )
        }>
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leadingIcon && (
          <span className="absolute inset-s-2 flex items-center text-text-muted pointer-events-none">
            {leadingIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            'w-full text-text placeholder:text-text-muted placeholder:text-[11px] transition-colors outline-none',
            VARIANT_CLASSES[variant],
            SIZE_CLASSES[size],
            !!leadingIcon && 'ps-8',
            !!trailingIcon && 'pe-8',
            error && VARIANT_ERROR_CLASSES[variant],
            disabled && 'opacity-50 cursor-not-allowed bg-secondary/10',
            detectedLanguage == Language.English ? 'font-inter placeholder:font-inter' : 'font-tajwal! placeholder:font-tajwal!',
            className,
          )}
          {...props}
        />

        {trailingIcon && (
          <span className="absolute inset-e-2.5 flex items-center text-text-muted">
            {trailingIcon}
          </span>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[11px] text-text-muted">{hint}</p>
      ) : null}
    </div>
  )
})