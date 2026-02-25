import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface StoredQuestion {
  templateQuestionId: string
  questionText: string
  templateAnswerId: string
  comments: string
  answers: number | null
  answered: boolean
  subSection: string
  percentages: number | null
  flag: boolean
  standard: string
}

interface RespondQuestionPayload {
  templateQuestionId: string
  answer: string | number
  comments: string
  answered?: boolean
  percentage?: number
  flag?: boolean
}

const initialState: StoredQuestion[] = []

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    storeQuestions: (state, action: PayloadAction<StoredQuestion[]>) => {
      const allQuestions = action.payload
      state = allQuestions.map((question) => ({
        templateQuestionId: question.templateQuestionId,
        questionText: question.questionText,
        templateAnswerId: question.templateAnswerId,
        comments: question.comments,
        answers: question.answers,
        answered: question.answers != null,
        subSection: question.subSection,
        percentages: question.percentages,
        flag: question.flag,
        standard: question.standard
      }))

      return state
    },
    respondQuestion: (state, action: PayloadAction<RespondQuestionPayload>) => {
      const { templateQuestionId, answer, comments, answered = true, percentage, flag } = action.payload
      const questionIndex = state.findIndex((question) => question.templateQuestionId === templateQuestionId)
      if (questionIndex === -1) {
        return
      }
      state[questionIndex] = {
        ...state[questionIndex],
        answers: typeof answer === 'number' ? answer : parseInt(String(answer), 10),
        comments,
        answered,
        percentages: percentage != null ? Math.round(percentage) : null,
        flag: flag ?? state[questionIndex].flag
      }

      return state
    }
  }
})

export const { storeQuestions, respondQuestion } = questionsSlice.actions

export default questionsSlice.reducer
