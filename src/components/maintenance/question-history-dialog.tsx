import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { getQuestionHistory } from '@shared/services/api/endpoints/maintenance'
import type { MaintenanceQuestion, QuestionHistoryEntry } from '@shared/types'
import { formatVersionDate, hasSection } from './format'

interface QuestionHistoryDialogProps {
  question: MaintenanceQuestion | null
  onOpenChange: (open: boolean) => void
}

const CHANGE_CLASS: Record<string, string> = {
  Added: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Reactivated: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Deactivated: 'border-red-200 bg-red-50 text-red-700'
}

function HistoryEntry ({ entry }: { entry: QuestionHistoryEntry }): JSX.Element {
  const versionLabel = entry.isDraft
    ? `v${entry.versionNumber} · Draft`
    : `v${entry.versionNumber} · ${formatVersionDate(entry.publishedOn)}${entry.publishedByName != null ? ` · ${entry.publishedByName}` : ''}`

  return (
    <li className='relative pl-5 pb-5 last:pb-0 border-l border-border ml-1.5'>
      <span className='absolute -left-[5px] top-1 size-2.5 rounded-full bg-primary' />
      <div className='flex flex-wrap items-center gap-1.5 mb-1.5'>
        <span className='text-xs font-medium text-card-foreground'>{versionLabel}</span>
        {entry.changes.map((change) => (
          <Badge key={change} variant='outline' className={CHANGE_CLASS[change] ?? ''}>{change}</Badge>
        ))}
      </div>
      {entry.isInVersion && (
        <div className='rounded-md border border-border bg-muted/40 p-2.5'>
          <p className='text-sm text-card-foreground whitespace-pre-wrap'>{entry.questionText}</p>
          <p className='mt-1.5 text-xs text-muted-foreground'>
            {[
              entry.questionSort != null ? `#${entry.questionSort}` : null,
              entry.gTag != null && entry.gTag !== '' ? `G-Tag ${entry.gTag}` : null,
              hasSection(entry.categ) ? entry.categ : null
            ].filter(Boolean).join(' · ')}
          </p>
        </div>
      )}
    </li>
  )
}

export function QuestionHistoryDialog ({ question, onOpenChange }: QuestionHistoryDialogProps): JSX.Element {
  const [entries, setEntries] = useState<QuestionHistoryEntry[] | null>(null)

  useEffect(() => {
    if (question == null) return
    setEntries(null)
    getQuestionHistory(question.questionID)
      .then((data) => setEntries([...data].reverse()))
      .catch(() => setEntries([]))
  }, [question])

  return (
    <Dialog open={question != null} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Question history</DialogTitle>
          <DialogDescription className='line-clamp-2'>{question?.questionText}</DialogDescription>
        </DialogHeader>
        {entries == null && (
          <div className='flex justify-center py-8'><Loader2 className='size-5 animate-spin text-muted-foreground' /></div>
        )}
        {entries != null && entries.length === 0 && (
          <p className='py-6 text-center text-sm text-muted-foreground'>No history for this question.</p>
        )}
        {entries != null && entries.length > 0 && (
          <ol className='pt-1'>
            {entries.map((entry) => <HistoryEntry key={entry.versionNumber} entry={entry} />)}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  )
}
