import { create } from 'zustand'
import { toast } from 'sonner'
import type { AnswerValue, QuestionData } from '@/shared/types'
import { updateFormAnswer } from '@shared/services/api/endpoints/form'
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

const commentTimers = new Map<string, ReturnType<typeof setTimeout>>()

export const useFormStore = create<FormStore>((set, get) => ({
  toolId: null,
  questions: [],
  isLoading: false,
  error: null,

  initialize: (toolId, questions) => {
    for (const timer of commentTimers.values()) clearTimeout(timer)
    commentTimers.clear()
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
    const { questions, toolId: currentToolId } = get()
    const question = questions.find((q) => q.id === questionId)
    if (question == null) return

    set({ questions: updateQuestionInList(questions, questionId, { note: comment }) })

    const existing = commentTimers.get(questionId)
    if (existing != null) clearTimeout(existing)

    const timer = setTimeout(() => {
      commentTimers.delete(questionId)
      if (get().toolId !== currentToolId) return
      const freshQuestion = get().questions.find((q) => q.id === questionId)
      if (freshQuestion == null) return

      void updateFormAnswer(freshQuestion.templateAnswerId, {
        answers: null,
        comments: freshQuestion.note,
        flag: null
      }).catch(() => {
        if (get().toolId !== currentToolId) return
        toast.error('Failed to save comment. Refreshing data...')
        void get().refetch()
      })
    }, COMMENT_DEBOUNCE_MS)

    commentTimers.set(questionId, timer)
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
