import { ArrowLeft, ChevronRight, Download, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Link } from 'react-router-dom'
import type { AuditFormContext } from '@/shared/types'
import { getStatusBadgeClass } from '@shared/utils/status-config'

interface AuditFormHeaderProps {
  audit: AuditFormContext
  currentToolName: string
  percent: number
}

export function AuditFormHeader ({ audit, currentToolName, percent }: AuditFormHeaderProps) {
  const { auditId, title, location, status } = audit
  return (
    <div className='flex items-center gap-4 h-14'>
      <Link
        to={`/audit/${auditId}`}
        className='flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors shrink-0'
      >
        <ArrowLeft className='size-4' />
        <span className='hidden sm:inline'>Tools</span>
      </Link>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
          <Link to='/' className='hover:text-card-foreground transition-colors truncate'>
            Home
          </Link>
          <ChevronRight className='size-3 shrink-0' />
          <Link
            to={`/audit/${auditId}`}
            className='hover:text-card-foreground transition-colors truncate max-w-40'
          >
            {title}
          </Link>
          <ChevronRight className='size-3 shrink-0' />
          <span className='text-card-foreground font-medium truncate'>{currentToolName}</span>
        </div>
        <div className='flex items-center gap-2 mt-0.5'>
          <span className='text-xs text-muted-foreground truncate'>{location}</span>
          <Badge
            variant='outline'
            className={`shrink-0 text-[10px] px-1.5 py-0 ${getStatusBadgeClass(status)}`}
          >
            {status}
          </Badge>
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <div className='hidden sm:flex items-center gap-2'>
          <Progress value={percent} className='w-20 h-1.5' />
          <span className='text-xs font-semibold text-card-foreground tabular-nums'>{percent}%</span>
        </div>
        <Button variant='outline' size='sm' className='h-8 text-xs'>
          <Download className='size-3.5 mr-1.5' />
          <span className='hidden sm:inline'>Export</span>
        </Button>
        <Button size='sm' className='h-8 text-xs'>
          <Save className='size-3.5 mr-1.5' />
          <span className='hidden sm:inline'>Save</span>
        </Button>
      </div>
    </div>
  )
}
