import { useCallback, useEffect, useState } from 'react'
import { CheckCircle2, Download, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { exportAuditExcel } from '@shared/services/api/endpoints/export'

export interface ExportAuditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageID: number
  packageName: string
}

type ExportPhase = 'idle' | 'loading' | 'ready' | 'error'

const DEFAULT_FILENAME_PREFIX = 'Audit_'

export function ExportAuditModal ({
  open,
  onOpenChange,
  packageID,
  packageName
}: ExportAuditModalProps): JSX.Element {
  const [phase, setPhase] = useState<ExportPhase>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)

  const fetchExport = useCallback(async () => {
    setPhase('loading')
    setBlob(null)
    try {
      const data = await exportAuditExcel(packageID)
      setBlob(data)
      setPhase('ready')
    } catch {
      setPhase('error')
    }
  }, [packageID])

  useEffect(() => {
    if (!open) {
      setPhase('idle')
      setBlob(null)
      return
    }
    void fetchExport()
  }, [open, packageID, fetchExport])

  const handleDownload = (): void => {
    if (blob == null) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${DEFAULT_FILENAME_PREFIX}${packageID}.xlsx`
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleRetry = (): void => {
    void fetchExport()
  }

  const showLoading =
    phase === 'loading' || (open && phase === 'idle')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md' onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Export audit</DialogTitle>
          <DialogDescription>
            {packageName}
          </DialogDescription>
        </DialogHeader>

        <div
          className='flex min-h-[120px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6'
        >
          {showLoading && (
            <>
              <Loader2 className='size-8 animate-spin text-primary' aria-hidden />
              <p className='text-center text-sm text-muted-foreground'>
                Generating your Excel file…
              </p>
            </>
          )}
          {phase === 'ready' && blob != null && (
            <>
              <CheckCircle2 className='size-8 text-emerald-600' aria-hidden />
              <p className='text-center text-sm text-muted-foreground'>
                Your file is ready. Click Download to save it to your device.
              </p>
            </>
          )}
          {phase === 'error' && (
            <p className='text-center text-sm text-destructive'>
              We couldn&apos;t generate the Excel file. Please try again.
            </p>
          )}
        </div>

        <DialogFooter className='flex-col gap-2 sm:flex-row sm:justify-end'>
          {phase === 'error' && (
            <Button type='button' variant='outline' onClick={handleRetry}>
              Retry
            </Button>
          )}
          <Button
            type='button'
            className='w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700 sm:w-auto'
            disabled={phase !== 'ready' || blob == null}
            onClick={handleDownload}
          >
            <Download className='size-4' />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
