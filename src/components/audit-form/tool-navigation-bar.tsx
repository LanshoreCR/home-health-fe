import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ToolInfo } from '@/shared/types'

interface ToolNavigationBarProps {
  prevTool: ToolInfo | null
  nextTool: ToolInfo | null
  onNavigate: (id: string) => void
  center: React.ReactNode
}

export function ToolNavigationBar ({
  prevTool,
  nextTool,
  onNavigate,
  center
}: ToolNavigationBarProps) {
  return (
    <div className='flex items-center gap-2 h-11 border-t border-border'>
      <Button
        variant='ghost'
        size='sm'
        disabled={!prevTool}
        className='h-7 px-2 text-xs text-muted-foreground'
        onClick={() => prevTool && onNavigate(prevTool.id)}
      >
        <ChevronLeft className='size-3.5 mr-1' />
        <span className='hidden sm:inline truncate max-w-24'>{prevTool?.name ?? 'Prev'}</span>
        <span className='sm:hidden'>Prev</span>
      </Button>

      {center}

      <Button
        variant='ghost'
        size='sm'
        disabled={!nextTool}
        className='h-7 px-2 text-xs text-muted-foreground'
        onClick={() => nextTool && onNavigate(nextTool.id)}
      >
        <span className='hidden sm:inline truncate max-w-24'>{nextTool?.name ?? 'Next'}</span>
        <span className='sm:hidden'>Next</span>
        <ChevronRight className='size-3.5 ml-1' />
      </Button>
    </div>
  )
}
