import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { EyeOff, GripVertical, History, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { MaintenanceQuestion } from '@shared/types'
import { hasSection } from './format'

interface QuestionRowProps {
  question: MaintenanceQuestion
  editable: boolean
  onEdit: () => void
  onDeactivate: () => void
  onShowHistory: () => void
}

function IconAction ({ label, onClick, children }: { label: string, onClick: () => void, children: React.ReactNode }): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='ghost' size='icon' className='size-7 text-muted-foreground' aria-label={label} onClick={onClick}>
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function QuestionRow ({ question, editable, onEdit, onDeactivate, onShowHistory }: QuestionRowProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.questionID,
    disabled: !editable
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        'flex items-start gap-2 rounded-lg border border-border bg-card px-2 py-2.5',
        isDragging && 'relative z-10 shadow-md ring-1 ring-primary/30'
      )}
    >
      {editable && (
        <button
          type='button'
          className='mt-0.5 cursor-grab touch-none rounded p-0.5 text-muted-foreground hover:bg-muted active:cursor-grabbing'
          aria-label='Drag to reorder'
          {...attributes}
          {...listeners}
        >
          <GripVertical className='size-4' />
        </button>
      )}
      <span className='mt-0.5 w-6 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground'>
        {question.questionSort}.
      </span>
      <div className='min-w-0 flex-1'>
        <p className='text-sm text-card-foreground whitespace-pre-wrap'>{question.questionText}</p>
        <div className='mt-1.5 flex flex-wrap items-center gap-1.5'>
          {question.gTag != null && question.gTag !== '' && (
            <Badge variant='outline' className='font-mono text-[11px]'>{question.gTag}</Badge>
          )}
          {hasSection(question.categ) && <Badge variant='secondary'>{question.categ}</Badge>}
          {question.isNew && (
            <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700'>
              {question.lastVersionNumber == null ? 'New' : 'Reactivated'}
            </Badge>
          )}
          {question.isEdited && <Badge variant='outline' className='border-amber-200 bg-amber-50 text-amber-700'>Edited</Badge>}
        </div>
      </div>
      <div className='flex shrink-0 items-center'>
        <IconAction label='History' onClick={onShowHistory}><History className='size-3.5' /></IconAction>
        {editable && <IconAction label='Edit' onClick={onEdit}><Pencil className='size-3.5' /></IconAction>}
        {editable && <IconAction label='Deactivate' onClick={onDeactivate}><EyeOff className='size-3.5' /></IconAction>}
      </div>
    </li>
  )
}
