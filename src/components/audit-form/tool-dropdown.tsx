import { Search, Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ToolInfo } from '@/shared/types'

interface ToolDropdownProps {
  isOpen: boolean
  onToggle: () => void
  toolSearch: string
  onToolSearchChange: (value: string) => void
  tools: ToolInfo[]
  currentToolId: string
  currentToolName: string
  currentToolIndex: number
  allToolsLength: number
  onSelectTool: (id: string) => void
  containerRef: React.RefObject<HTMLDivElement>
  inputRef: React.RefObject<HTMLInputElement>
}

export function ToolDropdown ({
  isOpen,
  onToggle,
  toolSearch,
  onToolSearchChange,
  tools,
  currentToolId,
  currentToolName,
  currentToolIndex,
  allToolsLength,
  onSelectTool,
  containerRef,
  inputRef
}: ToolDropdownProps) {
  return (
    <div className='relative flex-1 flex justify-center' ref={containerRef}>
      <button
        type='button'
        onClick={onToggle}
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors max-w-sm',
          'hover:bg-secondary text-card-foreground',
          isOpen && 'bg-secondary'
        )}
      >
        <span className='truncate'>{currentToolName}</span>
        <span className='text-xs text-muted-foreground tabular-nums shrink-0'>
          {currentToolIndex + 1}/{allToolsLength}
        </span>
        <ChevronsUpDown className='size-3.5 text-muted-foreground shrink-0' />
      </button>

      {isOpen && (
        <div className='absolute top-full mt-1 w-80 bg-card rounded-lg border border-border shadow-lg z-50 overflow-hidden'>
          <div className='p-2 border-b border-border'>
            <div className='relative'>
              <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground' />
              <input
                ref={inputRef}
                type='text'
                value={toolSearch}
                onChange={(e) => onToolSearchChange(e.target.value)}
                placeholder='Search tools...'
                className='w-full pl-8 pr-3 py-1.5 text-sm bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground'
              />
            </div>
          </div>

          <div className='max-h-64 overflow-y-auto py-1'>
            {tools.map((tool, i) => {
              const tPercent = tool.total > 0 ? Math.round((tool.completed / tool.total) * 100) : 0
              const isActive = tool.id === currentToolId
              const isDone = tool.completed === tool.total && tool.total > 0
              return (
                <button
                  key={tool.id}
                  type='button'
                  onClick={() => onSelectTool(tool.id)}
                  className={cn(
                    'flex items-center gap-3 w-full px-3 py-2 text-left text-sm transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'text-card-foreground hover:bg-secondary'
                  )}
                >
                  <span className='w-5 text-xs text-muted-foreground tabular-nums text-right shrink-0'>
                    {i + 1}.
                  </span>
                  <span className='flex-1 truncate'>{tool.name}</span>
                  <span
                    className={cn(
                      'text-xs tabular-nums shrink-0 font-medium',
                      isDone ? 'text-emerald-600' : 'text-muted-foreground'
                    )}
                  >
                    {tPercent}%
                  </span>
                  {isDone && <Check className='size-3.5 text-emerald-600 shrink-0' />}
                  {isActive && !isDone && (
                    <div className='size-1.5 rounded-full bg-primary shrink-0' />
                  )}
                </button>
              )
            })}
            {tools.length === 0 && (
              <p className='px-3 py-4 text-xs text-muted-foreground text-center'>
                No tools found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
