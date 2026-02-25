import { Download, Paperclip, CheckCircle2, XCircle, ChevronRight, MapPin, CalendarDays, User, ClipboardList } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import type { AuditStatus } from '@/shared/types'
import { STATUS_CONFIG } from '@shared/utils/status-config'

export type { AuditStatus }

interface AuditCardProps {
  id: string
  title: string
  location: string
  quarter: string
  auditor: string
  status: AuditStatus
  attachments: number
  toolsComplete: number
  toolsTotal: number
}

export function AuditCard ({
  id,
  title,
  location,
  quarter,
  auditor,
  status,
  attachments,
  toolsComplete,
  toolsTotal
}: AuditCardProps) {
  const { label, className } = STATUS_CONFIG[status]

  return (
    <div className='group relative flex items-center gap-0 rounded-lg border border-border bg-card transition-all hover:border-primary/30 hover:shadow-sm'>
      <Link
        to={`/audit/${id}`}
        className='flex-1 min-w-0 flex items-center gap-4 p-4 pr-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-l-lg'
      >
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2.5 mb-1'>
            <h3 className='font-semibold text-card-foreground text-sm leading-snug tracking-tight truncate'>
              {title}
            </h3>
            <Badge variant='outline' className={`${className} shrink-0 text-[11px] px-1.5 py-0`}>
              {label}
            </Badge>
          </div>

          <div className='flex items-center gap-3 mt-1.5 text-xs text-muted-foreground'>
            <span className='inline-flex items-center gap-1'>
              <MapPin className='size-3 shrink-0' />
              <span className='truncate'>{location}</span>
            </span>
            <span className='inline-flex items-center gap-1'>
              <CalendarDays className='size-3 shrink-0' />
              {quarter}
            </span>
            <span className='inline-flex items-center gap-1'>
              <User className='size-3 shrink-0' />
              <span className='truncate'>{auditor}</span>
            </span>
            <span className='inline-flex items-center gap-1'>
              <ClipboardList className='size-3 shrink-0' />
              <span className='tabular-nums font-medium'>
                {toolsComplete}/{toolsTotal} tools
              </span>
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

        {attachments > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='size-8 text-muted-foreground hover:text-card-foreground relative'
                onClick={(e) => { e.preventDefault(); e.stopPropagation() }}
              >
                <Paperclip className='size-4' />
                <span className='absolute -top-0.5 -right-0.5 flex items-center justify-center size-3.5 rounded-full bg-primary text-[9px] font-bold text-primary-foreground'>
                  {attachments}
                </span>
                <span className='sr-only'>{attachments} attachments</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='bottom'>
              {attachments} attachment{attachments > 1 ? 's' : ''}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  )
}
