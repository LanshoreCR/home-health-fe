import { useState, type MouseEvent } from 'react'
import { Download, CheckCircle2, XCircle, ChevronRight, CalendarDays, Hash, TrendingUp, Loader2, Trash2, Paperclip } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import useRole from '@shared/hooks/useRole'
import type { Audit } from '@/shared/types'
import { ExportAuditModal } from '@/components/export-audit-modal'
import { AttachmentsModal } from '@/components/attachments-modal'
import { deleteAuditPackage, updateAuditStatus } from '@shared/services/api/endpoints/audit-packages'
import { getToolsByAuditPackageId } from '@shared/services/api/endpoints/tools'
import { PACKAGE_STATUS_MAP, TEMPLATE_STATUS, TOOL_STATUS_UNDER_REVIEW } from '@shared/utils/status-config'

const SKELETON_CARD_COUNT = 5

export function AuditCardSkeleton (): JSX.Element {
  return (
    <div className='flex items-center gap-0 rounded-lg border border-border bg-card'>
      <div className='flex-1 min-w-0 flex items-center gap-4 p-4 pr-0'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2.5 mb-1'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='h-4 w-14 rounded-md' />
          </div>
          <div className='flex items-center gap-3 mt-1.5'>
            <Skeleton className='h-3 w-20' />
            <Skeleton className='h-3 w-28' />
            <Skeleton className='h-3 w-12' />
          </div>
        </div>
        <Skeleton className='size-4 rounded shrink-0' />
      </div>
      <div className='flex items-center gap-0.5 border-l border-border px-2 py-4 shrink-0'>
        <Skeleton className='size-8 rounded' />
        <Skeleton className='size-8 rounded' />
        <Skeleton className='size-8 rounded' />
        <Skeleton className='size-8 rounded' />
      </div>
    </div>
  )
}

export function AuditCardSkeletonList (): JSX.Element {
  return (
    <>
      {Array.from({ length: SKELETON_CARD_COUNT }, (_, i) => (
        <AuditCardSkeleton key={i} />
      ))}
    </>
  )
}

function formatDate (isoString: string): string {
  return isoString.slice(0, 10)
}

export type AuditCardProps = Audit & {
  onStatusUpdated?: () => void | Promise<void>
}

export function AuditCard ({
  packageID,
  packageName,
  packageStatus,
  edNumber,
  startDate,
  endDate,
  packageScore,
  onStatusUpdated
}: AuditCardProps): JSX.Element {
  const statusConfig = PACKAGE_STATUS_MAP[packageStatus] ?? { label: 'Unknown', className: '' }
  const { isAdmin, isUser } = useRole()
  const canDelete = isAdmin || (isUser && packageStatus === TEMPLATE_STATUS.PENDING)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [checkingAction, setCheckingAction] = useState<'approve' | 'reject' | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [attachmentsOpen, setAttachmentsOpen] = useState(false)

  const canChangeStatus =
    packageStatus === TEMPLATE_STATUS.PENDING ||
    packageStatus === TEMPLATE_STATUS.UNDER_REVIEW

  const validateAndOpenConfirm = async (action: 'approve' | 'reject'): Promise<void> => {
    setCheckingAction(action)
    try {
      const tools = await getToolsByAuditPackageId(String(packageID))
      const allUnderReview =
        tools.length > 0 && tools.every((tool) => tool.templateStatus === TOOL_STATUS_UNDER_REVIEW)
      if (!allUnderReview) {
        toast.error('All tools must be under review before approving or rejecting this audit')
        return
      }
      setConfirmAction(action)
      setConfirmOpen(true)
    } catch {
      // Error toast is handled in getToolsByAuditPackageId
    } finally {
      setCheckingAction(null)
    }
  }

  const openConfirm = (action: 'approve' | 'reject') => (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (!canChangeStatus || submitting || checkingAction !== null) return
    void validateAndOpenConfirm(action)
  }

  const openConfirmDelete = (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    if (submitting) return
    if (!canDelete) return
    setConfirmAction('delete')
    setConfirmOpen(true)
  }

  const openExportModal = (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setExportOpen(true)
  }

  const openAttachmentsModal = (e: MouseEvent): void => {
    e.preventDefault()
    e.stopPropagation()
    setAttachmentsOpen(true)
  }

  const handleConfirm = async (): Promise<void> => {
    if (confirmAction === null) return
    if (confirmAction === 'delete') {
      if (!canDelete) return
      setSubmitting(true)
      try {
        await deleteAuditPackage(packageID)
        toast.success('Audit deleted')
        await onStatusUpdated?.()
        setConfirmOpen(false)
        setConfirmAction(null)
      } catch {
        // Error toast is handled in deleteAuditPackage
      } finally {
        setSubmitting(false)
      }
      return
    }
    const templateStatusID =
      confirmAction === 'approve' ? TEMPLATE_STATUS.APPROVED : TEMPLATE_STATUS.REJECTED
    setSubmitting(true)
    try {
      await updateAuditStatus(packageID, templateStatusID)
      toast.success(confirmAction === 'approve' ? 'Audit approved' : 'Audit rejected')
      await onStatusUpdated?.()
      setConfirmOpen(false)
      setConfirmAction(null)
    } catch {
      // Error toast is handled in updateAuditStatus
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean): void => {
    if (!open) setConfirmAction(null)
    setConfirmOpen(open)
  }

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
              disabled={!canChangeStatus || submitting || checkingAction !== null}
              onClick={openConfirm('approve')}
            >
              {(submitting && confirmAction === 'approve') || checkingAction === 'approve'
                ? (
                  <Loader2 className='size-4 animate-spin' />
                  )
                : (
                  <CheckCircle2 className='size-4' />
                  )}
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
              disabled={!canChangeStatus || submitting || checkingAction !== null}
              onClick={openConfirm('reject')}
            >
              {(submitting && confirmAction === 'reject') || checkingAction === 'reject'
                ? (
                  <Loader2 className='size-4 animate-spin' />
                  )
                : (
                  <XCircle className='size-4' />
                  )}
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
              onClick={openExportModal}
            >
              <Download className='size-4' />
              <span className='sr-only'>Export to Excel</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Export to Excel</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-card-foreground'
              onClick={openAttachmentsModal}
            >
              <Paperclip className='size-4' />
              <span className='sr-only'>Attachments</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Attachments</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='size-8 text-muted-foreground hover:text-red-600 hover:bg-red-50'
              disabled={submitting || !canDelete}
              onClick={openConfirmDelete}
            >
              {submitting && confirmAction === 'delete'
                ? (
                  <Loader2 className='size-4 animate-spin' />
                  )
                : (
                  <Trash2 className='size-4' />
                  )}
              <span className='sr-only'>Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side='bottom'>{canDelete ? 'Delete' : 'Only pending audits can be deleted'}</TooltipContent>
        </Tooltip>
      </div>

      <ExportAuditModal
        open={exportOpen}
        onOpenChange={setExportOpen}
        packageID={packageID}
        packageName={packageName}
      />

      <AttachmentsModal
        open={attachmentsOpen}
        onOpenChange={setAttachmentsOpen}
        packageID={packageID}
        packageName={packageName}
      />

      <AlertDialog open={confirmOpen} onOpenChange={handleOpenChange}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'delete'
                ? 'Delete this audit?'
                : confirmAction === 'approve'
                  ? 'Approve this audit?'
                  : 'Reject this audit?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === 'delete'
                ? `“${packageName}” will be permanently removed. This action cannot be undone.`
                : confirmAction === 'approve'
                  ? `“${packageName}” will be marked as approved.`
                  : `“${packageName}” will be marked as rejected.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <Button
              type='button'
              variant={
                confirmAction === 'reject' || confirmAction === 'delete' ? 'destructive' : 'default'
              }
              disabled={submitting}
              onClick={() => {
                handleConfirm().catch(() => {})
              }}
            >
              {submitting && <Loader2 className='size-4 animate-spin' />}
              {confirmAction === 'delete'
                ? 'Delete'
                : confirmAction === 'approve'
                  ? 'Approve'
                  : 'Reject'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
