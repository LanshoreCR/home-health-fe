import { useCallback, useEffect, useRef, useState } from 'react'
import { FileText, Image, Paperclip, Download, Trash2, Loader2, Upload, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  type AttachmentInfo,
  deleteAttachment,
  downloadAttachment,
  getAttachmentsByPackageId,
  uploadAttachment
} from '@shared/services/api/endpoints/attachments'

export interface AttachmentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageID: number
  packageName: string
}

type ListPhase = 'loading' | 'ready' | 'error'

function formatBytes (bytes?: number): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate (iso?: string): string {
  if (iso == null) return '—'
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function FileIcon ({ fileType }: { fileType?: string }): JSX.Element {
  const type = fileType?.toLowerCase() ?? ''
  if (type.startsWith('image/')) {
    return <Image className='size-4 shrink-0 text-blue-500' />
  }
  return <FileText className='size-4 shrink-0 text-muted-foreground' />
}

function readFileAsBase64 (file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => { resolve(reader.result as string) }
    reader.onerror = () => { reject(new Error('Failed to read file')) }
    reader.readAsDataURL(file)
  })
}

export function AttachmentsModal ({
  open,
  onOpenChange,
  packageID,
  packageName
}: AttachmentsModalProps): JSX.Element {
  const [phase, setPhase] = useState<ListPhase>('loading')
  const [attachments, setAttachments] = useState<AttachmentInfo[]>([])
  const [uploading, setUploading] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AttachmentInfo | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAttachments = useCallback(async () => {
    setPhase('loading')
    try {
      const data = await getAttachmentsByPackageId(packageID)
      setAttachments(data)
      setPhase('ready')
    } catch {
      setPhase('error')
    }
  }, [packageID])

  useEffect(() => {
    if (!open) {
      setPhase('loading')
      setAttachments([])
      setUploading(false)
      setDownloadingId(null)
      setDeleteTarget(null)
      return
    }
    void fetchAttachments()
  }, [open, fetchAttachments])

  const handleFileSelected = async (file: File): Promise<void> => {
    setUploading(true)
    try {
      const fileBase64 = await readFileAsBase64(file)
      await uploadAttachment({
        packageId: packageID,
        fileName: file.name,
        fileBase64,
        fileType: file.type
      })
      toast.success(`"${file.name}" uploaded successfully`)
      await fetchAttachments()
    } catch {
      // toast is shown inside uploadAttachment
    } finally {
      setUploading(false)
      if (fileInputRef.current != null) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file != null) {
      void handleFileSelected(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file != null) {
      void handleFileSelected(file)
    }
  }

  const handleDownload = async (attachment: AttachmentInfo): Promise<void> => {
    setDownloadingId(attachment.fileId)
    try {
      const downloaded = await downloadAttachment(attachment.fileId)
      const a = document.createElement('a')
      a.href = downloaded.src
      a.download = downloaded.name
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success(`"${downloaded.name}" downloaded`)
    } catch {
      // toast is shown inside downloadAttachment
    } finally {
      setDownloadingId(null)
    }
  }

  const handleDeleteConfirm = async (): Promise<void> => {
    if (deleteTarget == null) return
    setDeleting(true)
    try {
      await deleteAttachment(deleteTarget.fileId)
      toast.success(`"${deleteTarget.fileName}" deleted`)
      setDeleteTarget(null)
      await fetchAttachments()
    } catch {
      // toast is shown inside deleteAttachment
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='sm:max-w-lg' onClick={(e) => { e.stopPropagation() }}>
          <DialogHeader>
            <DialogTitle>Attachments</DialogTitle>
            <DialogDescription>{packageName}</DialogDescription>
          </DialogHeader>

          {/* Upload zone */}
          <div
            role='button'
            tabIndex={0}
            aria-label='Upload attachment'
            className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 transition-colors ${dragOver ? 'border-primary bg-primary/5' : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'} ${uploading ? 'pointer-events-none opacity-60' : ''}`}
            onClick={() => { fileInputRef.current?.click() }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => { setDragOver(false) }}
            onDrop={handleDrop}
          >
            {uploading
              ? (
                <>
                  <Loader2 className='size-5 animate-spin text-primary' />
                  <p className='text-center text-sm text-muted-foreground'>Uploading…</p>
                </>
                )
              : (
                <>
                  <Upload className='size-5 text-muted-foreground' />
                  <p className='text-center text-sm text-muted-foreground'>
                    <span className='font-medium text-foreground'>Click to upload</span> or drag & drop
                  </p>
                </>
                )}
            <input
              ref={fileInputRef}
              type='file'
              className='hidden'
              onChange={handleInputChange}
            />
          </div>

          {/* Attachment list */}
          <div className='max-h-64 overflow-y-auto rounded-lg border border-border'>
            {phase === 'loading' && (
              <div className='flex min-h-[80px] items-center justify-center gap-2'>
                <Loader2 className='size-5 animate-spin text-primary' />
                <p className='text-sm text-muted-foreground'>Loading attachments…</p>
              </div>
            )}

            {phase === 'error' && (
              <div className='flex min-h-[80px] flex-col items-center justify-center gap-2 px-4'>
                <AlertCircle className='size-5 text-destructive' />
                <p className='text-center text-sm text-destructive'>
                  Could not load attachments.
                </p>
                <Button variant='outline' size='sm' onClick={() => { void fetchAttachments() }}>
                  Retry
                </Button>
              </div>
            )}

            {phase === 'ready' && attachments.length === 0 && (
              <div className='flex min-h-[80px] flex-col items-center justify-center gap-2 px-4'>
                <Paperclip className='size-5 text-muted-foreground/50' />
                <p className='text-center text-sm text-muted-foreground'>No attachments yet</p>
              </div>
            )}

            {phase === 'ready' && attachments.length > 0 && (
              <ul className='divide-y divide-border'>
                {attachments.map((attachment) => (
                  <li key={attachment.fileId} className='flex items-center gap-3 px-3 py-2.5'>
                    <FileIcon fileType={attachment.fileType} />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium text-card-foreground'>
                        {attachment.fileName}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {formatBytes(attachment.size)} · {formatDate(attachment.modifiedDateTime)}
                      </p>
                    </div>
                    <div className='flex shrink-0 items-center gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-7 text-muted-foreground hover:text-foreground'
                        disabled={downloadingId != null}
                        onClick={() => { void handleDownload(attachment) }}
                      >
                        {downloadingId === attachment.fileId
                          ? <Loader2 className='size-3.5 animate-spin' />
                          : <Download className='size-3.5' />}
                        <span className='sr-only'>Download</span>
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                        onClick={() => { setDeleteTarget(attachment) }}
                      >
                        <Trash2 className='size-3.5' />
                        <span className='sr-only'>Delete</span>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={() => { onOpenChange(false) }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => { if (!open) setDeleteTarget(null) }}
      >
        <AlertDialogContent onClick={(e) => { e.stopPropagation() }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this attachment?</AlertDialogTitle>
            <AlertDialogDescription>
              {`"${deleteTarget?.fileName ?? ''}" will be permanently removed. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <Button
              variant='destructive'
              disabled={deleting}
              onClick={() => { void handleDeleteConfirm() }}
            >
              {deleting && <Loader2 className='size-4 animate-spin' />}
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
