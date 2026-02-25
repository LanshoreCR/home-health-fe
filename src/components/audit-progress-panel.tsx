import { CheckCircle2, Circle, Flag, MessageSquare, ListChecks } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import type { QuestionData, QuestionFilter } from '@/shared/types'

interface AuditProgressPanelProps {
  sections: Array<{ title: string, questions: QuestionData[] }>
  activeFilter: QuestionFilter
  onFilterChange: (filter: QuestionFilter) => void
}

export function AuditProgressPanel ({ sections, activeFilter, onFilterChange }: AuditProgressPanelProps) {
  const allQuestions = sections.flatMap((s) => s.questions)
  const total = allQuestions.length
  const completed = allQuestions.filter((q) => q.answer !== null).length
  const incomplete = total - completed
  const flagged = allQuestions.filter((q) => q.flagged).length
  const withNotes = allQuestions.filter((q) => q.note.length > 0).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0

  const stats: Array<{ key: QuestionFilter, label: string, count: number, icon: typeof ListChecks, color: string }> = [
    { key: null, label: 'All questions', count: total, icon: ListChecks, color: 'text-card-foreground' },
    { key: 'complete', label: 'Completed', count: completed, icon: CheckCircle2, color: 'text-emerald-600' },
    { key: 'incomplete', label: 'Incomplete', count: incomplete, icon: Circle, color: 'text-red-600' },
    { key: 'flagged', label: 'Flagged', count: flagged, icon: Flag, color: 'text-amber-600' },
    { key: 'notes', label: 'With notes', count: withNotes, icon: MessageSquare, color: 'text-primary' }
  ]

  return (
    <div className='bg-card rounded-lg border border-border p-5 sticky top-6'>
      <div className='mb-5'>
        <div className='flex items-baseline justify-between mb-2'>
          <span className='text-sm font-semibold text-card-foreground'>Progress</span>
          <span className='text-2xl font-bold text-card-foreground tabular-nums'>{percent}%</span>
        </div>
        <Progress value={percent} className='h-2' />
        <p className='text-xs text-muted-foreground mt-1.5'>
          {completed} of {total} questions answered
        </p>
      </div>

      <div className='space-y-1'>
        {stats.map(({ key, label, count, icon: Icon, color }) => (
          <button
            key={label}
            onClick={() => onFilterChange(activeFilter === key ? null : key)}
            className={cn(
              'flex items-center w-full gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              activeFilter === key
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-secondary text-card-foreground'
            )}
          >
            <Icon className={cn('size-4 shrink-0', activeFilter === key ? 'text-primary' : color)} />
            <span className='flex-1 text-left'>{label}</span>
            <span className={cn(
              'tabular-nums font-semibold text-xs',
              activeFilter === key ? 'text-primary' : color
            )}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      <div className='mt-5 pt-5 border-t border-border'>
        <p className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
          Sections
        </p>
        <div className='space-y-2.5'>
          {sections.map((section) => {
            const sAnswered = section.questions.filter((q) => q.answer !== null).length
            const sTotal = section.questions.length
            const sPercent = sTotal > 0 ? Math.round((sAnswered / sTotal) * 100) : 0
            const sDone = sAnswered === sTotal

            return (
              <div key={section.title}>
                <div className='flex items-center justify-between mb-1'>
                  <span className='text-xs text-card-foreground truncate pr-2'>{section.title}</span>
                  <span className={cn(
                    'text-xs tabular-nums font-medium shrink-0',
                    sDone ? 'text-emerald-600' : 'text-muted-foreground'
                  )}
                  >
                    {sAnswered}/{sTotal}
                  </span>
                </div>
                <Progress value={sPercent} className='h-1' />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
