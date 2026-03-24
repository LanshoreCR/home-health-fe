import { ChevronRight, CheckCircle2, Circle, Loader2, MapPin, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'
import type { ToolStatus } from '@/shared/types'
import { getToolTemplateStatusBadgeClass } from '@shared/utils/status-config'
import { getToolStatus } from '@shared/utils/tool-status'

export type { ToolStatus }

const TOOL_STATUS_ICONS: Record<
ToolStatus,
{ Icon: typeof CheckCircle2, className: string }
> = {
  complete: { Icon: CheckCircle2, className: 'size-5 text-emerald-600' },
  'in-progress': { Icon: Loader2, className: 'size-5 text-primary' },
  'not-started': { Icon: Circle, className: 'size-5 text-muted-foreground/40' }
}

const TOOL_STATUS_LABEL_CLASS: Record<ToolStatus, string> = {
  complete: 'text-emerald-600',
  'in-progress': 'text-primary',
  'not-started': 'text-muted-foreground'
}

interface ToolListItemProps {
  auditId: string
  toolId: string
  name: string
  completed: number
  total: number
  locationName?: string
  assignedAuditor?: string
  templateScore?: string
  templateStatus?: string
}

export function ToolListItem ({
  auditId,
  toolId,
  name,
  completed,
  total,
  locationName,
  assignedAuditor,
  templateScore,
  templateStatus
}: ToolListItemProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const status: ToolStatus = getToolStatus(completed, total)
  const { Icon, className: iconClass } = TOOL_STATUS_ICONS[status]
  const scoreLabel = templateScore ?? `${percent}%`

  return (
    <Link
      to={`/audit/${auditId}/tool/${toolId}`}
      className='group flex items-start gap-4 px-4 py-3.5 rounded-lg border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
    >
      <div className='shrink-0 pt-0.5'>
        <Icon className={iconClass} />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-start gap-2 min-w-0'>
          <p className='text-sm font-medium text-card-foreground group-hover:text-primary transition-colors truncate min-w-0'>
            {name}
          </p>
          {templateStatus !== undefined && templateStatus !== '' && (
            <Badge
              variant='outline'
              className={cn('shrink-0 text-xs max-w-[min(100%,12rem)] truncate', getToolTemplateStatusBadgeClass(templateStatus))}
            >
              {templateStatus}
            </Badge>
          )}
        </div>
        {(locationName !== undefined && locationName !== '') && (
          <p className='flex items-center gap-1.5 text-xs text-muted-foreground truncate mt-1 min-w-0' title={locationName}>
            <MapPin className='size-3.5 shrink-0 text-muted-foreground/80' aria-hidden />
            <span className='truncate'>{locationName}</span>
          </p>
        )}
        {(assignedAuditor !== undefined && assignedAuditor !== '') && (
          <p className='flex items-center gap-1.5 text-xs text-muted-foreground truncate min-w-0' title={assignedAuditor}>
            <User className='size-3.5 shrink-0 text-muted-foreground/80' aria-hidden />
            <span className='truncate'>{assignedAuditor}</span>
          </p>
        )}
        <div className='flex items-center gap-3 mt-1.5'>
          <Progress value={percent} className='flex-1 max-w-48 h-1.5' />
          <span className='text-xs text-muted-foreground tabular-nums shrink-0'>
            {completed}/{total} questions
          </span>
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0 pt-0.5'>
        <span className={cn('text-xs font-semibold tabular-nums', TOOL_STATUS_LABEL_CLASS[status])}>
          {scoreLabel}
        </span>
        <ChevronRight className='size-4 text-muted-foreground/40 group-hover:text-primary transition-colors' />
      </div>
    </Link>
  )
}
