import { useState, useMemo, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Search, ClipboardList, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToolListItem } from '@/components/tool-list-item'
import { CreateToolModal } from '@/components/create-tool-modal'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { getToolStatus } from '@shared/utils/tool-status'
import { PACKAGE_STATUS_MAP, TEMPLATE_STATUS } from '@shared/utils/status-config'
import { getAuditById } from '@shared/services/api/endpoints/audit-packages'
import { getToolsByAuditPackageId, createAuditTool } from '@shared/services/api/endpoints/tools'
import type { ToolMetadata, ToolInfo } from '@/shared/types'
import type { Audit } from '@shared/types'

type FilterStatus = 'all' | 'not-started' | 'in-progress' | 'complete'

function formatDate (isoString: string): string {
  return isoString.slice(0, 10)
}

export default function AuditToolsPage () {
  const { id } = useParams<{ id: string }>()
  const [audit, setAudit] = useState<Audit | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tools, setTools] = useState<ToolInfo[]>([])
  const [toolsLoading, setToolsLoading] = useState(false)
  const [toolsError, setToolsError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all')
  const [createToolModalOpen, setCreateToolModalOpen] = useState(false)
  const [creatingTool, setCreatingTool] = useState(false)
  const prevCreateToolModalOpen = useRef(createToolModalOpen)

  useEffect(() => {
    if (id === undefined) return
    setLoading(true)
    setError(null)
    getAuditById(id)
      .then(setAudit)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load audit'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (id === undefined) return
    setToolsLoading(true)
    setToolsError(null)
    getToolsByAuditPackageId(id)
      .then(setTools)
      .catch((err) => setToolsError(err instanceof Error ? err.message : 'Failed to load tools'))
      .finally(() => setToolsLoading(false))
  }, [id])

  useEffect(() => {
    const wasOpen = prevCreateToolModalOpen.current
    prevCreateToolModalOpen.current = createToolModalOpen
    if (!wasOpen || createToolModalOpen) return
    if (id === undefined) return
    setToolsLoading(true)
    setToolsError(null)
    getToolsByAuditPackageId(id)
      .then(setTools)
      .catch((err) => setToolsError(err instanceof Error ? err.message : 'Failed to load tools'))
      .finally(() => setToolsLoading(false))
  }, [createToolModalOpen, id])

  const filteredTools = useMemo(() => {
    return tools
      .filter((t) => {
        if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
        if (statusFilter !== 'all' && getToolStatus(t.completed, t.total) !== statusFilter) return false
        return true
      })
      .sort((a, b) => {
        const order: Record<string, number> = { 'not-started': 0, 'in-progress': 1, complete: 2 }
        return order[getToolStatus(a.completed, a.total)] - order[getToolStatus(b.completed, b.total)]
      })
  }, [tools, searchQuery, statusFilter])

  const refreshTools = async (): Promise<void> => {
    if (id === undefined) return
    try {
      const data = await getToolsByAuditPackageId(id)
      setTools(data)
      setToolsError(null)
    } catch (err) {
      setToolsError(err instanceof Error ? err.message : 'Failed to load tools')
    }
  }

  const totalComplete = useMemo(() => tools.filter((t) => getToolStatus(t.completed, t.total) === 'complete').length, [tools])
  const totalInProgress = useMemo(() => tools.filter((t) => getToolStatus(t.completed, t.total) === 'in-progress').length, [tools])
  const totalNotStarted = useMemo(() => tools.filter((t) => getToolStatus(t.completed, t.total) === 'not-started').length, [tools])

  const statusFilters: Array<{ key: FilterStatus, label: string, count: number }> = [
    { key: 'all', label: 'All', count: tools.length },
    { key: 'not-started', label: 'Not started', count: totalNotStarted },
    { key: 'in-progress', label: 'In progress', count: totalInProgress },
    { key: 'complete', label: 'Complete', count: totalComplete }
  ]

  const handleCreateTool = async (data: ToolMetadata) => {
    if (id === undefined || audit === null) return
    if (audit.packageStatus === TEMPLATE_STATUS.APPROVED) return
    setCreatingTool(true)
    try {
      await createAuditTool({
        packageID: audit.packageID,
        templateID: 1,
        assignedAuditor: '0765647',
        locationNumber: data.locationId,
        ...(data.patientNumber && { patientNumber: data.patientNumber }),
        ...(data.auditDate && { auditDate: data.auditDate }),
        ...(data.activeOrDischarge && { activeOrDischarged: data.activeOrDischarge }),
        ...(data.disciplines && { disciplines: data.disciplines }),
        ...(data.payor && { payor: data.payor }),
        ...(data.reviewDates && { reviewDate: data.reviewDates }),
        ...(data.servicesBilledForReviewDates && {
          servicesBilled: data.servicesBilledForReviewDates === 'yes' ? 'Y' : 'N'
        }),
        ...(data.socDate && { socDate: data.socDate })
      })
      setCreateToolModalOpen(false)
    } catch {
      // toast already in createAuditTool
    } finally {
      setCreatingTool(false)
    }
  }

  if (id === undefined) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <p className='text-muted-foreground'>Audit not found.</p>
      </div>
    )
  }

  if (loading) {
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
              <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
                <Skeleton className='h-4 w-48' />
                <Skeleton className='h-3 w-32' />
              </div>
              <Skeleton className='h-5 w-16 rounded-md shrink-0' />
            </div>
          </div>
        </header>
        <main className='mx-auto max-w-3xl px-4 sm:px-6 py-6'>
          <Skeleton className='h-8 w-64 mb-5' />
          <div className='flex flex-col gap-2'>
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-lg' />
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error || audit === null) {
    return (
      <div className='min-h-screen bg-background flex flex-col items-center justify-center gap-3 px-4'>
        <p className='text-sm text-destructive text-center'>{error ?? 'Audit not found.'}</p>
        <Button variant='outline' size='sm' onClick={() => window.location.reload()}>
          Try again
        </Button>
        <Link to='/' className='text-sm text-primary hover:underline'>
          Back to Home
        </Link>
      </div>
    )
  }

  const statusConfig = PACKAGE_STATUS_MAP[audit.packageStatus] ?? { label: 'Unknown', className: '' }
  const isApproved = audit.packageStatus === TEMPLATE_STATUS.APPROVED

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
                {audit.packageName}
              </h1>
              <p className='text-xs text-muted-foreground truncate'>
                {[
                  audit.edNumber ? `ED: ${audit.edNumber}` : null,
                  audit.startDate && audit.endDate
                    ? `${formatDate(audit.startDate)} – ${formatDate(audit.endDate)}`
                    : audit.startDate
                      ? formatDate(audit.startDate)
                      : null,
                  audit.packageScore ? `Score: ${audit.packageScore}` : null
                ].filter(Boolean).join(' · ')}
              </p>
            </div>

            <Badge variant='outline' className={`shrink-0 text-xs ${statusConfig.className}`}>
              {statusConfig.label}
            </Badge>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 sm:px-6 py-6'>
        <div className='flex items-center justify-between gap-3 mb-5'>
          <div className='flex items-center gap-3'>
            <ClipboardList className='size-5 text-primary' />
            <h2 className='text-lg font-semibold text-card-foreground'>
              Tools
            </h2>
            <span className='text-sm text-muted-foreground'>
              {totalComplete} of {tools.length} complete
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className='shrink-0'>
                <Button
                  size='sm'
                  onClick={() => setCreateToolModalOpen(true)}
                  disabled={isApproved}
                  className='shrink-0'
                >
                  <Plus className='size-4 mr-1.5' />
                  Create Tool
                </Button>
              </span>
            </TooltipTrigger>
            {isApproved && (
              <TooltipContent side='bottom'>This audit is approved and locked</TooltipContent>
            )}
          </Tooltip>
        </div>

        <CreateToolModal
          open={createToolModalOpen}
          onOpenChange={setCreateToolModalOpen}
          isSubmitting={creatingTool}
          onSubmit={handleCreateTool}
        />

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
          {toolsLoading && (
            <>
              {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className='h-16 w-full rounded-lg' />
              ))}
            </>
          )}

          {!toolsLoading && toolsError && (
            <div className='flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-card'>
              <p className='text-sm text-destructive'>{toolsError}</p>
              <Button
                variant='outline'
                size='sm'
                className='mt-3'
                onClick={() => {
                  if (id === undefined) return
                  setToolsError(null)
                  setToolsLoading(true)
                  getToolsByAuditPackageId(id)
                    .then(setTools)
                    .catch((err) => setToolsError(err instanceof Error ? err.message : 'Failed to load tools'))
                    .finally(() => setToolsLoading(false))
                }}
              >
                Try again
              </Button>
            </div>
          )}

          {!toolsLoading && !toolsError && filteredTools.map((tool) => (
            <ToolListItem
              key={tool.id}
              auditId={id}
              toolId={tool.id}
              name={tool.name}
              completed={tool.completed}
              total={tool.total}
              locationName={tool.locationName}
              assignedAuditor={tool.assignedAuditor}
              templateScore={tool.templateScore}
              templateStatus={tool.templateStatus}
              onDeleted={refreshTools}
            />
          ))}

          {!toolsLoading && !toolsError && filteredTools.length === 0 && (
            <div className='flex flex-col items-center justify-center py-16 text-center rounded-lg border border-border bg-card'>
              <p className='text-sm text-muted-foreground'>
                No tools match your search.
              </p>
              {(searchQuery || statusFilter !== 'all') ? (
                <button
                  onClick={() => { setSearchQuery(''); setStatusFilter('all') }}
                  className='mt-2 text-sm text-primary hover:underline'
                >
                  Clear filters
                </button>
              ) : (
                <p className='mt-2 text-sm text-muted-foreground'>No tools in this audit yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
