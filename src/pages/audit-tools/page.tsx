import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Search, ClipboardList } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ToolListItem } from '@/components/tool-list-item'
import { getToolStatus } from '@shared/utils/tool-status'
import { getStatusBadgeClass } from '@shared/utils/status-config'
import { auditToolsMap } from '@/mocks'

type FilterStatus = 'all' | 'not-started' | 'in-progress' | 'complete'

export default function AuditToolsPage () {
  const { id } = useParams<{ id: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')

  if (id === undefined) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <p className='text-muted-foreground'>Audit not found.</p>
      </div>
    )
  }

  const audit = auditToolsMap[id]

  const filteredTools = useMemo(() => {
    if (!audit) return []
    return audit.tools
      .filter((t) => {
        if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        if (statusFilter !== 'all' && getToolStatus(t.completed, t.total) !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const order: Record<string, number> = { 'not-started': 0, 'in-progress': 1, complete: 2 }
        return order[getToolStatus(a.completed, a.total)] - order[getToolStatus(b.completed, b.total)]
      })
  }, [audit, searchQuery, statusFilter])

  const totalComplete = useMemo(() => audit?.tools.filter((t) => getToolStatus(t.completed, t.total) === 'complete').length ?? 0, [audit])
  const totalInProgress = useMemo(() => audit?.tools.filter((t) => getToolStatus(t.completed, t.total) === 'in-progress').length ?? 0, [audit])
  const totalNotStarted = useMemo(() => audit?.tools.filter((t) => getToolStatus(t.completed, t.total) === 'not-started').length ?? 0, [audit])

  if (audit === undefined) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <p className='text-muted-foreground'>Audit not found.</p>
      </div>
    )
  }

  const statusFilters: Array<{ key: FilterStatus, label: string, count: number }> = [
    { key: 'all', label: 'All', count: audit.tools.length },
    { key: 'not-started', label: 'Not started', count: totalNotStarted },
    { key: 'in-progress', label: 'In progress', count: totalInProgress },
    { key: 'complete', label: 'Complete', count: totalComplete }
  ]

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-30 bg-card border-b border-border'>
        <div className='mx-auto max-w-3xl px-4 sm:px-6'>
          <div className='flex items-center gap-4 h-14'>
            <Link
              to='/'
              className='flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground transition-colors shrink-0'
            >
              <ArrowLeft className='size-4' />
              <span className='hidden sm:inline'>Home</span>
            </Link>

            <div className='flex-1 min-w-0'>
              <h1 className='text-sm font-semibold text-card-foreground truncate'>
                {audit.title}
              </h1>
              <p className='text-xs text-muted-foreground truncate'>{audit.location}</p>
            </div>

            <Badge variant='outline' className={`shrink-0 text-xs ${getStatusBadgeClass(audit.status)}`}>
              {audit.status}
            </Badge>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 sm:px-6 py-6'>
        <div className='flex items-center gap-3 mb-5'>
          <ClipboardList className='size-5 text-primary' />
          <h2 className='text-lg font-semibold text-card-foreground'>
            Tools
          </h2>
          <span className='text-sm text-muted-foreground'>
            {totalComplete} of {audit.tools.length} complete
          </span>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 mb-5'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Search tools...'
              className='pl-9 h-9 bg-card'
            />
          </div>
          <div className='flex gap-1.5 overflow-x-auto pb-0.5'>
            {statusFilters.map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card border border-border text-muted-foreground hover:text-card-foreground'
                }`}
              >
                {label}
                <span className='ml-1 tabular-nums opacity-75'>{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          {filteredTools.map((tool) => (
            <ToolListItem
              key={tool.id}
              auditId={id}
              toolId={tool.id}
              name={tool.name}
              completed={tool.completed}
              total={tool.total}
            />
          ))}

          {filteredTools.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-card'>
              <p className='text-sm text-muted-foreground'>
                No tools match your search.
              </p>
              {(searchQuery || statusFilter !== 'all') && (
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('all') }}
                  className='mt-2 text-sm text-primary hover:underline'
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
