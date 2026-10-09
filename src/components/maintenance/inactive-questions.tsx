import { useMemo, useState } from 'react'
import { ChevronDown, Eye, History, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import type { MaintenanceQuestion } from '@shared/types'

interface InactiveQuestionsProps {
  questions: MaintenanceQuestion[]
  editable: boolean
  onActivate: (question: MaintenanceQuestion) => void
  onShowHistory: (question: MaintenanceQuestion) => void
}

export function InactiveQuestions ({ questions, editable, onActivate, onShowHistory }: InactiveQuestionsProps): JSX.Element | null {
  const [search, setSearch] = useState('')
  const hasRemovedInDraft = questions.some((q) => q.isRemoved)
  const [open, setOpen] = useState(hasRemovedInDraft)

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (term === '') return questions
    return questions.filter((q) =>
      q.questionText.toLowerCase().includes(term) || (q.gTag ?? '').toLowerCase().includes(term))
  }, [questions, search])

  if (questions.length === 0) return null

  return (
    <Collapsible open={open} onOpenChange={setOpen} className='mt-8'>
      <CollapsibleTrigger className='flex w-full items-center justify-between rounded-md py-2 text-sm font-medium text-card-foreground'>
        <span>Inactive questions <span className='text-muted-foreground font-normal'>({questions.length})</span></span>
        <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className='relative mb-3 mt-1'>
          <Search className='absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Search inactive questions...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-8 bg-background pl-8 text-xs'
          />
        </div>
        <ul className='flex flex-col gap-2'>
          {visible.map((question) => (
            <li key={question.questionID} className='flex items-start gap-2 rounded-lg border border-dashed border-border bg-muted/30 px-3 py-2.5'>
              <div className='min-w-0 flex-1'>
                <p className='text-sm text-muted-foreground whitespace-pre-wrap'>{question.questionText}</p>
                <div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
                  {question.gTag != null && question.gTag !== '' && (
                    <Badge variant='outline' className='font-mono text-[11px]'>{question.gTag}</Badge>
                  )}
                  {question.isRemoved && (
                    <Badge variant='outline' className='border-red-200 bg-red-50 text-red-700'>Removed in draft</Badge>
                  )}
                  {question.lastVersionNumber != null && (
                    <span className='text-[11px] text-muted-foreground'>Last in v{question.lastVersionNumber}</span>
                  )}
                </div>
              </div>
              <div className='flex shrink-0 items-center gap-1'>
                <Button variant='ghost' size='icon' className='size-7 text-muted-foreground' aria-label='History' onClick={() => onShowHistory(question)}>
                  <History className='size-3.5' />
                </Button>
                {editable && (
                  <Button variant='outline' size='sm' className='h-7 text-xs' onClick={() => onActivate(question)}>
                    <Eye className='mr-1 size-3.5' />
                    Activate
                  </Button>
                )}
              </div>
            </li>
          ))}
          {visible.length === 0 && (
            <li className='py-4 text-center text-xs text-muted-foreground'>No inactive questions match your search.</li>
          )}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  )
}
