import * as React from 'react'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

function formatIsoToDisplay (iso: string): string {
  if (!iso) return ''
  const normalized = iso.includes('T') ? iso.split('T')[0] : iso
  const [y, m, d] = normalized.split('-')
  if (!y || !m || !d) return ''
  return `${m}/${d}/${y.slice(-2)}`
}

interface DateInputProps extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

function DateInput ({ className, value = '', onChange, id, ...props }: DateInputProps) {
  const hiddenRef = useRef<HTMLInputElement>(null)
  const normalizedValue = value.includes('T') ? value.split('T')[0] : value

  return (
    <div className='relative'>
      <button
        type='button'
        id={id}
        className={cn(
          'flex items-center justify-between w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
          'border-input',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        onClick={() => {
          hiddenRef.current?.showPicker()
        }}
      >
        <span className={cn(!value && 'text-muted-foreground')}>
          {normalizedValue ? formatIsoToDisplay(normalizedValue) : 'mm/dd/yy'}
        </span>
        <svg className='size-4 text-muted-foreground shrink-0' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
          <line x1='16' y1='2' x2='16' y2='6' />
          <line x1='8' y1='2' x2='8' y2='6' />
          <line x1='3' y1='10' x2='21' y2='10' />
        </svg>
      </button>
      <input
        ref={hiddenRef}
        type='date'
        value={normalizedValue}
        onChange={(e) => onChange?.(e.target.value)}
        className='sr-only'
        tabIndex={-1}
        aria-hidden
        {...props}
      />
    </div>
  )
}

export { DateInput }
