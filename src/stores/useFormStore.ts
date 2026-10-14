import { create } from 'zustand'
import { toast } from 'sonner'
import type { AnswerValue, QuestionData } from '@/shared/types'
import { updateFormAnswer, type UpdateFormPayload } from '@shared/services/api/endpoints/form'
import { getToolForm, mapFormQuestions } from '@shared/services/api/endpoints/tools'

const ANSWER_TO_NUMBER: Record<Exclude<AnswerValue, null>, number> = {
  yes: 1,
  no: 0,
  na: 2
}

const COMMENT_DEBOUNCE_MS = 500

interface FormState {
  toolId: string | null
  questions: QuestionData[]
  isLoading: boolean
  error: string | null
}

interface FormActions {
  initialize: (toolId: string, questions: QuestionData[]) => void
  updateAnswer: (questionId: string, answer: AnswerValue) => void
  updateComment: (questionId: string, comment: string) => void
  toggleFlag: (questionId: string) => void
  toggleBilling: (questionId: string) => void
  updateBillingNote: (questionId: string, note: string) => void
  refetch: () => Promise<void>
}

type FormStore = FormState & FormActions

function updateQuestionInList (
  questions: QuestionData[],
  questionId: string,
  updates: Partial<QuestionData>
): QuestionData[] {
  return questions.map((q) =>
    q.id === questionId ? { ...q, ...updates } : q
  )
}

type SaveTimers = Map<string, ReturnType<typeof setTimeout>>

const commentTimers: SaveTimers = new Map()
const billingNoteTimers: SaveTimers = new Map()

function clearTimers (timers: SaveTimers): void {
  for (const timer of timers.values()) clearTimeout(timer)
  timers.clear()
}

// Reads the question when the timer fires, not when it is scheduled, so only the latest text is sent.
function scheduleAnswerSave (
  timers: SaveTimers,
  questionId: string,
  getState: () => FormStore,
  buildPayload: (question: QuestionData) => UpdateFormPayload,
  errorMessage: string
): void {
  const currentToolId = getState().toolId

  const existing = timers.get(questionId)
  if (existing != null) clearTimeout(existing)

  const timer = setTimeout(() => {
    timers.delete(questionId)
    if (getState().toolId !== currentToolId) return
    const freshQuestion = getState().questions.find((q) => q.id === questionId)
    if (freshQuestion == null) return

    void updateFormAnswer(freshQuestion.templateAnswerId, buildPayload(freshQuestion)).catch(() => {
      if (getState().toolId !== currentToolId) return
      toast.error(errorMessage)
      void getState().refetch()
    })
  }, COMMENT_DEBOUNCE_MS)

  timers.set(questionId, timer)
}

export const useFormStore = create<FormStore>((set, get) => ({
  toolId: null,
  questions: [],
  isLoading: false,
  error: null,

  initialize: (toolId, questions) => {
    clearTimers(commentTimers)
    clearTimers(billingNoteTimers)
    set({ toolId, questions, isLoading: false, error: null })
  },

  updateAnswer: (questionId, answer) => {
    const { questions, toolId: currentToolId } = get()
    const question = questions.find((q) => q.id === questionId)
    if (question == null) return

    set({ questions: updateQuestionInList(questions, questionId, { answer }) })

    if (answer == null) return

    void updateFormAnswer(question.templateAnswerId, {
      answers: ANSWER_TO_NUMBER[answer],
      comments: null,
      flag: null
    }).catch(() => {
      if (get().toolId !== currentToolId) return
      toast.error('Failed to save answer. Refreshing data...')
      void get().refetch()
    })
  },

  updateComment: (questionId, comment) => {
    const { questions } = get()
    const question = questions.find((q) => q.id === questionId)
    if (question == null) return

    set({ questions: updateQuestionInList(questions, questionId, { note: comment }) })

    scheduleAnswerSave(
      commentTimers,
      questionId,
      get,
      (fresh) => ({ answers: null, comments: fresh.note, flag: null }),
      'Failed to save comment. Refreshing data...'
    )
  },

  toggleFlag: (questionId) => {
    const { questions, toolId: currentToolId } = get()
    const question = questions.find((q) => q.id === questionId)
    if (question == null) return

    const newFlagged = !question.flagged
    set({ questions: updateQuestionInList(questions, questionId, { flagged: newFlagged }) })

    void updateFormAnswer(question.templateAnswerId, {
      answers: null,
      comments: null,
      flag: newFlagged ? 1 : 0
    }).catch(() => {
      if (get().toolId !== currentToolId) return
      toast.error('Failed to save flag. Refreshing data...')
      void get().refetch()
    })
  },

  toggleBilling: (questionId) => {
    const { questions, toolId: currentToolId } = get()
    const question = questions.find((q) => q.id === questionId)
    if (question == null) return

    // A pending note save would re-send billing as on after it was turned off.
    const pendingNoteSave = billingNoteTimers.get(questionId)
    if (pendingNoteSave != null) clearTimeout(pendingNoteSave)
    billingNoteTimers.delete(questionId)

    const billing = !question.billing
    const billingNote = billing ? question.billingNote : ''
    set({ questions: updateQuestionInList(questions, questionId, { billing, billingNote }) })

    void updateFormAnswer(question.templateAnswerId, {
      answers: null,
      comments: null,
      flag: null,
      billingFlag: billing,
      billingComments: billingNote
    }).catch(() => {
      if (get().toolId !== currentToolId) return
      toast.error('Failed to save billing. Refreshing data...')
      void get().refetch()
    })
  },

  updateBillingNote: (questionId, note) => {
    const { questions } = get()
    const question = questions.find((q) => q.id === questionId)
    if (question == null) return

    set({ questions: updateQuestionInList(questions, questionId, { billingNote: note }) })

    scheduleAnswerSave(
      billingNoteTimers,
      questionId,
      get,
      (fresh) => ({ answers: null, comments: null, flag: null, billingFlag: fresh.billing, billingComments: fresh.billingNote }),
      'Failed to save billing comment. Refreshing data...'
    )
  },

  refetch: async () => {
    const { toolId } = get()
    if (toolId == null) return

    set({ isLoading: true, error: null })
    try {
      const formQuestions = await getToolForm(toolId)
      if (get().toolId !== toolId) return
      const questions = mapFormQuestions(formQuestions)
      set({ questions, isLoading: false })
    } catch (err) {
      if (get().toolId !== toolId) return
      const message = err instanceof Error ? err.message : 'Failed to refresh form'
      set({ error: message, isLoading: false })
      toast.error(message)
    }
  }
}))
