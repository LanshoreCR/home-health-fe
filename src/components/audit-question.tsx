import { Flag, AlertCircle, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { AnswerValue } from '@/shared/types'

export type { AnswerValue }

const ANSWER_ACTIVE_STYLES: Record<Exclude<AnswerValue, null>, string> = {
  yes: 'bg-emerald-600 text-white',
  no: 'bg-red-600 text-white',
  na: 'bg-foreground text-background'
}

const ANSWER_INACTIVE_STYLE = 'bg-card text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'

const TOGGLE_ACTIVE_STYLE = 'text-amber-700 bg-amber-50'
const TOGGLE_INACTIVE_STYLE = 'text-muted-foreground hover:text-card-foreground'

const answerOptions: Array<{ value: AnswerValue, label: string }> = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'na', label: 'N/A' }
]

interface AuditQuestionProps {
  number: number
  text: string
  answer: AnswerValue
  note: string
  flagged: boolean
  billing: boolean
  billingNote: string
  disabled?: boolean
  onAnswerChange: (value: AnswerValue) => void
  onNoteChange: (value: string) => void
  onFlagToggle: () => void
  onBillingToggle: () => void
  onBillingNoteChange: (value: string) => void
}

export function AuditQuestion ({
  number,
  text,
  answer,
  note,
  flagged,
  billing,
  billingNote,
  disabled = false,
  onAnswerChange,
  onNoteChange,
  onFlagToggle,
  onBillingToggle,
  onBillingNoteChange
}: AuditQuestionProps) {
  const requiresNote = answer === 'no' && note.trim().length === 0
  const requiresBillingNote = billing && billingNote.trim().length === 0

  return (
    <div
      className={cn(
        'py-5 group/question transition-opacity',
        disabled && 'opacity-40 pointer-events-none select-none'
      )}
      aria-disabled={disabled}
    >
      <div className='flex gap-3'>
        <span className='text-xs font-semibold text-muted-foreground tabular-nums shrink-0 pt-0.5 w-6 text-right'>
          {number}.
        </span>

        <div className='flex-1 min-w-0'>
          <p className='text-sm text-card-foreground leading-relaxed mb-3'>
            {text}
          </p>

          <div className='flex items-center justify-between flex-wrap gap-3 mb-3'>
            <div className='inline-flex rounded-lg border border-border overflow-hidden' role='radiogroup'>
              {answerOptions.map(({ value, label }) => (
                <button
                  key={value}
                  role='radio'
                  aria-checked={answer === value}
                  disabled={disabled}
                  onClick={() => { if (answer !== value) onAnswerChange(value) }}
                  className={cn(
                    'px-4 py-2 text-sm font-medium transition-colors border-r border-border last:border-r-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                    answer === value && value !== null
                      ? ANSWER_ACTIVE_STYLES[value]
                      : ANSWER_INACTIVE_STYLE
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className='flex items-center gap-1'>
              <Button
                variant='ghost'
                size='sm'
                disabled={disabled}
                aria-pressed={billing}
                className={cn('h-8 px-2 text-xs', billing ? TOGGLE_ACTIVE_STYLE : TOGGLE_INACTIVE_STYLE)}
                onClick={onBillingToggle}
              >
                <Receipt className='size-3.5 mr-1' />
                Billing
              </Button>
              <Button
                variant='ghost'
                size='sm'
                disabled={disabled}
                className={cn('h-8 px-2 text-xs', flagged ? TOGGLE_ACTIVE_STYLE : TOGGLE_INACTIVE_STYLE)}
                onClick={onFlagToggle}
              >
                <Flag className={cn('size-3.5 mr-1', flagged && 'fill-current')} />
                {flagged ? 'Flagged' : 'Flag'}
              </Button>
            </div>
          </div>

          <div className='relative'>
            <Textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              disabled={disabled}
              placeholder={
                answer === 'no'
                  ? "Required: explain the reason for 'No'..."
                  : 'Add a note (optional)...'
              }
              className={cn(
                'min-h-[56px] text-sm bg-background resize-none transition-colors',
                requiresNote &&
                  'border-red-400 bg-red-50/50 focus-visible:ring-red-400 placeholder:text-red-400/70'
              )}
            />
            {requiresNote && (
              <div className='flex items-center gap-1.5 mt-1.5'>
                <AlertCircle className='size-3 text-red-600 shrink-0' />
                <span className='text-xs text-red-600'>
                  A comment is required when the answer is No
                </span>
              </div>
            )}
          </div>

          {billing && (
            <div className='mt-2'>
              <Textarea
                value={billingNote}
                onChange={(e) => onBillingNoteChange(e.target.value)}
                disabled={disabled}
                maxLength={1000}
                aria-label='Billing comment'
                placeholder='Required: billing comment...'
                className={cn(
                  'min-h-[56px] text-sm bg-background resize-none transition-colors',
                  requiresBillingNote &&
                    'border-red-400 bg-red-50/50 focus-visible:ring-red-400 placeholder:text-red-400/70'
                )}
              />
              {requiresBillingNote && (
                <div className='flex items-center gap-1.5 mt-1.5'>
                  <AlertCircle className='size-3 text-red-600 shrink-0' />
                  <span className='text-xs text-red-600'>
                    A billing comment is required to submit
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
