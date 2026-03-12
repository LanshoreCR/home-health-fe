import { Download, CheckCircle2, XCircle, ChevronRight, CalendarDays, Hash, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import type { Audit } from '@/shared/types'
import { PACKAGE_STATUS_MAP } from '@shared/utils/status-config'

function formatDate (isoString: string): string {
  return isoString.slice(0, 10)
}

export function AuditCard ({
  packageID,
  packageName,
  packageStatus,
  edNumber,
  startDate,
  endDate,
  packageScore
}: Audit) {
  const statusConfig = PACKAGE_STATUS_MAP[packageStatus] ?? { label: 'Unknown', className: '' }

  return (
    <div className='group relative flex items-center gap-0 rounded-lg border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm'>
      <Link
        to={`/audit/${packageID}`}
        className='flex-1 min-w-0 flex items-center gap-4 p-4 pr-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-l-lg'
      >
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2.5 mb-1'>
            <h3 className='font-semibold text-card-foreground text-sm leading-snug tracking-tight truncate'>
              {packageName}
            </h3>
            <Badge variant='outline' className={`${statusConfig.className} shrink-0 text-[11px] px-1.5 py-0`}>
              {statusConfig.label}
            </Badge>
          </div>

          <div className='flex items-center gap-3 mt-1.5 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-1'>
              <Hash className='size-3 shrink-0' />
              <span className='truncate'>{edNumber}</span>
            </span>
            <span className='inline-flex items-center gap-1'>
              <CalendarDays className='size-3 shrink-0' />
              {formatDate(startDate)} – {formatDate(endDate)}
            </span>
            <span className='inline-flex items-center gap-1'>
              <TrendingUp className='size-3 shrink-0' />
              {packageScore}
            </span>
          </div>
        </div>

        <ChevronRight className='size-4 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors mr-2' />
      </Link>

      <div className='flex items-center gap-0.5 border-l border-border px-2 py-4 shrink-0'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50'
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              <CheckCircle2 className='size-4' />
              <span className='sr-only'>Approve</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Approve</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-red-600 hover:bg-red-50'
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              <XCircle className='size-4' />
              <span className='sr-only'>Reject</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Reject</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-card-foreground'
              onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
            >
              <Download className='size-4' />
              <span className='sr-only'>Export CSV</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Export CSV</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}
