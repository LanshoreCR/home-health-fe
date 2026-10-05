import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { ToolBilling } from '@/shared/types'

interface BillingSectionProps {
  billing: ToolBilling
  isComplete: boolean
  onFlagChange: (flag: boolean) => void
  onCommentsChange: (comments: string) => void
}

export function BillingSection ({ billing, isComplete, onFlagChange, onCommentsChange }: BillingSectionProps): JSX.Element {
  return (
    <div className='mb-5'>
      <div className='flex items-center gap-2'>
        <input
          id='billing-flag'
          type='checkbox'
          checked={billing.flag}
          onChange={(e) => onFlagChange(e.target.checked)}
          className='size-4 accent-primary cursor-pointer'
        />
        <Label htmlFor='billing-flag' className='text-sm font-medium text-card-foreground cursor-pointer'>
          Billing
        </Label>
      </div>
      {billing.flag && (
        <>
          <Textarea
            id='billing-comments'
            value={billing.comments}
            onChange={(e) => onCommentsChange(e.target.value)}
            placeholder='Add billing comments...'
            maxLength={1000}
            aria-invalid={!isComplete}
            className='mt-1.5 min-h-[80px] resize-none bg-card text-sm'
          />
          {!isComplete && (
            <p className='mt-1 text-xs text-destructive'>A billing comment is required to submit.</p>
          )}
        </>
      )}
    </div>
  )
}
