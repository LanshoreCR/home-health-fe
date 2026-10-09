import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { DraftBar } from '@/components/maintenance/draft-bar'
import { InactiveQuestions } from '@/components/maintenance/inactive-questions'
import { QuestionDialog } from '@/components/maintenance/question-dialog'
import { QuestionHistoryDialog } from '@/components/maintenance/question-history-dialog'
import { QuestionRow } from '@/components/maintenance/question-row'
import { VersionList } from '@/components/maintenance/version-list'
import {
  createDraft,
  createQuestion,
  discardDraft,
  getMaintenanceQuestions,
  getTemplateVersions,
  publishDraft,
  reorderQuestions,
  setQuestionActive,
  updateQuestion
} from '@shared/services/api/endpoints/maintenance'
import type { MaintenanceQuestion, MaintenanceQuestionInput, TemplateVersion } from '@shared/types'

// Home Health has a single tool template today; the Create Tool flow uses the same id.
const TEMPLATE_ID = 1

interface EditorState {
  open: boolean
  question: MaintenanceQuestion | null
}

export default function MaintenancePage (): JSX.Element {
  const [versions, setVersions] = useState<TemplateVersion[]>([])
  const [questions, setQuestions] = useState<MaintenanceQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [editor, setEditor] = useState<EditorState>({ open: false, question: null })
  const [historyQuestion, setHistoryQuestion] = useState<MaintenanceQuestion | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const refresh = useCallback(async (): Promise<void> => {
    const [nextVersions, nextQuestions] = await Promise.all([
      getTemplateVersions(TEMPLATE_ID),
      getMaintenanceQuestions(TEMPLATE_ID)
    ])
    setVersions(nextVersions)
    setQuestions(nextQuestions)
  }, [])

  useEffect(() => {
    refresh().catch(() => {}).finally(() => setLoading(false))
  }, [refresh])

  const draft = versions.find((v) => v.isDraft)
  const current = versions.find((v) => v.isCurrent)
  const editable = draft != null
  const activeQuestions = useMemo(() => questions.filter((q) => q.isActive), [questions])
  const inactiveQuestions = useMemo(() => questions.filter((q) => !q.isActive), [questions])
  const changeCount = questions.filter((q) => q.isNew || q.isEdited || q.isRemoved).length

  const mutate = async (action: () => Promise<unknown>, success?: string): Promise<void> => {
    try {
      await action()
      if (success != null) toast.success(success)
    } finally {
      await refresh().catch(() => {})
    }
  }

  const handleSave = async (input: MaintenanceQuestionInput): Promise<void> => {
    const question = editor.question
    await mutate(async () => {
      if (question == null) return await createQuestion(TEMPLATE_ID, input)
      return await updateQuestion(TEMPLATE_ID, question.questionID, input)
    })
  }

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event
    if (over == null || active.id === over.id) return

    const from = activeQuestions.findIndex((q) => q.questionID === active.id)
    const to = activeQuestions.findIndex((q) => q.questionID === over.id)
    const reordered = arrayMove(activeQuestions, from, to).map((q, index) => ({ ...q, questionSort: index + 1 }))
    setQuestions([...reordered, ...inactiveQuestions])

    void mutate(async () => await reorderQuestions(TEMPLATE_ID, reordered.map((q) => q.questionID))).catch(() => {})
  }

  const handlePublish = async (): Promise<void> => {
    await mutate(async () => {
      const published = await publishDraft(TEMPLATE_ID)
      toast.success(`Version ${published.versionNumber} published. New tools will use it.`)
    })
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <Loader2 className='size-5 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='sticky top-0 z-30 border-b border-border bg-card'>
        <div className='mx-auto flex h-14 max-w-3xl items-center gap-4 px-4 sm:px-6'>
          <Link to='/' className='flex shrink-0 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-card-foreground'>
            <ArrowLeft className='size-4' />
            <span className='hidden sm:inline'>Home</span>
          </Link>
          <div className='min-w-0 flex-1'>
            <h1 className='truncate text-sm font-semibold text-card-foreground'>Question maintenance</h1>
            <p className='truncate text-xs text-muted-foreground'>
              CRR Tool · {activeQuestions.length} active {activeQuestions.length === 1 ? 'question' : 'questions'}
            </p>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-3xl px-4 py-6 sm:px-6'>
        <DraftBar
          current={current}
          draft={draft}
          changeCount={changeCount}
          onStartDraft={async () => await mutate(async () => await createDraft(TEMPLATE_ID))}
          onPublish={handlePublish}
          onDiscard={async () => await mutate(async () => await discardDraft(TEMPLATE_ID), 'Draft discarded')}
        />

        <div className='mb-3 mt-6 flex items-center justify-between'>
          <h2 className='text-sm font-medium text-card-foreground'>
            {editable ? `Questions in draft v${draft.versionNumber}` : `Questions in v${current?.versionNumber ?? ''}`}
          </h2>
          {editable && (
            <Button size='sm' variant='outline' className='h-8 text-xs' onClick={() => setEditor({ open: true, question: null })}>
              <Plus className='mr-1.5 size-3.5' />
              Add question
            </Button>
          )}
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={activeQuestions.map((q) => q.questionID)} strategy={verticalListSortingStrategy}>
            <ol className='flex flex-col gap-2'>
              {activeQuestions.map((question) => (
                <QuestionRow
                  key={question.questionID}
                  question={question}
                  editable={editable}
                  onEdit={() => setEditor({ open: true, question })}
                  onDeactivate={() => { void mutate(async () => await setQuestionActive(TEMPLATE_ID, question.questionID, false)).catch(() => {}) }}
                  onShowHistory={() => setHistoryQuestion(question)}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>

        <InactiveQuestions
          questions={inactiveQuestions}
          editable={editable}
          onActivate={(question) => { void mutate(async () => await setQuestionActive(TEMPLATE_ID, question.questionID, true)).catch(() => {}) }}
          onShowHistory={setHistoryQuestion}
        />

        <VersionList versions={versions} />
      </main>

      <QuestionDialog
        open={editor.open}
        question={editor.question}
        onOpenChange={(open) => setEditor((prev) => ({ ...prev, open }))}
        onSave={handleSave}
      />
      <QuestionHistoryDialog
        question={historyQuestion}
        onOpenChange={(open) => { if (!open) setHistoryQuestion(null) }}
      />
    </div>
  )
}
