import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AuditQuestion } from '@/components/audit-question'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { QuestionData } from '@/shared/types'

export type { QuestionData }

interface AuditSectionProps {
  title: string
  questions: QuestionData[]
  startNumber: number
  onQuestionUpdate: (questionId: string, updates: Partial<QuestionData>) => void
}

export function AuditSection ({ title, questions, startNumber, onQuestionUpdate }: AuditSectionProps) {
  const [open, setOpen] = useState(true)
  const answered = questions.filter((q) => q.answer !== null).length
  const total = questions.length
  const isComplete = answered === total && questions.every((q) => q.answer !== 'no' || q.note.trim().length > 0)

  const blockedFromIndex = (() => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      if (q.answer === 'no' && q.note.trim().length === 0) {
        return i + 1
      }
    }
    return -1
  })()

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <button className='flex items-center w-full gap-3 py-3 px-1 group/trigger hover:bg-secondary/50 rounded-md transition-colors'>
          <ChevronDown
            className={cn(
              'size-4 text-muted-foreground transition-transform shrink-0',
              !open && '-rotate-90'
            )}
          />
          <span className='text-xs font-semibold tracking-wide text-primary uppercase'>
            {title}
          </span>
          <div className='ml-auto flex items-center gap-2'>
            <span className={cn(
              'text-xs tabular-nums font-medium',
              isComplete ? 'text-emerald-600' : 'text-muted-foreground'
            )}
            >
              {answered}/{total}
            </span>
            {isComplete && (
              <Check className='size-4 text-emerald-600' />
            )}
          </div>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='divide-y divide-border ml-1'>
          {questions.map((q, i) => (
            <AuditQuestion
              key={q.id}
              number={startNumber + i}
              text={q.text}
              answer={q.answer}
              note={q.note}
              flagged={q.flagged}
              disabled={blockedFromIndex !== -1 && i >= blockedFromIndex}
              onAnswerChange={(value) => onQuestionUpdate(q.id, { answer: value })}
              onNoteChange={(value) => onQuestionUpdate(q.id, { note: value })}
              onFlagToggle={() => onQuestionUpdate(q.id, { flagged: !q.flagged })}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
