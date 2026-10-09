import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { MaintenanceQuestion, MaintenanceQuestionInput } from '@shared/types'

interface QuestionDialogProps {
  open: boolean
  question: MaintenanceQuestion | null
  onOpenChange: (open: boolean) => void
  onSave: (input: MaintenanceQuestionInput) => Promise<void>
}

const emptyInput: MaintenanceQuestionInput = { questionText: '', categ: 'N/A', gTag: '' }

const toInput = (question: MaintenanceQuestion | null): MaintenanceQuestionInput =>
  question == null
    ? emptyInput
    : { questionText: question.questionText, categ: question.categ ?? '', gTag: question.gTag ?? '' }

export function QuestionDialog ({ open, question, onOpenChange, onSave }: QuestionDialogProps): JSX.Element {
  const [input, setInput] = useState<MaintenanceQuestionInput>(emptyInput)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) setInput(toInput(question))
  }, [open, question])

  const isNew = question == null
  const canSave = input.questionText.trim() !== '' && !saving

  const handleSave = async (): Promise<void> => {
    setSaving(true)
    try {
      await onSave(input)
      onOpenChange(false)
    } catch {
      // The service already showed the error
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add question' : 'Edit question'}</DialogTitle>
          <DialogDescription>
            Changes stay in the draft. Tools keep their current questions until the draft is published.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <Label htmlFor='question-text'>Question</Label>
            <Textarea
              id='question-text'
              rows={5}
              maxLength={4000}
              value={input.questionText}
              onChange={(e) => setInput({ ...input, questionText: e.target.value })}
            />
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='question-section'>Section</Label>
              <Input
                id='question-section'
                maxLength={3000}
                value={input.categ ?? ''}
                onChange={(e) => setInput({ ...input, categ: e.target.value })}
              />
            </div>
            <div className='flex flex-col gap-1.5'>
              <Label htmlFor='question-gtag'>G-Tag</Label>
              <Input
                id='question-gtag'
                maxLength={20}
                value={input.gTag ?? ''}
                onChange={(e) => setInput({ ...input, gTag: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={() => { void handleSave() }} disabled={!canSave}>
            {saving && <Loader2 className='size-4 mr-1.5 animate-spin' />}
            {isNew ? 'Add to draft' : 'Save to draft'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
