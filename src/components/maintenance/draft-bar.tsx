import { useState } from 'react'
import { FilePen, Loader2, Rocket, Trash2 } from 'lucide-react'
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
import type { TemplateVersion } from '@shared/types'

interface DraftBarProps {
  current: TemplateVersion | undefined
  draft: TemplateVersion | undefined
  changeCount: number
  onStartDraft: () => Promise<void>
  onPublish: () => Promise<void>
  onDiscard: () => Promise<void>
}

type PendingAction = 'start' | 'publish' | 'discard' | null

export function DraftBar ({ current, draft, changeCount, onStartDraft, onPublish, onDiscard }: DraftBarProps): JSX.Element {
  const [pending, setPending] = useState<PendingAction>(null)
  const [confirm, setConfirm] = useState<'publish' | 'discard' | null>(null)

  const run = async (action: PendingAction, task: () => Promise<void>): Promise<void> => {
    setPending(action)
    try {
      await task()
    } catch {
      // The service already showed the error
    } finally {
      setPending(null)
      setConfirm(null)
    }
  }

  if (draft == null) {
    return (
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3'>
        <p className='text-sm text-muted-foreground'>
          New tools are created from <span className='font-medium text-card-foreground'>v{current?.versionNumber}</span>.
          Start a draft to change the questions.
        </p>
        <Button size='sm' className='h-8 text-xs' disabled={pending != null} onClick={() => { void run('start', onStartDraft) }}>
          {pending === 'start' ? <Loader2 className='mr-1.5 size-3.5 animate-spin' /> : <FilePen className='mr-1.5 size-3.5' />}
          Edit questions
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3'>
        <p className='text-sm text-amber-900'>
          <span className='font-medium'>Draft v{draft.versionNumber}</span>
          {changeCount > 0 && <> · {changeCount} {changeCount === 1 ? 'change' : 'changes'}</>}
          <span className='block text-xs text-amber-800/80'>New tools keep using v{current?.versionNumber} until you publish.</span>
        </p>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='h-8 bg-white text-xs' disabled={pending != null} onClick={() => setConfirm('discard')}>
            <Trash2 className='mr-1.5 size-3.5' />
            Discard
          </Button>
          <Button size='sm' className='h-8 text-xs' disabled={pending != null} onClick={() => setConfirm('publish')}>
            <Rocket className='mr-1.5 size-3.5' />
            Publish
          </Button>
        </div>
      </div>

      <AlertDialog open={confirm != null} onOpenChange={(open) => { if (!open) setConfirm(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm === 'publish' ? `Publish v${draft.versionNumber}?` : 'Discard the draft?'}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === 'publish'
                ? 'Tools created from now on will use these questions. Existing tools keep the questions they were created with.'
                : 'All changes in the draft will be lost. Published versions are not affected.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending != null}>Cancel</AlertDialogCancel>
            <Button
              variant={confirm === 'discard' ? 'destructive' : 'default'}
              disabled={pending != null}
              onClick={() => { void run(confirm, confirm === 'publish' ? onPublish : onDiscard) }}
            >
              {pending != null && <Loader2 className='mr-1.5 size-4 animate-spin' />}
              {confirm === 'publish' ? 'Publish' : 'Discard draft'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
